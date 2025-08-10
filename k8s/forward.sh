#!/bin/bash
set -e

LOGFILE="port-forward.log"
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

log_msg "${YELLOW}🔌 Starting port forwarding for services...${NC}"

# Port forward each service in the background
kubectl port-forward service/game-service 8080:8080 >> "$LOGFILE" 2>&1 &
log_msg "${GREEN}🎮 game-service forwarded to http://localhost:8080${NC}"

kubectl port-forward service/order-service 3003:3003 >> "$LOGFILE" 2>&1 &
log_msg "${GREEN}📦 order-service forwarded to http://localhost:3003${NC}"

kubectl port-forward service/analytics-service 3002:3002 >> "$LOGFILE" 2>&1 &
log_msg "${GREEN}📊 analytics-service forwarded to http://localhost:3002${NC}"

kubectl port-forward service/lugx-frontend-service 8081:80 >> "$LOGFILE" 2>&1 &
log_msg "${GREEN}🌐 frontend forwarded to http://localhost:8081${NC}"

# Wait briefly to ensure ports are open
sleep 3

# Open each service in browser
open_url() {
  local url=$1
  if command -v xdg-open &>/dev/null; then
    xdg-open "$url"
  elif command -v open &>/dev/null; then
    open "$url"
  else
    log_msg "${YELLOW}⚠️ Could not detect browser opener. Please open $url manually.${NC}"
  fi
}

log_msg "${YELLOW}🚀 Opening services in browser...${NC}"
open_url "http://localhost:8080"
open_url "http://localhost:3003"
open_url "http://localhost:3002"
open_url "http://localhost:8081"

log_msg "${GREEN}✅ All services forwarded and opened!${NC}"
