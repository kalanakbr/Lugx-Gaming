"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const app_1 = __importDefault(require("./app"));
const data_source_1 = require("./data-source");
const PORT = process.env.PORT || 3003;
data_source_1.AppDataSource.initialize()
    .then(() => {
    console.log('✅ Connected to PostgreSQL');
    app_1.default.listen(PORT, () => {
        console.log(`🚀 Order service running at http://localhost:${PORT}`);
    });
})
    .catch((err) => {
    console.error('❌ DB connection failed', err);
});
