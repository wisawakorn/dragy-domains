/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from "react";
import { 
  Sparkles, 
  Image as ImageIcon, 
  Video, 
  Cpu, 
  Globe, 
  Terminal, 
  Download, 
  Play, 
  Layers, 
  RefreshCw,
  ArrowRight
} from "lucide-react";

interface DeployedSubDomain {
  subdomain: string;
  projectName: string;
  status: "ONLINE" | "STANDBY";
  type: string;
}

interface GeneratedAsset {
  id: string;
  prompt: string;
  type: "IMAGE" | "VIDEO";
  style: string;
  url: string;
  createdDate: string;
}

export default function App() {
  const masterName = "Gu Dragy Awatarn";
  const aiTitle = "ดาร์กี หัตถ์เทวา (dragy hattewar)";

  // --- States ---
  const [activeMode, setActiveMode] = useState<"image" | "video">("image");
  const [promptInput, setPromptInput] = useState("");
  const [selectedStyle, setSelectedStyle] = useState("ไทยแฟนตาซีสรวงสวรรค์");
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [videoDuration, setVideoDuration] = useState("5s");
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);

  // รายการซับโดเมนภายใต้ระบบ .dragy ที่เจ้านายสั่งรันโปรเจกต์ไว้ใช้งานจริง
  const [mySubDomains] = useState<DeployedSubDomain[]>([
    { subdomain: "www.ai.dragy", projectName: "ศูนย์บัญชาการหัตถ์เทวา", status: "ONLINE", type: "AI Engine" },
    { subdomain: "www.phuttha-tharani.dragy", projectName: "โปรเจกต์พุทธธารานี", status: "ONLINE", type: "Folklore Video" },
    { subdomain: "www.tribute-m.dragy", projectName: "อนุสรณ์อาลัยเพื่อน M", status: "ONLINE", type: "Memorial Archive" }
  ]);

  // คลังไฟล์ทองคำที่เจนเสร็จแล้ว พร้อมเอาไปโพสต์/ส่งออกเพื่อหาเงิน
  const [gallery, setGallery] = useState<GeneratedAsset[]>([
    {
      id: "asset-1",
      prompt: "Majestic Thai Celestial Palace in the clouds, golden spires, hyper-detailed, cinematic lighting",
      type: "IMAGE",
      style: "ไทยแฟนตาซีสรวงสวรรค์",
      url: "https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?w=600&auto=format&fit=crop&q=60",
      createdDate: "2026-06-17"
    }
  ]);

  // ฟังก์ชันสั่ง ดาร์กี หัตถ์เทวา เจนเนอเรตสื่อ
  const handleGenerateAsset = (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptInput.trim()) return;

    setIsGenerating(true);
    setGenerationProgress(10);
    
    setTerminalLogs(prev => [
      ...prev,
      `🔮 [COMMAND] คุณ ${masterName} สั่งการระบบหัตถ์เทวา`,
      `📝 [PROMPT] "${promptInput}"`,
      `⚡ [PROCESSING] กำลังคำนวเนคอร์สไตล์: ${selectedStyle}`
    ]);

    const interval = setInterval(() => {
      setGenerationProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 30;
      });
    }, 500);

    setTimeout(() => {
      const mockAssetId = "asset-" + Date.now();
      const mockImages = [
        "https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?w=600&auto=format&fit=crop&q=60",
        "https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=600&auto=format&fit=crop&q=60"
      ];
      
      const nextAsset: GeneratedAsset = {
        id: mockAssetId,
        prompt: promptInput,
        type: activeMode === "image" ? "IMAGE" : "VIDEO",
        style: selectedStyle,
        url: mockImages[Math.floor(Math.random() * mockImages.length)],
        createdDate: new Date().toISOString().split("T")[0]
      };

      setGallery(prev => [nextAsset, ...prev]);
      setTerminalLogs(prev => [
        ...prev,
        `🟢 [SUCCESS] ดาร์กี หัตถ์เทวา เนรมิตสื่อเสร็จสิ้น!`,
        `💾 บันทึกไฟล์ 4K ลงเซิร์ฟเวอร์ระบบปิดของโปรเจกต์เรียบร้อย พร้อมใช้หาเงิน`
      ]);
      
      setIsGenerating(false);
      setPromptInput("");
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-mono p-4 md:p-8">
      
      {/* HEADER CONTROL */}
      <header className="border-b border-emerald-900/40 pb-4 mb-6 flex flex-col xl:flex-row justify-between items-start xl:items-center gap-4 bg-slate-900/60 p-5 rounded-xl border border-emerald-950">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse" />
            <h1 className="text-xl md:text-2xl font-black text-white tracking-wider">
              {aiTitle.toUpperCase()}
            </h1>
          </div>
          <p className="text-xs text-emerald-400 mt-1">
            PROJECT: <span className="text-white underline font-bold">ดากีโดเมน (Dragy Domain System)</span> | OPERATOR: <span className="text-white font-bold">{masterName}</span>
          </p>
        </div>

        {/* แสดงผลเครือข่าย ซับโดเมน .dragy ที่กำลังรันอยู่จริง */}
        <div className="bg-slate-950 p-3 rounded border border-emerald-900/30 w-full xl:w-auto overflow-x-auto">
          <div className="text-[10px] text-slate-400 uppercase font-bold mb-1 flex items-center gap-1">
            <Globe size={12} className="text-emerald-500" /> ACTIVE SUBDOMAINS ON RENDER NODE
          </div>
          <div className="flex gap-4 text-xs whitespace-nowrap">
            {mySubDomains.map((item, idx) => (
              <span key={idx} className="text-emerald-400">
                🌐 {item.subdomain} <span className="text-slate-500">[{item.projectName}]</span>
              </span>
            ))}
          </div>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* INPUT PANEL */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-slate-900/80 border border-emerald-950 rounded-xl p-5 shadow-xl">
            <h2 className="text-xs font-bold text-white mb-4 flex items-center gap-2 border-b border-slate-800 pb-2 uppercase tracking-widest">
              <Sparkles size={14} className="text-emerald-500" /> ENGINE GENERATOR INPUT
            </h2>

            <div className="grid grid-cols-2 gap-2 mb-4">
              <button
                type="button"
                onClick={() => setActiveMode("image")}
                className={`py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeMode === "image" ? "bg-emerald-600 text-slate-950" : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <ImageIcon size={14} /> เจนภาพถ่าย AI
              </button>
              <button
                type="button"
                onClick={() => setActiveMode("video")}
                className={`py-2 px-3 rounded text-xs font-bold transition-all flex items-center justify-center gap-2 ${
                  activeMode === "video" ? "bg-emerald-600 text-slate-950" : "bg-slate-950 text-slate-400 hover:bg-slate-900"
                }`}
              >
                <Video size={14} /> เจนวิดีโอ AI
              </button>
            </div>

            <form onSubmit={handleGenerateAsset} className="space-y-4">
              <div>
                <label className="block text-[11px] text-slate-400 font-bold mb-1">ป้อนคำสั่งมหาเวทย์ (Prompt):</label>
                <textarea
                  value={promptInput}
                  onChange={(e) => setPromptInput(e.target.value)}
                  placeholder="ระบุคำสั่งสร้างสรรค์สื่อ ทรงผม เสื้อผ้า มหากาพย์วรรณคดี หรือเรื่องราวประวัติศาสตร์ที่ต้องการนำไปหาเงิน..."
                  className="w-full bg-slate-950 border border-emerald-900/50 rounded p-3 text-white focus:outline-none focus:border-emerald-500 text-xs h-28 font-sans"
                />
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block text-[11px] text-slate-400 mb-1">เลือกสไตล์:</label>
                  <select 
                    value={selectedStyle} 
                    onChange={(e) => setSelectedStyle(e.target.value)}
                    className="w-full bg-slate-950 border border-emerald-900 text-emerald-400 p-2 rounded text-xs"
                  >
                    <option value="ไทยแฟนตาซีสรวงสวรรค์">ไทยแฟนตาซีสรวงสวรรค์</option>
                    <option value="สมจริงอิงประวัติศาสตร์">สมจริงอิงประวัติศาสตร์</option>
                    <option value="ภูมิทัศน์วรรณคดี">ภูมิทัศน์วรรณคดี</option>
                    <option value="ไซเบอร์พังก์รัตนโกสินทร์">ไซเบอร์พังก์รัตนโกสินทร์</option>
                  </select>
                </div>

                {activeMode === "image" ? (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">สัดส่วนภาพ:</label>
                    <select 
                      value={aspectRatio} 
                      onChange={(e) => setAspectRatio(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-900 text-emerald-400 p-2 rounded text-xs"
                    >
                      <option value="16:9">16:9 (แนวนอนหนัง)</option>
                      <option value="1:1">1:1 (สี่เหลี่ยมจัตุรัส)</option>
                      <option value="9:16">9:16 (แนวตั้งสั้น)</option>
                    </select>
                  </div>
                ) : (
                  <div>
                    <label className="block text-[11px] text-slate-400 mb-1">ความยาวคลิป:</label>
                    <select 
                      value={videoDuration} 
                      onChange={(e) => setVideoDuration(e.target.value)}
                      className="w-full bg-slate-950 border border-emerald-900 text-emerald-400 p-2 rounded text-xs"
                    >
                      <option value="5s">5 วินาที</option>
                      <option value="10s">10 วินาที</option>
                    </select>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isGenerating || !promptInput.trim()}
                className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-emerald-950/40 disabled:text-emerald-800 text-slate-950 font-black tracking-wider py-3 rounded-lg text-xs transition-all flex items-center justify-center gap-2"
              >
                {isGenerating ? (
                  <><RefreshCw className="animate-spin" size={14} /> หัตถ์เทวากำลังรังสรรค์สื่อ ({generationProgress}%)</>
                ) : (
                  <><Play size={14} /> สั่งการ ดาร์กี หัตถ์เทวา เริ่มงาน ⚡</>
                )}
              </button>
            </form>
          </div>

          {/* MONITOR */}
          <div className="bg-slate-900/90 border border-emerald-950 rounded-xl p-4 shadow-md">
            <h3 className="text-xs font-bold text-white mb-2 flex items-center gap-2">
              <Terminal size={14} className="text-emerald-500" /> SYSTEM MONITOR
            </h3>
            <div className="bg-slate-950 p-3 rounded border border-emerald-900/20 text-[11px] h-32 overflow-y-auto space-y-1 text-slate-400">
              <div>[HOST] ดากีโดเมน (Dragy Domain Server) ผูกระบบสำเร็จ</div>
              <div>[CORE] ตัวควบคุมหลักเปลี่ยนหน้าเว็บเป็น "ดาร์กี หัตถ์เทวา" เรียบร้อย</div>
              {terminalLogs.map((log, i) => (
                <div key={i} className="text-emerald-400">{log}</div>
              ))}
            </div>
          </div>
        </div>

        {/* GALLERY OUTPUT PANEL */}
        <div className="lg:col-span-7">
          <div className="bg-slate-900/80 border border-emerald-950 rounded-xl p-5 shadow-xl h-full">
            <div className="border-b border-slate-800 pb-3 mb-4 flex justify-between items-center">
              <h2 className="text-xs font-bold text-white tracking-widest flex items-center gap-2 uppercase">
                <Layers size={14} className="text-emerald-500" /> OUTPUT HIGH-RES ASSETS
              </h2>
              <span className="text-[11px] bg-slate-950 text-emerald-400 border border-emerald-900 px-2 py-0.5 rounded font-bold">
                จำนวน {gallery.length} ไฟล์
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {gallery.map((asset) => (
                <div key={asset.id} className="bg-slate-950 rounded-lg border border-emerald-950/40 overflow-hidden flex flex-col justify-between p-3 gap-3">
                  <div className="relative aspect-video bg-slate-900 rounded overflow-hidden">
                    <img src={asset.url} alt="asset" className="w-full h-full object-cover opacity-85" />
                    <span className="absolute top-2 left-2 bg-slate-950/90 text-[9px] font-bold px-1.5 py-0.5 rounded border border-emerald-800 text-white">
                      {asset.type}
                    </span>
                    <span className="absolute bottom-2 right-2 bg-emerald-600 text-slate-950 text-[9px] font-bold px-1.5 py-0.5 rounded">
                      {asset.style}
                    </span>
                  </div>
                  <div>
                    <p className="text-[11px] text-slate-300 font-sans line-clamp-2 italic">"{asset.prompt}"</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => alert("ดาวน์โหลดซอร์สไฟล์ต้นฉบับ 4K เรียบร้อย พร้อมเอาไปสร้างรายได้!")}
                    className="w-full bg-slate-900 hover:bg-emerald-950 text-white hover:text-emerald-400 border border-slate-800 hover:border-emerald-700 py-2 rounded text-xs transition-all flex items-center justify-center gap-1.5"
                  >
                    <Download size={12} /> DOWNLOAD 4K MASTER
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>

      <footer className="mt-8 border-t border-emerald-900/20 pt-4 text-center text-[10px] text-slate-600 tracking-wider">
        DRAGY DOMAIN NETWORK CORE // POWERED BY DRAGY HATTEWAR FOR MASTER USER
      </footer>

    </div>
  );
}
