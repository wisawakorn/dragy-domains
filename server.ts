/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// เสิร์ฟไฟล์ Static จากการ Build React
app.use(express.static(path.join(__dirname, "./dist")));

// จำลอง API สำหรับดึงข้อมูลซับโดเมนตระกูล .dragy
app.get("/api/subdomains", (req, res) => {
  res.json([
    { subdomain: "www.ai.dragy", projectName: "ศูนย์บัญชาการหัตถ์เทวา", status: "ONLINE", type: "AI Engine" },
    { subdomain: "www.phuttha-tharani.dragy", projectName: "โปรเจกต์พุทธธารานี", status: "ONLINE", type: "Folklore Video" },
    { subdomain: "www.tribute-m.dragy", projectName: "อนุสรณ์อาลัยเพื่อน M", status: "ONLINE", type: "Memorial Archive" }
  ]);
});

// รองรับ Single Page Application (SPA) ให้วิ่งเข้าหน้าแรกเสมอ
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./dist/index.html"));
});

app.listen(port, () => {
  console.log(`[SERVER] ดาร์กี หัตถ์เทวา ออนไลน์บนพอร์ต ${port}`);
});
