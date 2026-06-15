/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { 
  Search, 
  Globe, 
  Sparkles, 
  Cpu, 
  Coins, 
  Trash2, 
  Plus, 
  Check, 
  DollarSign, 
  TrendingUp, 
  ArrowRight,
  Shield,
  Tag, 
  Activity, 
  Compass, 
  User, 
  Layers, 
  HelpCircle,
  Lightbulb,
  ExternalLink,
  Loader2,
  RefreshCw,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DomainInfo, DnsRecord, AiMetrics, SuggestedDomain, MarketItem } from "./types";
import { INITIAL_OWNED_DOMAINS, INITIAL_PREMIUM_DOMAINS, calculateDomainBaseCost } from "./data";

export default function App() {
  // --- Persistent State Hooks ---
  const [wallet, setWallet] = useState<number>(() => {
    const saved = localStorage.getItem("dragy_wallet");
    return saved ? parseInt(saved) : 5000;
  });

  const [ownedDomains, setOwnedDomains] = useState<DomainInfo[]>(() => {
    const saved = localStorage.getItem("dragy_owned_domains");
    return saved ? JSON.parse(saved) : INITIAL_OWNED_DOMAINS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem("dragy_marketplace");
    return saved ? JSON.parse(saved) : INITIAL_PREMIUM_DOMAINS;
  });

  // Save states to local storage
  useEffect(() => {
    localStorage.setItem("dragy_wallet", wallet.toString());
  }, [wallet]);

  useEffect(() => {
    localStorage.setItem("dragy_owned_domains", JSON.stringify(ownedDomains));
  }, [ownedDomains]);

  useEffect(() => {
    localStorage.setItem("dragy_marketplace", JSON.stringify(marketplaceItems));
  }, [marketplaceItems]);
// แก้ไขบล็อกดักจับชื่อ .dragy อัตโนมัติให้แมตช์กับตัวแปรจริงของคุณ
  useEffect(() => {
    const pathName = window.location.pathname;
    if (pathName && pathName.endsWith('.dragy')) {
      const currentDomain = pathName.substring(1); // ได้ค่า "ชื่อโดเมน.dragy"
      
      // 1. สั่งเอาชื่อโดเมนนี้ยัดใส่กล่องพิมพ์ข้อความบนหน้าเว็บอัตโนมัติ
      if (typeof setDomain === 'function') {
        setDomain(currentDomain);
      }
      
      // 2. สั่งรันฟังก์ชันยิง API หลังบ้านทันทีโดยไม่ต้องรอให้คนกดปุ่ม
      // ให้ลองเช็กดูในไฟล์ App.tsx ของคุณว่าปุ่มกดเดิมใช้ฟังก์ชันไหนระหว่างสองตัวนี้:
      if (typeof evaluateDomain === 'function') {
        evaluateDomain(currentDomain);
      } else if (typeof checkDomain === 'function') {
        checkDomain(currentDomain);
      }
    }
  }, []);
  // --- UI Navigation & Interaction ---
  const [activeTab, setActiveTab] = useState<"search" | "portfolio" | "sandbox" | "marketplace">("search");
  
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [currentLookupResult, setCurrentLookupResult] = useState<{
    domain: string;
    status: "available" | "owned" | "marketplace" | "taken";
    price: number;
    isPremium: boolean;
    seller?: string;
  } | null>(null);

  // DNS form / Managed domain state
  const [selectedManageDomain, setSelectedManageDomain] = useState<string | null>(null);
  const [newDnsType, setNewDnsType] = useState<"A" | "AAAA" | "CNAME" | "TXT">("A");
  const [newDnsName, setNewDnsName] = useState("@");
  const [newDnsValue, setNewDnsValue] = useState("");
  const [newDnsTtl, setNewDnsTtl] = useState(3600);

  // Marketplace listing input
  const [sellPriceInput, setSellPriceInput] = useState<string>("");

  // AI Evaluation section states
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [activeAiMetrics, setActiveAiMetrics] = useState<AiMetrics | null>(null);
  const [evalError, setEvalError] = useState<string | null>(null);

  // Suggestion/Sandbox seed prompt, states
  const [sandboxPrompt, setSandboxPrompt] = useState("");
  const [isGeneratingSuggestions, setIsGeneratingSuggestions] = useState(false);
  const [suggestions, setSuggestions] = useState<SuggestedDomain[]>([]);
  const [suggestionError, setSuggestionError] = useState<string | null>(null);

  // Toast / Status Alerts
  const [toastMessage, setToastMessage] = useState<{ text: string; type: "success" | "error" | "info" } | null>(null);

  const showToast = (text: string, type: "success" | "error" | "info" = "success") => {
    setToastMessage({ text, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 4500);
  };

  // Faucet request for simulated wallet
  const handleFaucet = () => {
    setWallet(prev => prev + 1000);
    showToast("Received 1,000 $DRAGY Faucet utility tokens!", "success");
  };

  // Handle live lookup state whenever search changes
  useEffect(() => {
    if (!searchQuery.trim()) {
      setCurrentLookupResult(null);
      return;
    }

    const rawInput = searchQuery.toLowerCase().trim();
    // Auto appended .dragy logic
    const baseName = rawInput.replace(/\.dragy$/, "");
    const cleanDomainName = baseName ? `${baseName}.dragy` : "";

    if (!cleanDomainName || baseName.includes(".") || baseName.includes(" ")) {
      // Invalid naming or contains subdomains
      setCurrentLookupResult(null);
      return;
    }

    // Check if user already owns it
    const userOwned = ownedDomains.find(d => d.domain === cleanDomainName);
    if (userOwned) {
      setCurrentLookupResult({
        domain: cleanDomainName,
        status: "owned",
        price: userOwned.price,
        isPremium: userOwned.isPremium
      });
      return;
    }

    // Check if listed in Marketplace
    const mktItem = marketplaceItems.find(item => item.domain === cleanDomainName);
    if (mktItem) {
      setCurrentLookupResult({
        domain: cleanDomainName,
        status: "marketplace",
        price: mktItem.price,
        isPremium: mktItem.score >= 80,
        seller: mktItem.seller
      });
      return;
    }

    // Otherwise calculate standard base cost
    const baseCostCalc = calculateDomainBaseCost(cleanDomainName);
    setCurrentLookupResult({
      domain: cleanDomainName,
      status: "available",
      price: baseCostCalc.cost,
      isPremium: baseCostCalc.isPremium
    });
  }, [searchQuery, ownedDomains, marketplaceItems]);

  // Handle Domain registration (instant claim)
  const handleRegisterDomain = (domainName: string, price: number, isPremium: boolean) => {
    if (wallet < price) {
      showToast("Insufficient Balance. Recharge with the faucet button in the header!", "error");
      return;
    }

    // Deduct walllet
    setWallet(prev => prev - price);

    const newDomain: DomainInfo = {
      domain: domainName,
      owner: "You",
      price: price,
      isPremium: isPremium,
      registeredDate: new Date().toISOString().split("T")[0],
      isForSale: false,
      dnsRecords: [
        { id: "def-a", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 }
      ]
    };

    setOwnedDomains(prev => [newDomain, ...prev]);
    showToast(`Successfully registered ${domainName}!`, "success");
    
    // Refresh search results
    setSearchQuery(domainName);
  };

  // Run AI Evaluation via server endpoint
  const evaluateDomainWithAi = async (domainName: string) => {
    setIsEvaluating(true);
    setActiveAiMetrics(null);
    setEvalError(null);

    try {
      const response = await fetch("/api/domain/evaluate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ domain: domainName })
      });

      if (!response.ok) {
        throw new Error("Failed to evaluate with AI service.");
      }

      const data: AiMetrics = await response.json();
      setActiveAiMetrics(data);
      
      // Update owned domains list if we own this domain so it retains evaluation metrics
      setOwnedDomains(prev => prev.map(d => {
        if (d.domain === domainName) {
          return { ...d, aiMetrics: data };
        }
        return d;
      }));

    } catch (err: any) {
      setEvalError(err.message || "An unexpected error occurred during evaluation.");
    } finally {
      setIsEvaluating(false);
    }
  };

  // Generate domains from AI suggestions
  const generateAiSuggestions = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sandboxPrompt.trim()) return;

    setIsGeneratingSuggestions(true);
    setSuggestions([]);
    setSuggestionError(null);

    try {
      const response = await fetch("/api/domain/suggest", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: sandboxPrompt })
      });

      if (!response.ok) {
        throw new Error("Failed to generate custom domain suggestions.");
      }

      const data: SuggestedDomain[] = await response.json();
      setSuggestions(data);
      showToast(`Generated ${data.length} creative ideas!`, "success");
    } catch (err: any) {
      setSuggestionError(err.message || "Unable to load suggestions.");
    } finally {
      setIsGeneratingSuggestions(false);
    }
  };

  // DNS Managing Actions
  const handleAddDnsRecord = (e: React.FormEvent, domainName: string) => {
    e.preventDefault();
    if (!newDnsValue.trim()) return;

    const newRecord: DnsRecord = {
      id: "dns-" + Date.now(),
      type: newDnsType,
      name: newDnsName.trim() || "@",
      value: newDnsValue.trim(),
      ttl: newDnsTtl
    };

    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return {
          ...d,
          dnsRecords: [...d.dnsRecords, newRecord]
        };
      }
      return d;
    }));

    showToast(`Added ${newDnsType} record for ${domainName}`, "success");
    setNewDnsValue("");
    setNewDnsName("@");
  };

  const handleDeleteDnsRecord = (domainName: string, recordId: string) => {
    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return {
          ...d,
          dnsRecords: d.dnsRecords.filter(r => r.id !== recordId)
        };
      }
      return d;
    }));
    showToast("DNS record removed.", "info");
  };

  // Marketplace Actions
  const handleListItem = (domainName: string) => {
    const listPrice = parseInt(sellPriceInput);
    if (isNaN(listPrice) || listPrice <= 0) {
      showToast("Please enter a valid price in $DRAGY.", "error");
      return;
    }

    const domainObject = ownedDomains.find(d => d.domain === domainName);
    if (!domainObject) return;

    // Remove from portfolio owned list (or we can keep it as ours but marked as item on sale)
    // Let's mark it as listed for sale
    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return { ...d, isForSale: true, price: listPrice };
      }
      return d;
    }));

    // Add to marketplace listing
    const score = domainObject.aiMetrics?.score || 72; // default if not evaluated
    const valuation = domainObject.aiMetrics?.valuation || listPrice;

    const item: MarketItem = {
      domain: domainName,
      price: listPrice,
      seller: "You",
      valuation: valuation,
      score: score
    };

    setMarketplaceItems(prev => [item, ...prev]);
    showToast(`Listed ${domainName} on the marketplace for ${listPrice} $DRAGY!`, "success");
    setSellPriceInput("");
  };

  const handleCancelListing = (domainName: string) => {
    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return { ...d, isForSale: false };
      }
      return d;
    }));

    setMarketplaceItems(prev => prev.filter(item => item.domain !== domainName));
    showToast(`Cancelled listing for ${domainName}`, "info");
  };

  const handleBuyMarketItem = (item: MarketItem) => {
    if (wallet < item.price) {
      showToast("Insufficient Balance. Claim free tokens from the Faucet first!", "error");
      return;
    }

    if (item.seller === "You") {
      showToast("You already own this domain!", "error");
      return;
    }

    // Deduct price
    setWallet(prev => prev - item.price);

    // Create domain record
    const baseCostCalc = calculateDomainBaseCost(item.domain);
    const newOwned: DomainInfo = {
      domain: item.domain,
      owner: "You",
      price: item.price,
      isPremium: baseCostCalc.isPremium,
      registeredDate: new Date().toISOString().split("T")[0],
      isForSale: false,
      dnsRecords: [
        { id: "dns-1", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 }
      ],
      aiMetrics: {
        score: item.score,
        valuation: item.valuation,
        category: "Market Acquisition",
        description: `Premium registry purchase of standard domain asset ${item.domain}.`,
        suggestedUses: ["Deploy primary Web3 decentralized hub", "Set up forwarding service for product portfolio"],
        alternatives: []
      }
    };

    setOwnedDomains(prev => [newOwned, ...prev]);
    setMarketplaceItems(prev => prev.filter(i => i.domain !== item.domain));
    showToast(`Successfully purchased ${item.domain}!`, "success");
  };

  // Initial lookup suggest template helper
  const handleQuickSearchTemplate = (term: string) => {
    setSearchQuery(term);
    setActiveTab("search");
  };

  const handleQuickSandboxTemplate = (text: string) => {
    setSandboxPrompt(text);
    setActiveTab("sandbox");
  };

  return (
    <div className="min-h-screen bg-[#0c0e12] text-slate-100 flex flex-col font-sans selection:bg-purple-500/30 selection:text-white">
      
      {/* Header Banner */}
      <header className="border-b border-slate-800 bg-[#0d1117]/80 backdrop-blur-md sticky top-0 z-40 px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          
          {/* Brand/Logo */}
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center shadow-lg shadow-purple-500/20 ring-1 ring-purple-400/30">
              <span className="text-xl font-bold tracking-tight text-white font-display">⚔️</span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-wide text-white font-display">dragy</span>
                <span className="text-xs bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-full px-2 py-0.5 font-mono font-bold uppercase tracking-wider">.dragy</span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium">Decommission Central. Claim Web3 Freedom.</p>
            </div>
          </div>

          {/* Navigation Items */}
          <nav className="flex items-center gap-1.5 bg-slate-900/60 p-1 rounded-xl border border-slate-800">
            <button
              onClick={() => { setActiveTab("search"); setSelectedManageDomain(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "search" 
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/30" 
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Search className="h-3.5 w-3.5" />
              Explore
            </button>
            <button
              onClick={() => { setActiveTab("portfolio"); setSelectedManageDomain(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "portfolio" 
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/30" 
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Layers className="h-3.5 w-3.5" />
              Portfolio ({ownedDomains.length})
            </button>
            <button
              onClick={() => { setActiveTab("sandbox"); setSelectedManageDomain(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "sandbox" 
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/30" 
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Sparkles className="h-3.5 w-3.5" />
              AI Suggester
            </button>
            <button
              onClick={() => { setActiveTab("marketplace"); setSelectedManageDomain(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "marketplace" 
                  ? "bg-purple-600/20 text-purple-200 border border-purple-500/30" 
                  : "text-slate-400 hover:text-slate-300 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Tag className="h-3.5 w-3.5" />
              Market
            </button>
          </nav>

          {/* Wallet Balance Controls */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-gradient-to-r from-slate-950 to-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl">
              <Coins className="h-4 w-4 text-amber-500 animate-pulse" />
              <div className="text-right">
                <span className="text-slate-400 text-[9px] uppercase font-bold block leading-none">Your Tokens</span>
                <span className="text-sm font-bold text-slate-100 font-mono tracking-tight">{wallet.toLocaleString()} $DRAGY</span>
              </div>
            </div>

            {/* Faucet request button */}
            <button
              onClick={handleFaucet}
              title="Request 1,000 Free Play Tokens"
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-xl text-xs font-bold font-mono transition-all duration-200 flex items-center gap-1"
            >
              <Plus className="h-3.5 w-3.5" />
              Faucet
            </button>
          </div>

        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
        {/* Dynamic Warning of Sandbox play limits */}
        <div className="mb-6 bg-slate-900/40 rounded-2xl p-4 border border-indigo-500/15 flex items-start gap-3">
          <Shield className="h-5 w-5 text-indigo-400 shrink-0 mt-0.5" />
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white uppercase font-mono tracking-wide">Dragy Registry Note: </span>
            This workspace utilizes a high-performance offline simulation and custom server engine. You are provided with standard play 
            credits (<span className="text-amber-400">$DRAGY</span>) to register custom domain extensions. Any domain bought or set up 
            can be integrated instantly with the custom DNS parameters interface inside your manager.
          </div>
        </div>

        {/* --- EXPLORE TAB: Lookups, Evaluations and Registries --- */}
        {activeTab === "search" && (
          <div className="space-y-8">
            
            {/* Search Section */}
            <div className="text-center space-y-3 max-w-2xl mx-auto py-6">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono uppercase tracking-widest">
                Search the next TLD star
              </span>
              <h1 className="text-3xl sm:text-4xl font-black text-white tracking-tight font-display">
                Create a digital asset ending in <span className="bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent font-extrabold uppercase">.dragy</span>
              </h1>
              <p className="text-slate-400 text-sm max-w-lg mx-auto">
                Evaluate value dynamically with Gemini neural insights, write decentralized system DNS, and control branding.
              </p>

              {/* Input Form Box */}
              <div className="pt-6 relative max-w-lg mx-auto">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-500">
                    <Search className="h-5 w-5" />
                  </div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Enter brand, name or keyword..."
                    className="w-full pl-11 pr-24 py-3.5 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 transition-all font-mono font-semibold"
                  />
                  <div className="absolute inset-y-0 right-2 pr-1.5 flex items-center pointer-events-none">
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 font-mono font-extrabold px-3 py-1.5 rounded-xl text-xs tracking-wider uppercase">
                      .dragy
                    </span>
                  </div>
                </div>
              </div>

              {/* Quick Suggest Tags */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs">
                <span className="text-slate-500">Popular ideas:</span>
                {["web3-labs", "space-courier", "gold-rush", "cyber-cat", "alpha"].map((term) => (
                  <button
                    key={term}
                    onClick={() => handleQuickSearchTemplate(term)}
                    className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-purple-400 border border-slate-800 rounded-full cursor-pointer transition-all hover:border-purple-500/20"
                  >
                    {term}.dragy
                  </button>
                ))}
              </div>
            </div>

            {/* Results Display Grid */}
            <AnimatePresence mode="wait">
              {currentLookupResult && (
                <motion.div 
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="max-w-2xl mx-auto"
                >
                  <div className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-3xl p-6 border border-slate-800 shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 h-40 w-40 bg-purple-600/5 rounded-full blur-3xl pointer-events-none" />

                    {/* Meta info of lookup */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white font-mono">
                            {currentLookupResult.domain}
                          </h2>
                          {currentLookupResult.isPremium && (
                            <span className="bg-amber-500/15 text-amber-400 border border-amber-500/30 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-md flex items-center gap-1">
                              👑 Premium
                            </span>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2 pt-1 text-slate-400">
                          {currentLookupResult.status === "available" && (
                            <span className="text-emerald-400 font-semibold flex items-center gap-1 text-sm">
                              <Check className="h-4 w-4" /> Available for Immediate Registry
                            </span>
                          )}
                          {currentLookupResult.status === "owned" && (
                            <span className="text-indigo-400 font-semibold flex items-center gap-1 text-sm">
                              <User className="h-4 w-4" /> You own this beautiful asset
                            </span>
                          )}
                          {currentLookupResult.status === "marketplace" && (
                            <span className="text-amber-400 font-semibold flex items-center gap-1 text-sm">
                              <Tag className="h-4 w-4" /> Listed in Market by {currentLookupResult.seller}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Side Price action */}
                      <div className="text-left sm:text-right bg-slate-950/60 p-4 rounded-2xl border border-slate-800/80 min-w-[200px]">
                        <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Registration Cost</p>
                        <div className="flex items-baseline gap-1 pt-1 mb-2">
                          <span className="text-2xl font-black text-amber-400 font-mono">
                            {currentLookupResult.price.toLocaleString()}
                          </span>
                          <span className="text-[10px] text-slate-400 font-bold font-mono">$DRAGY</span>
                        </div>

                        {currentLookupResult.status === "available" && (
                          <button
                            onClick={() => handleRegisterDomain(
                              currentLookupResult.domain, 
                              currentLookupResult.price, 
                              currentLookupResult.isPremium
                            )}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 shadow-md shadow-purple-900/30 font-display flex items-center justify-center gap-2"
                          >
                            <Coins className="h-3.5 w-3.5" /> Claim Domain
                          </button>
                        )}

                        {currentLookupResult.status === "owned" && (
                          <button
                            onClick={() => {
                              setSelectedManageDomain(currentLookupResult.domain);
                              setActiveTab("portfolio");
                            }}
                            className="w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200"
                          >
                            Manage DNS
                          </button>
                        )}

                        {currentLookupResult.status === "marketplace" && (
                          <button
                            onClick={() => handleBuyMarketItem({
                              domain: currentLookupResult.domain,
                              price: currentLookupResult.price,
                              seller: currentLookupResult.seller || "System",
                              valuation: currentLookupResult.price * 1.5,
                              score: currentLookupResult.isPremium ? 90 : 75
                            })}
                            className="w-full py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <DollarSign className="h-3.5 w-3.5" /> Purchase Listing
                          </button>
                        )}
                      </div>
                    </div>

                    {/* AI Evaluation Button block */}
                    <div className="mt-6 pt-6 border-t border-slate-800/80 flex flex-col items-center">
                      <p className="text-xs text-slate-400 mb-3 text-center">
                        Curious about valuation? Ask the Gemini brain tool to perform deep market & semantic score evaluation.
                      </p>
                      
                      <button
                        onClick={() => evaluateDomainWithAi(currentLookupResult.domain)}
                        disabled={isEvaluating}
                        className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-slate-200 hover:text-white border border-slate-800 rounded-2xl text-xs font-bold font-display cursor-pointer transition-all hover:border-purple-500/20 flex items-center gap-2"
                      >
                        {isEvaluating ? (
                          <>
                            <Loader2 className="h-4 w-4 text-purple-400 animate-spin" />
                            <span>Gemini Neural evaluating...</span>
                          </>
                        ) : (
                          <>
                            <Sparkles className="h-4 w-4 text-purple-400" />
                            <span>Run Gemini AI Evaluator</span>
                          </>
                        )}
                      </button>
                    </div>

                    {/* AI Evaluation Core dashboard panel */}
                    {isEvaluating && (
                      <div className="mt-6 p-8 bg-slate-950/40 rounded-2xl border border-slate-800/80 flex flex-col items-center justify-center space-y-3">
                        <Loader2 className="h-8 w-8 text-purple-500 animate-spin" />
                        <p className="text-xs text-slate-400 italic text-center">
                          Extracting pronunciation value, category density, and calculating USD equivalent market index...
                        </p>
                      </div>
                    )}

                    {evalError && (
                      <div className="mt-6 p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
                        <AlertCircle className="h-5 w-5 shrink-0" />
                        <p>{evalError}</p>
                      </div>
                    )}

                    {activeAiMetrics && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-6 pt-6 border-t border-slate-800 overflow-hidden space-y-6"
                      >
                        <div className="flex items-center gap-2">
                          <Activity className="h-4 w-4 text-purple-400" />
                          <h3 className="text-sm font-bold uppercase tracking-wider text-slate-200">Gemini Neural Brain Report</h3>
                        </div>

                        {/* Top metric dials */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                          
                          {/* Premium score */}
                          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Premium Score</span>
                            <div className="my-1.5 relative flex items-center justify-center">
                              <svg className="w-16 h-16 transform -rotate-90">
                                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-slate-800" strokeWidth="4" fill="transparent" />
                                <circle cx="32" cy="32" r="28" stroke="currentColor" className="text-purple-500" strokeWidth="4" fill="transparent" 
                                  strokeDasharray={175.9}
                                  strokeDashoffset={175.9 - (175.9 * activeAiMetrics.score) / 100}
                                />
                              </svg>
                              <span className="absolute text-sm font-black font-mono text-purple-300">{activeAiMetrics.score}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">Index of catchiness</span>
                          </div>

                          {/* Worth estimation */}
                          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Estimated Worth</span>
                            <div className="my-2.5">
                              <span className="text-lg font-black text-emerald-400 font-mono">${activeAiMetrics.valuation.toLocaleString()}</span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">USD conversion value approximation</span>
                          </div>

                          {/* Business Category */}
                          <div className="bg-slate-950/80 p-4 rounded-2xl border border-slate-800 flex flex-col items-center justify-center text-center">
                            <span className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">Category Vector</span>
                            <div className="my-2 px-2.5 py-1 bg-slate-900 border border-slate-800 rounded-xl max-w-full truncate">
                              <span className="text-[11px] font-bold text-indigo-400 tracking-tight block truncate">
                                {activeAiMetrics.category}
                              </span>
                            </div>
                            <span className="text-[10px] text-slate-400 font-medium">SaaS target sector</span>
                          </div>

                        </div>

                        {/* Semantic Pitch */}
                        <div className="bg-slate-950/50 p-4 rounded-xl border border-slate-800/80">
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-1.5">Aesthetic Evaluation Pitch</p>
                          <p className="text-xs text-slate-300 leading-relaxed font-sans">{activeAiMetrics.description}</p>
                        </div>

                        {/* Suggested use cases */}
                        <div>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2.5">Recommended Implementations</p>
                          <ul className="space-y-1.5">
                            {activeAiMetrics.suggestedUses.map((use, index) => (
                              <li key={index} className="flex items-start gap-2 text-xs text-slate-300">
                                <ArrowRight className="h-3.5 w-3.5 text-purple-400 shrink-0 mt-0.5" />
                                <span>{use}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {/* Domain alternative suggestion list */}
                        {activeAiMetrics.alternatives && activeAiMetrics.alternatives.length > 0 && (
                          <div className="pt-2 border-t border-slate-800/60">
                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider mb-2">Alternative Suggestions Generated by AI</p>
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                              {activeAiMetrics.alternatives.map((alt, i) => (
                                <button
                                  key={i}
                                  onClick={() => setSearchQuery(alt)}
                                  className="p-2 bg-slate-950 hover:bg-slate-900 border border-slate-800/80 rounded-xl text-left text-xs font-mono text-indigo-400 hover:text-indigo-300 hover:border-indigo-500/20 cursor-pointer transition-all flex items-center justify-between"
                                >
                                  <span className="truncate">{alt}</span>
                                  <ArrowRight className="h-3 w-3 shrink-0 opacity-40" />
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                      </motion.div>
                    )}

                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        )}

        {/* --- PORTFOLIO TAB: Managed Domain Records --- */}
        {activeTab === "portfolio" && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-display">Manage Your .dragy Space</h1>
                <p className="text-slate-400 text-xs">Configure independent DNS, route CNAME parameters, or list domains for sale.</p>
              </div>

              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono font-bold text-slate-400">
                Holding {ownedDomains.length} Active Domains
              </span>
            </div>

            {ownedDomains.length === 0 ? (
              <div className="bg-slate-950 p-12 rounded-3xl border border-slate-900 text-center space-y-4 max-w-lg mx-auto">
                <Globe className="h-12 w-12 text-slate-600 mx-auto" />
                <h2 className="text-lg font-bold text-slate-300">No Domains Registered Yet</h2>
                <p className="text-slate-500 text-xs leading-relaxed">
                  Go to the Explore tab, insert any creative idea in the search bar, and claim your first .dragy address.
                </p>
                <button
                  onClick={() => setActiveTab("search")}
                  className="px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider"
                >
                  Explore Names Now
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Left portfolio sidebar list */}
                <div className="lg:col-span-1 space-y-3">
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-mono font-bold">Your Web Identities</p>
                  
                  <div className="space-y-2">
                    {ownedDomains.map((d) => (
                      <div
                        key={d.domain}
                        onClick={() => setSelectedManageDomain(d.domain)}
                        className={`p-4 rounded-2xl border cursor-pointer transition-all duration-200 text-left ${
                          selectedManageDomain === d.domain 
                            ? "bg-purple-950/20 border-purple-500 shadow-lg shadow-purple-950/20" 
                            : d.isForSale 
                              ? "bg-amber-950/10 border-amber-500/20 hover:border-slate-700" 
                              : "bg-slate-950 border-slate-900 hover:border-slate-800"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="font-mono font-bold text-sm tracking-tight text-white">{d.domain}</span>
                          {d.isPremium && (
                            <span className="text-[9px] bg-amber-500/10 text-amber-400 border border-amber-500/20 px-1.5 py-0.5 rounded font-bold">
                              Premium
                            </span>
                          )}
                        </div>

                        <div className="flex items-center justify-between gap-2 pt-2 mt-2 border-t border-slate-900 text-[10px] text-slate-500">
                          <span>Registered {d.registeredDate || "2026-06-14"}</span>
                          {d.isForSale ? (
                            <span className="text-amber-400 font-bold flex items-center gap-1">
                              Listed: {d.price} $DRAGY
                            </span>
                          ) : (
                            <span className="text-emerald-400 font-medium">Active Private</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right records config panel or helper template */}
                <div className="lg:col-span-2">
                  <AnimatePresence mode="wait">
                    {selectedManageDomain ? (
                      (() => {
                        const targetDomain = ownedDomains.find(d => d.domain === selectedManageDomain);
                        if (!targetDomain) return null;

                        return (
                          <motion.div
                            key={selectedManageDomain}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            className="bg-slate-950 rounded-3xl p-6 border border-slate-900 space-y-8 shadow-xl"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4">
                              <div className="space-y-1">
                                <div className="flex items-center gap-2">
                                  <span className="text-xl font-bold font-mono text-white">{targetDomain.domain}</span>
                                  {targetDomain.isForSale && (
                                    <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 rounded-md py-0.5 px-2 font-bold flex items-center gap-1">
                                      Listed for Sale
                                    </span>
                                  )}
                                </div>
                                <p className="text-[11px] text-slate-500">Manage DNS records pointing to decentralized hosting systems.</p>
                              </div>

                              {/* Action buttons inside Manage */}
                              <div className="flex items-center gap-2">
                                {targetDomain.isForSale ? (
                                  <button
                                    onClick={() => handleCancelListing(targetDomain.domain)}
                                    className="px-3 py-1.5 bg-rose-950/20 hover:bg-rose-950/30 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-semibold cursor-pointer transition-all"
                                  >
                                    Cancel Sale
                                  </button>
                                ) : (
                                  <div className="flex items-center gap-1.5 bg-slate-900 p-1 rounded-xl border border-slate-800">
                                    <input
                                      type="number"
                                      placeholder="Sell Price ($DRAGY)"
                                      value={sellPriceInput}
                                      onChange={(e) => setSellPriceInput(e.target.value)}
                                      className="bg-slate-950 text-xs px-2.5 py-1 text-slate-200 outline-none w-28 rounded-lg font-mono"
                                    />
                                    <button
                                      onClick={() => handleListItem(targetDomain.domain)}
                                      className="px-3 py-1 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-xs font-bold transition-all"
                                    >
                                      Sell Asset
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* DNS Control Center */}
                            <div className="space-y-4">
                              <div className="flex items-center justify-between">
                                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">Active DNS Records</h3>
                                <span className="text-[10px] text-slate-500">{targetDomain.dnsRecords.length} System Entries</span>
                              </div>

                              {/* Form to insert record */}
                              <form onSubmit={(e) => handleAddDnsRecord(e, targetDomain.domain)} className="grid grid-cols-2 sm:grid-cols-12 gap-2 bg-slate-900/40 p-3 rounded-2xl border border-slate-900">
                                <div className="sm:col-span-2">
                                  <select
                                    value={newDnsType}
                                    onChange={(e: any) => setNewDnsType(e.target.value)}
                                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs font-mono font-bold"
                                  >
                                    <option value="A">A</option>
                                    <option value="AAAA">AAAA</option>
                                    <option value="CNAME">CNAME</option>
                                    <option value="TXT">TXT</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-3">
                                  <input
                                    type="text"
                                    value={newDnsName}
                                    onChange={(e) => setNewDnsName(e.target.value)}
                                    placeholder="HOST (e.g., @, www)"
                                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs font-mono"
                                    required
                                  />
                                </div>

                                <div className="col-span-2 sm:col-span-4">
                                  <input
                                    type="text"
                                    value={newDnsValue}
                                    onChange={(e) => setNewDnsValue(e.target.value)}
                                    placeholder="IP Address or Target Host"
                                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs font-mono"
                                    required
                                  />
                                </div>

                                <div className="sm:col-span-2">
                                  <select
                                    value={newDnsTtl}
                                    onChange={(e) => setNewDnsTtl(parseInt(e.target.value))}
                                    className="w-full bg-slate-950 text-slate-200 border border-slate-800 rounded-xl p-2 text-xs font-mono"
                                  >
                                    <option value={3600}>3600 (1h)</option>
                                    <option value={14400}>14400 (4h)</option>
                                    <option value={86400}>86400 (24h)</option>
                                  </select>
                                </div>

                                <div className="sm:col-span-1">
                                  <button
                                    type="submit"
                                    className="w-full h-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white rounded-xl flex items-center justify-center p-2 hover:from-purple-500 hover:to-indigo-500 transition-all cursor-pointer"
                                    title="Add DNS Record"
                                  >
                                    <Plus className="h-4 w-4" />
                                  </button>
                                </div>
                              </form>

                              {/* Listing table of DNS records */}
                              <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
                                {targetDomain.dnsRecords.map((record) => (
                                  <div key={record.id} className="flex items-center justify-between gap-4 p-3.5 bg-slate-900 border border-slate-900/60 rounded-xl hover:border-slate-800 transition-all font-mono text-xs">
                                    <div className="flex items-center gap-3">
                                      <span className="w-14 text-center py-1 bg-slate-950 text-purple-400 border border-purple-500/10 rounded-md font-bold text-[10px]">
                                        {record.type}
                                      </span>
                                      <span className="font-semibold text-slate-300">{record.name}</span>
                                      <span className="text-slate-500">→</span>
                                      <span className="text-slate-400 break-all">{record.value}</span>
                                    </div>

                                    <div className="flex items-center gap-3">
                                      <span className="text-slate-600 text-[10px]">TTL {record.ttl}</span>
                                      <button
                                        onClick={() => handleDeleteDnsRecord(targetDomain.domain, record.id)}
                                        className="p-1 hover:bg-slate-950 text-slate-500 hover:text-rose-400 rounded-lg transition-all"
                                        title="Delete Record"
                                      >
                                        <Trash2 className="h-3.5 w-3.5" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>

                            </div>

                            {/* Associated AI report inside specific domain */}
                            {targetDomain.aiMetrics ? (
                              <div className="bg-slate-900/30 p-5 rounded-2xl border border-slate-900/80 space-y-3">
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 text-purple-400" />
                                    <span className="text-xs font-bold uppercase tracking-wider text-slate-300">Retained AI Analysis Metrics</span>
                                  </div>
                                  <span className="text-[10px] font-mono font-bold text-emerald-400">Valuation: ${targetDomain.aiMetrics.valuation.toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-slate-400 leading-relaxed font-sans">{targetDomain.aiMetrics.description}</p>
                                <div className="flex flex-wrap gap-1 pt-1">
                                  <span className="text-[10px] bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-0.5 rounded-full font-mono">
                                    Sector: {targetDomain.aiMetrics.category}
                                  </span>
                                  <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-2 py-0.5 rounded-full font-mono">
                                    Brand Index: {targetDomain.aiMetrics.score}/100
                                  </span>
                                </div>
                              </div>
                            ) : (
                              <div className="bg-slate-900/10 p-5 rounded-2xl border border-slate-900/80 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div>
                                  <span className="text-xs font-bold text-slate-300 block">AI Evaluation Pending</span>
                                  <p className="text-[11px] text-slate-500">Evaluate this owned domain with the Gemini engine to view potential USD market metrics.</p>
                                </div>

                                <button
                                  onClick={() => {
                                    setSearchQuery(targetDomain.domain);
                                    setActiveTab("search");
                                    evaluateDomainWithAi(targetDomain.domain);
                                  }}
                                  className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-slate-300 rounded-xl text-xs border border-slate-800 hover:border-purple-500/20 transition-all font-semibold flex items-center gap-1.5 shrink-0"
                                >
                                  <Sparkles className="h-3.5 w-3.5 text-purple-400" />
                                  Run Appraisal
                                </button>
                              </div>
                            )}

                          </motion.div>
                        );
                      })()
                    ) : (
                      <div className="bg-slate-950 p-12 rounded-3xl border border-slate-900 text-center space-y-4 flex flex-col justify-center items-center h-full min-h-[350px]">
                        <Compass className="h-10 w-10 text-slate-600 animate-spin-slow" />
                        <h2 className="text-base font-bold text-slate-300">Select a Domain Address</h2>
                        <p className="text-slate-500 text-xs max-w-sm">
                          Click on any domain from your sidebar portfolio panel to access active DNS modifications and sale listings.
                        </p>
                      </div>
                    )}
                  </AnimatePresence>
                </div>

              </div>
            )}

          </div>
        )}

        {/* --- AI SUGGESTION SANDBOX TAB --- */}
        {activeTab === "sandbox" && (
          <div className="space-y-6 max-w-4xl mx-auto">
            
            <div className="text-center space-y-2 mb-6">
              <span className="px-3 py-1 rounded-full bg-purple-500/10 text-purple-400 border border-purple-500/20 text-xs font-mono uppercase tracking-widest">
                Gemini Generator Interface
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight font-display">
                Create names with <span className="bg-gradient-to-r from-purple-400 to-indigo-400 bg-clip-text text-transparent font-extrabold">Creative Intelligence</span>
              </h1>
              <p className="text-slate-400 text-xs max-w-lg mx-auto">
                Input any concept keyword, business niche, or startup brief. Gemini will design 6 ultra-brandable .dragy identities.
              </p>
            </div>

            {/* Prompt input card form */}
            <div className="bg-slate-950 border border-slate-900 rounded-3xl p-6 shadow-xl relative overflow-hidden">
              <div className="absolute top-0 left-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

              <form onSubmit={generateAiSuggestions} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] text-slate-400 uppercase font-mono font-bold tracking-widest flex items-center gap-1.5">
                    <Activity className="h-3 w-3 text-purple-400" /> Project Brief or Core Keyword
                  </label>
                  <textarea
                    rows={3}
                    placeholder="E.g., A high-performance organic tea micro-brewery startup based in Chiang Mai..."
                    value={sandboxPrompt}
                    onChange={(e) => setSandboxPrompt(e.target.value)}
                    className="w-full bg-slate-900 border border-slate-800 rounded-2xl p-4 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-600/40 focus:border-purple-500 tracking-tight transition-all"
                    required
                  />
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  {/* Template prompts to choose */}
                  <div className="flex items-center gap-1.5 flex-wrap text-xs">
                    <span className="text-slate-500 text-[11px] font-medium">Try templates:</span>
                    {[
                      "Decentralized cloud database storage node",
                      "Cyberpunk mech-fighting anime game",
                      "Exotic solar-powered drone flight hub"
                    ].map((tpl) => (
                      <button
                        type="button"
                        key={tpl}
                        onClick={() => handleQuickSandboxTemplate(tpl)}
                        className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-slate-300 border border-slate-800 rounded-xl transition-all text-[11px]"
                      >
                        {tpl}
                      </button>
                    ))}
                  </div>

                  <button
                    type="submit"
                    disabled={isGeneratingSuggestions}
                    className="px-6 py-3 bg-gradient-to-r from-purple-600 via-purple-700 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-2xl text-xs font-bold uppercase tracking-wider font-display shrink-0 flex items-center justify-center gap-2 cursor-pointer transition-all duration-300"
                  >
                    {isGeneratingSuggestions ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin text-white" />
                        <span>Generating domains...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="h-4 w-4" />
                        <span>Generate .dragy Names</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Error alerts of suggestion service */}
            {suggestionError && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-2xl flex items-center gap-3 text-xs">
                <AlertCircle className="h-5 w-5 shrink-0" />
                <p>{suggestionError}</p>
              </div>
            )}

            {/* Suggestions loading state screen */}
            {isGeneratingSuggestions && (
              <div className="pt-12 text-center space-y-3">
                <Loader2 className="h-10 w-10 text-purple-500 animate-spin mx-auto" />
                <h3 className="text-sm font-bold text-slate-300 font-display">Calculating semantic phonetic matrices...</h3>
                <p className="text-slate-500 text-xs italic">
                  Running keyword expansions and analyzing competitive registry extensions inside Gemini.
                </p>
              </div>
            )}

            {/* Output suggestions dynamic grid result */}
            {suggestions.length > 0 && (
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-purple-400" />
                  <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Gemini Recommended Assets Available for Claim</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {suggestions.map((item, id) => {
                    // Check if they already own it
                    const isAlreadyOwned = ownedDomains.some(od => od.domain === item.domain);
                    // Determine simulated buy cost
                    const costCalc = calculateDomainBaseCost(item.domain);

                    return (
                      <motion.div
                        key={item.domain}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: id * 0.08 }}
                        className="p-5 bg-slate-950 border border-slate-900 rounded-3xl space-y-4 hover:border-indigo-500/25 transition-all text-left relative overflow-hidden flex flex-col justify-between"
                      >
                        <div className="absolute top-0 right-0 h-2 bg-gradient-to-r from-purple-500 to-indigo-500 w-full" />
                        
                        <div className="space-y-1.5">
                          <div className="flex items-center justify-between">
                            <span className="text-lg font-bold font-mono text-white tracking-tight">{item.domain}</span>
                            <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                              item.premiumRating.toLowerCase().includes("premium")
                                ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                                : item.premiumRating.toLowerCase().includes("value")
                                  ? "bg-purple-500/10 text-purple-500 border-purple-500/20"
                                  : "bg-slate-900 text-slate-400 border-slate-800"
                            }`}>
                              {item.premiumRating}
                            </span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] text-slate-500 font-mono">
                            <span>Estimated Worth: <strong className="text-emerald-400">${item.valuation.toLocaleString()}</strong></span>
                            <span>Registered Target: <strong className="text-slate-300">{costCalc.cost} $DRAGY</strong></span>
                          </div>

                          <p className="text-xs text-slate-300 leading-relaxed pt-1 font-sans">{item.description}</p>
                          
                          <div className="bg-slate-900/60 p-2 border border-slate-900 rounded-xl text-[11px] text-slate-400 flex items-start gap-1.5">
                            <User className="h-3 w-3 mt-0.5 text-indigo-400" />
                            <span>Audience: {item.audience}</span>
                          </div>
                        </div>

                        <div className="pt-3 border-t border-slate-900 flex items-center justify-between gap-3">
                          <button
                            onClick={() => {
                              setSearchQuery(item.domain);
                              evaluateDomainWithAi(item.domain);
                              setActiveTab("search");
                            }}
                            className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer transition-all"
                          >
                            <span>Run detailed appraisal</span>
                            <ArrowRight className="h-3.5 w-3.5" />
                          </button>

                          {isAlreadyOwned ? (
                            <span className="text-emerald-400 text-xs font-semibold flex items-center gap-1 bg-emerald-500/10 px-2.5 py-1 rounded-xl">
                              <Check className="h-3.5 w-3.5" /> Owned
                            </span>
                          ) : (
                            <button
                              onClick={() => handleRegisterDomain(item.domain, costCalc.cost, item.premiumRating.toLowerCase().includes("premium"))}
                              className="px-3.5 py-1.5 bg-slate-900 hover:bg-slate-800 text-amber-400 border border-slate-800 hover:border-amber-500/25 rounded-xl text-xs font-bold transition-all uppercase flex items-center gap-1.5 cursor-pointer"
                            >
                              <Coins className="h-3.5 w-3.5 text-amber-500" /> Claim
                            </button>
                          )}
                        </div>

                      </motion.div>
                    );
                  })}
                </div>
              </div>
            )}

          </div>
        )}

        {/* --- MARKETPLACE TAB VIEW --- */}
        {activeTab === "marketplace" && (
          <div className="space-y-6">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h1 className="text-2xl font-bold tracking-tight text-white font-display">Dragy Asset Marketplace</h1>
                <p className="text-slate-400 text-xs">Acquire premium assets listed by other brokers or global community systems.</p>
              </div>

              <span className="bg-slate-900 px-3 py-1.5 rounded-xl border border-slate-800 text-[11px] font-mono font-bold text-slate-400">
                {marketplaceItems.length} Premier Listings Available
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {marketplaceItems.map((item) => (
                <div
                  key={item.domain}
                  className="bg-slate-950 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-left flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-white tracking-tight">{item.domain}</span>
                      <span className="text-[10px] bg-purple-500/10 text-purple-400 border border-purple-500/20 px-1.5 py-0.5 rounded font-bold">
                        Score {item.score}
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
                      <span>Broker: {item.seller}</span>
                      <span>Worth: <strong className="text-emerald-400 font-bold">${item.valuation.toLocaleString()}</strong></span>
                    </div>

                    <div className="bg-slate-900/45 p-2 rounded-xl text-[11px] font-mono border border-slate-900/60 mt-2">
                      <p className="text-slate-500 text-[10px] leading-none uppercase tracking-wide font-bold">Market Price</p>
                      <span className="text-base font-extrabold text-amber-400 block pt-1">{item.price.toLocaleString()} $DRAGY</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-900 flex items-center justify-between gap-2">
                    <button
                      onClick={() => handleQuickSearchTemplate(item.domain)}
                      className="text-[11px] text-slate-400 hover:text-slate-300 font-bold flex items-center gap-1 cursor-pointer"
                    >
                      <span>Inquire AI appraisal</span>
                    </button>

                    {item.seller === "You" ? (
                      <button
                        onClick={() => handleCancelListing(item.domain)}
                        className="px-2.5 py-1.5 bg-rose-950/20 hover:bg-rose-950/30 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer"
                      >
                        Cancel
                      </button>
                    ) : (
                      <button
                        onClick={() => handleBuyMarketItem(item)}
                        className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wide flex items-center gap-1 cursor-pointer"
                      >
                        <Coins className="h-3.5 w-3.5" /> Buy
                      </button>
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

      </main>

      {/* Confetti or Alert toast message absolute notifications */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-50 max-w-sm w-full"
          >
            <div className={`p-4 rounded-2xl border shadow-2xl flex items-start gap-3 text-sm text-left ${
              toastMessage.type === "success" 
                ? "bg-slate-950 border-emerald-500/30 text-emerald-300" 
                : toastMessage.type === "error"
                  ? "bg-slate-950 border-rose-500/30 text-rose-300"
                  : "bg-slate-950 border-blue-500/30 text-blue-300"
            }`}>
              <div className="shrink-0 mt-0.5">
                {toastMessage.type === "success" && <span className="text-emerald-400 text-base">🟢</span>}
                {toastMessage.type === "error" && <span className="text-rose-400 text-base">🔴</span>}
                {toastMessage.type === "info" && <span className="text-blue-400 text-base">🔵</span>}
              </div>
              <div>
                <p className="font-semibold text-white">System Message</p>
                <p className="text-slate-400 text-xs mt-0.5 leading-relaxed">{toastMessage.text}</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Styled Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/40 p-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 Dragy Space Inc. Powered by Gemini Core generative intelligence.</p>
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">DNS Manual</a>
            <a href="#" className="hover:text-slate-400">API Access</a>
            <a href="#" className="hover:text-slate-400">Play Credits Terms</a>
          </div>
        </div>
      </footer>

    </div>
  );
}
