/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { DeployedSubDomain } from "./types.js";

// ข้อมูลจำลองสำหรับใช้งานในระบบดากีโดเมนย่อย
export const initialSubDomains: DeployedSubDomain[] = [
  { 
    subdomain: "www.ai.dragy", 
    projectName: "ศูนย์บัญชาการหัตถ์เทวา", 
    status: "ONLINE", 
    type: "AI Engine" 
  },
  { 
    subdomain: "www.phuttha-tharani.dragy", 
    projectName: "โปรเจกต์พุทธธารานี", 
    status: "ONLINE", 
    type: "Folklore Video" 
  },
  { 
    subdomain: "www.tribute-m.dragy", 
    projectName: "อนุสรณ์อาลัยเพื่อน M", 
    status: "ONLINE", 
    type: "Memorial Archive" 
  }
];
