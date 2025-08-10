#!/bin/bash
set -e

LOGFILE="deployment.log"
exec > >(tee -a "$LOGFILE") 2>&1

# Colors
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

timestamp() {
  date +"[%Y-%m-%d %H:%M:%S]"
}

log_msg() {
  echo -e "$(timestamp) $1"
}

log_msg "${YELLOW}🔐 Applying secrets...${NC}"
kubectl apply -f clickhouse-secret.yaml
kubectl apply -f game-service-secret.yaml
kubectl apply -f order-service-secret.yaml
kubectl apply -f postgres-secret.yaml

log_msg "${YELLOW}💾 Creating PersistentVolumeClaim for Postgres...${NC}"
kubectl apply -f postgres-pvc.yaml

log_msg "${YELLOW}🐘 Deploying PostgreSQL...${NC}"
kubectl apply -f postgres-deployment.yaml
kubectl rollout status deployment/postgres-deployment

# Uncomment below if you want local ClickHouse deployment
# log_msg "${YELLOW}📊 Deploying ClickHouse...${NC}"
# kubectl apply -f clickhouse-deployment.yaml
# kubectl rollout status deployment/clickhouse-deployment

log_msg "${YELLOW}📈 Deploying Analytics Service...${NC}"
kubectl apply -f analytics-service-deployment.yaml
kubectl rollout status deployment/analytics-service-deployment

log_msg "${YELLOW}🎨 Deploying Frontend...${NC}"
kubectl apply -f frontend-deployment.yaml
kubectl rollout status deployment/lugx-frontend-deployment

log_msg "${YELLOW}🎮 Deploying Game Service...${NC}"
kubectl apply -f game-service-deployment.yaml
kubectl rollout status deployment/game-service-deployment

log_msg "${YELLOW}🛒 Deploying Order Service...${NC}"
kubectl apply -f order-service-deployment.yaml
kubectl rollout status deployment/order-service-deployment

log_msg "${YELLOW}🌐 Deploying Ingress...${NC}"
kubectl apply -f lugx-ingress.yaml

log_msg "${GREEN}✅ Deployment complete!${NC}"

log_msg "${YELLOW}🔌 Starting Minikube tunnel (may require sudo)...${NC}"
nohup sudo minikube tunnel >/dev/null 2>&1 &

sleep 5

open_service() {
  local name=$1
  local retries=10
  local delay=5
  local url=""

  for ((i=1; i<=retries; i++)); do
    url=$(minikube service "$name" --url 2>/dev/null)
    if [[ -n "$url" ]]; then
      if curl --max-time 5 --silent --head "$url" | grep "200 OK" >/dev/null; then
        log_msg "${GREEN}✅ $name is reachable at $url${NC}"
        if command -v xdg-open &>/dev/null; then
          xdg-open "$url"
        elif command -v open &>/dev/null; then
          open "$url"
        fi
        return
      else
        log_msg "${YELLOW}⏳ $name URL found but not reachable yet. Retrying...${NC}"
      fi
    else
      log_msg "${YELLOW}⏳ Waiting for $name URL... Attempt $i/${retries}${NC}"
    fi
    sleep "$delay"
  done

  log_msg "${YELLOW}⚠️ $name not reachable after $retries attempts.${NC}"
}

log_msg "${YELLOW}🌐 Checking and opening services...${NC}"
open_service game-service
open_service order-service
open_service frontend

log_msg "${GREEN}🚀 All done!${NC}"
