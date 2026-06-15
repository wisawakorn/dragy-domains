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
<<<<<<< HEAD
  Lock,
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
  Database,
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DomainInfo, DnsRecord, AiMetrics, SuggestedDomain, MarketItem } from "./types";
import { INITIAL_OWNED_DOMAINS, INITIAL_PREMIUM_DOMAINS, calculateDomainBaseCost } from "./data";

export default function App() {
  // --- Persistent State Hooks ---
  const [wallet, setWallet] = useState<number>(() => {
    const saved = localStorage.getItem("dragy_wallet");
<<<<<<< HEAD
    return saved ? parseInt(saved) : 15000;
=======
    return saved ? parseInt(saved) : 5000;
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
  });

  const [ownedDomains, setOwnedDomains] = useState<DomainInfo[]>(() => {
    const saved = localStorage.getItem("dragy_owned_domains");
    return saved ? JSON.parse(saved) : INITIAL_OWNED_DOMAINS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem("dragy_marketplace");
    return saved ? JSON.parse(saved) : INITIAL_PREMIUM_DOMAINS;
  });

<<<<<<< HEAD
  // --- MongoDB Admin & Management States ---
  const [dbURIInput, setDbURIInput] = useState("");
  const [dbStats, setDbStats] = useState<{
    connectionURI: string;
    connectionType: string;
    status: string;
    collections: { name: string; count: number }[];
    lastError?: string | null;
  } | null>(null);
  const [dbActivityLogs, setDbActivityLogs] = useState<any[]>([]);
  const [selectedDbCol, setSelectedDbCol] = useState<string>("domains");
  const [colDocumentList, setColDocumentList] = useState<any[]>([]);
  const [mongoQueryJSON, setMongoQueryJSON] = useState("{}");
  const [mongoActionType, setMongoActionType] = useState<"find" | "insertOne" | "updateOne" | "deleteOne">("find");
  const [mongoDataJSON, setMongoDataJSON] = useState("{}");
  const [mongoResultText, setMongoResultText] = useState("");
  const [isDbLoading, setIsDbLoading] = useState(false);
  const [isRetryingDb, setIsRetryingDb] = useState(false);

  // Sync state with standard backend MongoDB backplane
  const syncDatabaseState = async (email: string) => {
    try {
      const response = await fetch("/api/state/sync", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (response.ok) {
        const data = await response.json();
        if (data.user) {
          setWallet(data.user.wallet);
        }
        if (data.ownedDomains) {
          setOwnedDomains(data.ownedDomains);
        }
        if (data.marketplaceItems) {
          setMarketplaceItems(data.marketplaceItems);
        }
        // Fetch MongoDB stats too
        fetchDbStats();
      }
    } catch (err) {
      console.warn("MongoDB state sync failed. Defaulting to local memory engine:", err);
    }
  };

  const fetchDbStats = async () => {
    try {
      const statsRes = await fetch("/api/db/init");
      if (statsRes.ok) {
        const stats = await statsRes.json();
        setDbStats(stats);
      }
      const logsRes = await fetch("/api/db/logs");
      if (logsRes.ok) {
        const logs = await logsRes.json();
        setDbActivityLogs(logs);
      }
    } catch (e) {
      console.warn("Could not retrieve db status.", e);
    }
  };

  const handleRetryConnection = async () => {
    setIsRetryingDb(true);
    showToast("Connecting and verifying SSL handshakes with MongoDB Atlas...", "info");
    try {
      const response = await fetch("/api/db/retry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: currentUser?.email || "PRABUABAN444@gmail.com" })
      });
      if (response.ok) {
        const data = await response.json();
        showToast(data.message, data.success ? "success" : "error");
        fetchDbStats();
      } else {
        showToast("Server returned error when checking database status.", "error");
      }
    } catch (e) {
      showToast("Unable to reach the backend retry endpoint.", "error");
    } finally {
      setIsRetryingDb(false);
    }
  };

  const fetchCollectionDocs = async (collectionName: string) => {
    setIsDbLoading(true);
    try {
      const res = await fetch(`/api/db/docs/${collectionName}`);
      if (res.ok) {
        const docs = await res.json();
        setColDocumentList(docs);
      }
    } catch (e) {
      showToast("Failed to fetch collection documents", "error");
    } finally {
      setIsDbLoading(false);
    }
  };

=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD

  // --- UI Navigation & Interaction ---
  const [activeTab, setActiveTab] = useState<"search" | "portfolio" | "sandbox" | "marketplace" | "mongodb">("search");
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
  
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
<<<<<<< HEAD
  const [sellType, setSellType] = useState<"instant" | "auction">("instant");
  const [bidAmountInput, setBidAmountInput] = useState<{ [domain: string]: string }>({});
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af

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

<<<<<<< HEAD
  // --- Profile session, Authentication & AI Co-pilot states ---
  const [currentUser, setCurrentUser] = useState<{
    email: string;
    username: string;
    avatarSeed: string;
  } | null>(() => {
    const saved = localStorage.getItem("dragy_user");
    return saved ? JSON.parse(saved) : null;
  });

  const [showAuthModal, setShowAuthModal] = useState(() => {
    const saved = localStorage.getItem("dragy_user");
    return !saved;
  });
  const [authEmail, setAuthEmail] = useState("");
  const [authUsername, setAuthUsername] = useState("");

  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [aiChatMessages, setAiChatMessages] = useState<{ sender: "user" | "ai"; text: string; time: string; actions?: any[] }[]>(() => {
    const saved = localStorage.getItem("dragy_ai_chat");
    return saved ? JSON.parse(saved) : [
      {
        sender: "ai",
        text: "สวัสดีครับนายท่าน! ยินดีต้อนรับสู่ศูนย์กลาง Dragy Domain Management 🛡️\n\nผมคือ Drady.ai hattewar Co-pilot ของคุณ ผมคอยเฝ้าระบบและตลาดซื้อขายตลอด 24 ชั่วโมง คุณสามารถสั่งงานผมด้วยเสียงหรือพิมพ์แชทธรรมดาได้เลย ระบบจะรันการอัปเดตและจดทะเบียนจริงให้คุณออโต้ทันทีครับ!\n\nลองพิมพ์สั่งงานเหล่านี้เพื่อเริ่มทดสอบดูนะครับ:\n• 'ขอเหรียญเครดิตฟรีให้ผมหน่อย'\n• 'จดโดเมน richman.dragy'\n• 'ตั้งขายโดเมน dragon-ball.dragy ราคา 1200'\n• 'ช่วยอัปเดต DNS ของ my-startup.dragy ชี้ไปค่า IP 1.2.3.4'",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }
    ];
  });
  const [aiDraftInput, setAiDraftInput] = useState("");
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Sync profile & chat with localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem("dragy_user", JSON.stringify(currentUser));
      syncDatabaseState(currentUser.email);
    } else {
      localStorage.removeItem("dragy_user");
    }
  }, [currentUser]);

  // Initial Load Database Trigger
  useEffect(() => {
    const email = currentUser?.email || "PRABUABAN444@gmail.com";
    syncDatabaseState(email);
    fetchDbStats();
  }, []);

  // ดักจับชื่อโดเมน .dragy จาก URL อัตโนมัติ (เช่น /test.dragy) เพื่อค้นหาและประเมินราคาทันที
  useEffect(() => {
    const pathName = window.location.pathname;
    if (pathName && pathName.endsWith('.dragy')) {
      // ใช้ decodeURIComponent เพื่อรองรับชื่อโดเมนภาษาไทยและอักขระพิเศษอย่างถูกต้อง
      const currentDomain = decodeURIComponent(pathName.substring(1));
      
      // ตั้งค่าคำค้นหาลงในเซิร์ชบล็อกอัตโนมัติ
      setSearchQuery(currentDomain);
      
      // สลับหน้าจอมาที่หน้าแรก (Explore) เพื่อแสดงผลลัพธ์
      setActiveTab("search");
      
      // วิเคราะห์มูลค่าด้วยปัญญาประดิษฐ์ Gemini อัตโนมัติทันที
      evaluateDomainWithAi(currentDomain);
    }
  }, []);

  // Sync documents list on activeTab transitions
  useEffect(() => {
    if (activeTab === "mongodb") {
      fetchDbStats();
      fetchCollectionDocs(selectedDbCol);
    }
  }, [activeTab, selectedDbCol]);

  useEffect(() => {
    localStorage.setItem("dragy_ai_chat", JSON.stringify(aiChatMessages));
  }, [aiChatMessages]);

  // Helper to check if the current user is the authorized administrator
  const isAuthorizedOwner = () => {
    return currentUser?.email === "PRABUABAN444@gmail.com";
  };

  const verifyWritePermission = (actionName: string = "modify data"): boolean => {
    if (!isAuthorizedOwner()) {
      showToast(`🔐 Access Denied: Only PRABUABAN444@gmail.com is authorized to ${actionName}.`, "error");
      return false;
    }
    return true;
  };

  // Faucet request for simulated wallet
  const handleFaucet = async () => {
    if (!verifyWritePermission("claim play tokens from the Faucet")) return;
    const email = currentUser?.email || "PRABUABAN444@gmail.com";
    try {
      const res = await fetch("/api/state/faucet", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        showToast("Claimed +1,000 $DRAGY coins successfully from MongoDB database!", "success");
        fetchDbStats();
      } else {
        throw new Error();
      }
    } catch {
      setWallet(prev => prev + 1000);
      showToast("Received 1,000 $DRAGY Faucet tokens (local backup applied)!", "success");
    }
=======
  // Faucet request for simulated wallet
  const handleFaucet = () => {
    setWallet(prev => prev + 1000);
    showToast("Received 1,000 $DRAGY Faucet utility tokens!", "success");
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
  const handleRegisterDomain = async (domainName: string, price: number, isPremium: boolean) => {
    if (!verifyWritePermission("register new .dragy domains")) return;
    const email = currentUser?.email || "PRABUABAN444@gmail.com";
=======
  const handleRegisterDomain = (domainName: string, price: number, isPremium: boolean) => {
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
    if (wallet < price) {
      showToast("Insufficient Balance. Recharge with the faucet button in the header!", "error");
      return;
    }

<<<<<<< HEAD
    try {
      const records = [{ id: "dns-auto-a", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 }];
      const aiMetrics = activeAiMetrics || {
        score: isPremium ? 85 : 62,
        valuation: price * 1.5,
        category: "Web3 Identity",
        description: `Premium registry purchase of decentralized asset ${domainName}`,
        suggestedUses: ["Decentralized main link", "Custom static redirect service"],
        alternatives: []
      };

      const res = await fetch("/api/state/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          domain: domainName,
          price,
          isPremium,
          dnsRecords: records,
          aiMetrics
        })
      });

      if (res.ok) {
        const data = await res.json();
        setWallet(data.wallet);
        setOwnedDomains(prev => [data.domain, ...prev]);
        showToast(`Successfully registered ${domainName}! Domain saved to MongoDB database portfolio.`, "success");
        setSearchQuery(domainName);
        fetchDbStats();
      } else {
        const errData = await res.json();
        showToast(errData.error || "Failed to catalog domain registration", "error");
      }
    } catch {
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
      showToast(`Successfully registered ${domainName} (Local offline backup)!`, "success");
      setSearchQuery(domainName);
    }
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
    if (!verifyWritePermission("add DNS records")) return;
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
    if (!verifyWritePermission("delete DNS records")) return;
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
    if (!verifyWritePermission("list domains in the marketplace")) return;
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
    const listPrice = parseInt(sellPriceInput);
    if (isNaN(listPrice) || listPrice <= 0) {
      showToast("Please enter a valid price in $DRAGY.", "error");
      return;
    }

    const domainObject = ownedDomains.find(d => d.domain === domainName);
    if (!domainObject) return;

<<<<<<< HEAD
    // Remove from portfolio owned list (or keep as owned but marked as listed)
=======
    // Remove from portfolio owned list (or we can keep it as ours but marked as item on sale)
    // Let's mark it as listed for sale
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return { ...d, isForSale: true, price: listPrice };
      }
      return d;
    }));

    // Add to marketplace listing
    const score = domainObject.aiMetrics?.score || 72; // default if not evaluated
    const valuation = domainObject.aiMetrics?.valuation || listPrice;

<<<<<<< HEAD
    const isAuctionMode = sellType === "auction";
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
    const item: MarketItem = {
      domain: domainName,
      price: listPrice,
      seller: "You",
      valuation: valuation,
<<<<<<< HEAD
      score: score,
      isAuction: isAuctionMode,
      highestBid: isAuctionMode ? listPrice : undefined,
      minIncrement: isAuctionMode ? Math.max(10, Math.floor(listPrice * 0.05)) : undefined,
      bids: []
    };

    setMarketplaceItems(prev => [item, ...prev]);
    showToast(
      isAuctionMode 
        ? `Started auction for ${domainName} with reserve price of ${listPrice} $DRAGY!` 
        : `Listed ${domainName} for instant sale at ${listPrice} $DRAGY!`, 
      "success"
    );
    setSellPriceInput("");
  };

  const handlePlaceBid = (domainName: string, amount: number) => {
    if (!verifyWritePermission("place bids in auctions")) return;
    if (wallet < amount) {
      showToast("Insufficient Balance. Claim free tokens from the Faucet first!", "error");
      return;
    }

    const item = marketplaceItems.find(i => i.domain === domainName);
    if (!item) return;

    if (item.seller === "You") {
      showToast("You cannot bid on your own listing!", "error");
      return;
    }

    const currentHigh = item.highestBid || item.price;
    const minInc = item.minIncrement || 50;
    if (amount < currentHigh + minInc) {
      showToast(`Bid must be at least ${currentHigh + minInc} $DRAGY.`, "error");
      return;
    }

    // Process placing bid
    setWallet(prev => prev - amount); // reserve bid amount

    // Check if the user had a previous bid to refund it
    const myPreviousBid = item.bids?.find(b => b.bidder === "You");
    if (myPreviousBid) {
      setWallet(prev => prev + myPreviousBid.amount); // refund prior reserved amount
    }

    const newBid = {
      id: "bid-" + Date.now(),
      bidder: "You",
      amount: amount,
      time: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setMarketplaceItems(prev => prev.map(i => {
      if (i.domain === domainName) {
        return {
          ...i,
          highestBid: amount,
          bids: [newBid, ...(i.bids || [])]
        };
      }
      return i;
    }));

    showToast(`Successfully placed bid of ${amount} $DRAGY on ${domainName}!`, "success");

    // Clear matching bid input
    setBidAmountInput(prev => ({ ...prev, [domainName]: "" }));

    // Trigger AI / Broker competition!
    setTimeout(() => {
      if (Math.random() < 0.75) {
        const botNames = [
          "DeFi_Whale", "CoinMaster", "AlphaHedge", "SatoshiFan", 
          "Web3Investor", "DomainKing", "CryptoOracle", "ZuckFanboy"
        ].filter(name => name !== item.seller);
        const botName = botNames[Math.floor(Math.random() * botNames.length)];
        
        const botBidAmount = amount + minInc + Math.floor(Math.random() * 3) * minInc;
        
        const botBid = {
          id: "bid-bot-" + Date.now(),
          bidder: botName,
          amount: botBidAmount,
          time: new Date().toISOString().replace("T", " ").substring(0, 16)
        };

        setMarketplaceItems(prevItems => {
          return prevItems.map(i => {
            if (i.domain === domainName) {
              return {
                ...i,
                highestBid: botBidAmount,
                bids: [botBid, ...(i.bids || [])]
              };
            }
            return i;
          });
        });

        // Refund the user's outbid amount
        setWallet(prev => prev + amount);
        showToast(`You have been outbid on ${domainName} by ${botName} for ${botBidAmount} $DRAGY!`, "info");
      }
    }, 1500);
  };

  const handleAcceptHighestBid = (domainName: string) => {
    if (!verifyWritePermission("accept bids on your domains")) return;
    const item = marketplaceItems.find(i => i.domain === domainName);
    if (!item) return;

    if (item.seller !== "You") return;

    const highestBidAmt = item.highestBid || item.price;
    const highestBidder = item.bids && item.bids.length > 0 ? item.bids[0].bidder : "System Merchant";

    // Add highestBidAmt to user's wallet
    setWallet(prev => prev + highestBidAmt);

    // Remove domain from user's owned domains
    setOwnedDomains(prev => prev.filter(d => d.domain !== domainName));

    // Remove from marketplace
    setMarketplaceItems(prev => prev.filter(i => i.domain !== domainName));

    showToast(`Successfully accepted bid of ${highestBidAmt} $DRAGY from ${highestBidder}! Domain ownership transferred.`, "success");
  };

  const triggerSimulatedBidForMe = (domainName: string) => {
    const item = marketplaceItems.find(i => i.domain === domainName);
    if (!item) return;

    if (item.seller !== "You" || !item.isAuction) return;

    const currentHigh = item.highestBid || item.price;
    const minInc = item.minIncrement || 50;

    const botNames = ["DeFi_Whale", "CoinMaster", "AlphaHedge", "SatoshiFan", "Web3Investor", "DomainKing"];
    const botName = botNames[Math.floor(Math.random() * botNames.length)];
    
    const newBidAmount = currentHigh + minInc + Math.floor(Math.random() * 3) * minInc;
    const botBid = {
      id: "bid-sim-" + Date.now(),
      bidder: botName,
      amount: newBidAmount,
      time: new Date().toISOString().replace("T", " ").substring(0, 16)
    };

    setMarketplaceItems(prev => prev.map(i => {
      if (i.domain === domainName) {
        return {
          ...i,
          highestBid: newBidAmount,
          bids: [botBid, ...(i.bids || [])]
        };
      }
      return i;
    }));

    showToast(`New offer received on your domain ${domainName} from ${botName} for ${newBidAmount} $DRAGY!`, "success");
  };

  const handleCancelListing = (domainName: string) => {
    if (!verifyWritePermission("cancel marketplace listings")) return;
=======
      score: score
    };

    setMarketplaceItems(prev => [item, ...prev]);
    showToast(`Listed ${domainName} on the marketplace for ${listPrice} $DRAGY!`, "success");
    setSellPriceInput("");
  };

  const handleCancelListing = (domainName: string) => {
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
    if (!verifyWritePermission("buy domains from the marketplace")) return;
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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

<<<<<<< HEAD
  // Automated AI Agent execution logic
  const handleAiCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyWritePermission("execute AI smart co-pilot commands")) return;
    if (!aiDraftInput.trim()) return;

    const userMsgText = aiDraftInput.trim();
    setAiDraftInput("");

    // Append user message
    const tempTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const userMessageObj = { sender: "user" as const, text: userMsgText, time: tempTime };
    setAiChatMessages(prev => [...prev, userMessageObj]);
    setIsAiThinking(true);

    try {
      const response = await fetch("/api/ai/command", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: userMsgText,
          ownedDomains,
          marketplaceItems,
          wallet,
          email: currentUser?.email
        })
      });

      if (!response.ok) {
        throw new Error("ระบบ AI ไม่ตอบสนองชั่วคราว");
      }

      const resData = await response.json();
      
      const aiReplyText = resData.message;
      const actionsToRun = resData.actions || [];

      // Create new AI Message Object
      const aiResponseObj = {
        sender: "ai" as const,
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        actions: actionsToRun
      };
      
      setAiChatMessages(prev => [...prev, aiResponseObj]);

      // PROCESS STATE ACTIONS DETECTED
      if (actionsToRun.length > 0) {
        actionsToRun.forEach((act: any) => {
          const { type, payload } = act;
          switch (type) {
            case "CLAIM_FAUCET": {
              setWallet(prev => prev + 1000);
              showToast("เครดิตเงินเติมฟรี +1000 $DRAGY อนุมัติโดย AI Co-pilot!", "success");
              break;
            }
            case "REGISTER_DOMAIN": {
              const domName = payload.domain;
              if (!domName) break;
              
              const isTaken = ownedDomains.some(d => d.domain === domName) || marketplaceItems.some(i => i.domain === domName);
              if (isTaken) {
                showToast(`โดเมน ${domName} ถูกจับจองแล้วในระบบ`, "error");
                break;
              }
              const costCalc = calculateDomainBaseCost(domName);
              if (wallet < costCalc.cost) {
                showToast(`ยอดเงินเหรียญไม่พอจด ${domName} (ต้องการ ${costCalc.cost} $DRAGY)`, "error");
                break;
              }

              // Deduct wallet and register
              setWallet(prev => prev - costCalc.cost);
              const registeredObj: DomainInfo = {
                domain: domName,
                owner: "You",
                price: costCalc.cost,
                isPremium: costCalc.isPremium,
                registeredDate: new Date().toISOString().split("T")[0],
                isForSale: false,
                dnsRecords: [
                  { id: "dns-auto-a", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 }
                ]
              };
              setOwnedDomains(prev => [registeredObj, ...prev]);
              showToast(`ลงทะเบียนโดเมนสำเร็จ: ${domName}`, "success");
              break;
            }
            case "ADD_DNS_RECORD": {
              const { domain, type: rType, name: rName, value: rVal, ttl: rTtl } = payload;
              if (!domain || !rVal) break;

              const ownedCheck = ownedDomains.find(d => d.domain === domain);
              if (!ownedCheck) {
                showToast(`คุณไม่ได้เป็นเจ้าของโดเมน ${domain} จึงทำการตั้งค่าไม่ได้`, "error");
                break;
              }

              const newRecord: DnsRecord = {
                id: "dns-ai-" + Date.now(),
                type: rType || "A",
                name: rName || "@",
                value: rVal,
                ttl: rTtl || 3600
              };

              setOwnedDomains(prev => prev.map(d => {
                if (d.domain === domain) {
                  return { ...d, dnsRecords: [...d.dnsRecords, newRecord] };
                }
                return d;
              }));
              showToast(`AI อัปเดตระเบียน DNS ${rType} สำเร็จสำหรับโดเมน ${domain}!`, "success");
              break;
            }
            case "LIST_FOR_SALE": {
              const { domain, price, sellType: sType } = payload;
              if (!domain || !price) break;

              const targetDom = ownedDomains.find(d => d.domain === domain);
              if (!targetDom) {
                showToast(`คุณไม่ใช่เจ้าของโดเมน ${domain}`, "error");
                break;
              }

              setOwnedDomains(prev => prev.map(d => {
                if (d.domain === domain) {
                  return { ...d, isForSale: true, price: price };
                }
                return d;
              }));

              const score = targetDom.aiMetrics?.score || 72;
              const valCost = targetDom.aiMetrics?.valuation || price;
              const isAuctionMode = sType === "auction";

              const mktItem: MarketItem = {
                domain: domain,
                price: price,
                seller: "You",
                valuation: valCost,
                score: score,
                isAuction: isAuctionMode,
                highestBid: isAuctionMode ? price : undefined,
                minIncrement: isAuctionMode ? Math.max(10, Math.floor(price * 0.05)) : undefined,
                bids: []
              };

              setMarketplaceItems(prev => [mktItem, ...prev]);
              showToast(`นำโดเมน ${domain} ขึ้นตลาดสำเร็จด้วยระบบ AI Co-pilot!`, "success");
              break;
            }
            case "PLACE_BID": {
              const { domain, amount } = payload;
              if (!domain || !amount) break;
              
              handlePlaceBid(domain, amount);
              break;
            }
            case "BUY_MARKET_ITEM": {
              const { domain } = payload;
              if (!domain) break;

              const mItem = marketplaceItems.find(i => i.domain === domain);
              if (mItem) {
                handleBuyMarketItem(mItem);
              } else {
                showToast(`ไม่พบรายการโดเมน ${domain} ในตลาดทันที`, "error");
              }
              break;
            }
            default:
              break;
          }
        });
      }

    } catch (err: any) {
      console.error(err);
      setAiChatMessages(prev => [...prev, {
        sender: "ai" as const,
        text: "ขออภัยครับเจ้านาย เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย AI ดรากี้บอท แต่ขอยืนยันว่าคุณสามารถทำรายการจดทะเบียนด่วนหรือประมูลโดเมนทางแท็บต่างๆ ได้ตลอด 100% เลยครับ!",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
            <button
              onClick={() => { setActiveTab("mongodb"); setSelectedManageDomain(null); }}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold tracking-wider uppercase transition-all duration-200 ${
                activeTab === "mongodb" 
                  ? "bg-emerald-600/20 text-emerald-200 border border-emerald-500/30" 
                  : "text-slate-400 hover:text-emerald-300 hover:bg-slate-800/50 border border-transparent"
              }`}
            >
              <Database className="h-3.5 w-3.5 text-emerald-500" />
              MongoDB Admin
            </button>
          </nav>

          {/* Wallet Balance Controls & Profile */}
=======
          </nav>

          {/* Wallet Balance Controls */}
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-xl text-xs font-bold font-mono transition-all duration-200 flex items-center gap-1 cursor-pointer"
=======
              className="px-2.5 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 rounded-xl text-xs font-bold font-mono transition-all duration-200 flex items-center gap-1"
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
            >
              <Plus className="h-3.5 w-3.5" />
              Faucet
            </button>
<<<<<<< HEAD

            {/* User Login/Profile Module */}
            {currentUser ? (
              <div 
                onClick={() => setShowAuthModal(true)}
                className="flex items-center gap-2 bg-indigo-950/40 hover:bg-indigo-950/60 border border-indigo-500/20 px-3 py-1.5 rounded-xl cursor-pointer transition-all"
              >
                <div className="h-6 w-6 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center font-bold text-[10px] text-white">
                  {currentUser.username.substring(0, 2).toUpperCase()}
                </div>
                <div className="text-left hidden md:block">
                  <span className="text-[10px] text-indigo-300 font-semibold uppercase tracking-wide block leading-none">Logged In</span>
                  <span className="text-xs font-bold text-slate-200 font-mono block leading-none">{currentUser.username}</span>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:zoom-6 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-md shadow-indigo-600/20"
              >
                Sign In / Login
              </button>
            )}
=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
          </div>

        </div>
      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8">
        
<<<<<<< HEAD
        {/* Security Ownership Alert Banner */}
        {(!currentUser || currentUser.email !== "PRABUABAN444@gmail.com") ? (
          <div className="mb-6 bg-amber-950/20 rounded-2xl p-4 border border-amber-500/30 flex items-start gap-3">
            <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-amber-400 uppercase font-mono tracking-wide">👁️ Mode: Read-Only Spectator (โหมดผู้เข้าชม) </span>
              <p className="mt-0.5 leading-relaxed text-slate-400">
                คุณเข้าใช้งานในฐานะผู้เข้าชมจำกัดสิทธิ์ ระบบล็อกให้มีเพียงผู้แต่งตั้ง **PRABUABAN** (PRABUABAN444@gmail.com) 
                เป็นคนเดียวที่ได้รับสิทธิ์ยึดครองโดเมน, เพิ่ม/ลบ DNS, ทำธุรกรรมประมูล, รับเคลม Faucet และเข้าแก้ไขคิวรีใน MongoDB Direct Console
              </p>
              <button 
                onClick={() => setShowAuthModal(true)} 
                className="mt-2 text-amber-400 hover:text-amber-300 font-bold underline cursor-pointer hover:scale-102 transition-all flex items-center gap-1 text-[11px]"
              >
                🔐 เข้าสู่ระบบด้วยบัญชีเจ้าของ เพื่อสลับเป็นสิทธิ์แอดมินเต็มรูปแบบ (PRABUABAN)
              </button>
            </div>
          </div>
        ) : (
          <div className="mb-6 bg-emerald-950/25 rounded-2xl p-4 border border-emerald-500/30 flex items-start gap-3">
            <Shield className="h-5 w-5 text-emerald-400 shrink-0 mt-0.5" />
            <div className="text-xs text-slate-300">
              <span className="font-bold text-emerald-400 uppercase font-mono tracking-wide">🟢 Mode: Verified System Creator (ผู้ดูแลระบบสูงสุด) </span>
              <p className="mt-0.5 leading-relaxed text-slate-400">
                ยินดีต้อนรับกลับคุณ **PRABUABAN** (PRABUABAN444@gmail.com)! คุณมีสิทธิ์ขาดเพียงคนเดียวในการแก้ไขข้อมูลทั้งระบบ, 
                การย้ายสิทธิ์โดเมน, การบันทึก DNS และอนุญาตให้รันคำสั่งแก้ไข NoSQL ฐานข้อมูล MongoDB 
              </p>
            </div>
          </div>
        )}
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af

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
<<<<<<< HEAD
                                  <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2 bg-slate-900 border border-slate-800 p-2 rounded-2xl">
                                    <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-xl">
                                      <button
                                        type="button"
                                        onClick={() => setSellType("instant")}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                          sellType === "instant"
                                            ? "bg-purple-600/20 text-purple-200 border border-purple-500/30"
                                            : "text-slate-400 border border-transparent"
                                        }`}
                                      >
                                        Instant Sale
                                      </button>
                                      <button
                                        type="button"
                                        onClick={() => setSellType("auction")}
                                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider transition-all ${
                                          sellType === "auction"
                                            ? "bg-amber-600/20 text-amber-200 border border-amber-500/30"
                                            : "text-slate-400 border border-transparent"
                                        }`}
                                      >
                                        Auction
                                      </button>
                                    </div>
                                    <input
                                      type="number"
                                      placeholder={sellType === "auction" ? "Reserve ($DRAGY)" : "Price ($DRAGY)"}
                                      value={sellPriceInput}
                                      onChange={(e) => setSellPriceInput(e.target.value)}
                                      className="bg-slate-950 text-xs px-2.5 py-1.5 text-slate-200 outline-none w-32 rounded-xl font-mono border border-slate-850"
                                    />
                                    <button
                                      onClick={() => handleListItem(targetDomain.domain)}
                                      className="px-4 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all shrink-0"
                                    >
                                      {sellType === "auction" ? "Start Auction" : "List Asset"}
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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

<<<<<<< HEAD
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {marketplaceItems.map((item) => (
                <div
                  key={item.domain}
                  className="bg-slate-950 border border-slate-900 rounded-2xl p-5 hover:border-slate-800 transition-all text-left flex flex-col justify-between space-y-4 shadow-xl"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="text-base font-bold font-mono text-white tracking-tight">{item.domain}</span>
                      <span className={`text-[10px] border px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                        item.isAuction 
                          ? "bg-amber-500/10 text-amber-500 border-amber-500/20" 
                          : "bg-purple-500/10 text-purple-400 border-purple-500/20"
                      }`}>
                        {item.isAuction ? "🔴 Live Auction" : "🟢 Instant Sale"}
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
                      </span>
                    </div>

                    <div className="text-[11px] text-slate-500 flex items-center justify-between pt-1">
<<<<<<< HEAD
                      <span>Broker: <strong className={item.seller === "You" ? "text-purple-400" : "text-slate-300"}>{item.seller === "You" ? "You (Owner)" : item.seller}</strong></span>
                      <span>USD Appraisal: <strong className="text-emerald-400 font-bold">${item.valuation.toLocaleString()}</strong></span>
                    </div>

                    {/* Cost Indicators */}
                    <div className="bg-[#0e1117] p-3 rounded-xl border border-slate-900">
                      <p className="text-slate-500 text-[10px] leading-none uppercase tracking-wide font-bold">
                        {item.isAuction ? "Highest Bid (เสนอราคาล่าสุด)" : "Market Price (ราคาขายด่วน)"}
                      </p>
                      <span className="text-lg font-black text-amber-400 block pt-1.5 font-mono">
                        {(item.isAuction ? item.highestBid || item.price : item.price).toLocaleString()} $DRAGY
                      </span>
                    </div>

                    {/* Auction Bid History Log Block */}
                    {item.isAuction && (
                      <div className="space-y-1.5">
                        <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Current Bid History</p>
                        {item.bids && item.bids.length > 0 ? (
                          <div className="max-h-[85px] overflow-y-auto bg-slate-900/60 p-2 rounded-xl border border-slate-900 space-y-1 font-mono text-[11px]">
                            {item.bids.map((bid, bId) => (
                              <div key={bid.id || bId} className="flex justify-between items-center text-slate-400 py-0.5 border-b border-slate-950/20 last:border-0">
                                <span className={bid.bidder === "You" ? "text-purple-400 font-bold" : "text-slate-300"}>
                                  {bid.bidder === "You" ? "You (Highest)" : bid.bidder}
                                </span>
                                <span className="text-amber-400 font-semibold">{bid.amount.toLocaleString()} $DRAGY</span>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="bg-slate-900/30 p-2 rounded-xl text-center text-xs text-slate-600 italic">
                            No bids received. Be the first!
                          </div>
                        )}
                      </div>
                    )}
                  </div>

                  {/* Operational actions depending on buyer status */}
                  <div className="pt-3 border-t border-slate-900 space-y-3.5">
                    {/* Dynamic appraisal link */}
                    <div className="flex justify-between items-center">
                      <button
                        onClick={() => handleQuickSearchTemplate(item.domain)}
                        className="text-[10px] text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 cursor-pointer"
                      >
                        <span>Inspect in AI brain</span>
                        <ArrowRight className="h-3 w-3" />
                      </button>
                      <span className="text-[10px] font-mono text-slate-500">Score {item.score}/100</span>
                    </div>

                    {item.seller === "You" ? (
                      <div className="space-y-2">
                        {item.isAuction ? (
                          <div className="grid grid-cols-2 gap-2">
                            <button
                              onClick={() => triggerSimulatedBidForMe(item.domain)}
                              className="py-2 bg-slate-900 hover:bg-slate-850 text-slate-300 border border-slate-800 rounded-xl text-xs font-bold transition-all uppercase flex items-center justify-center gap-1 cursor-pointer"
                              title="Solicit top bids from AI brokers"
                            >
                              ⚡ Counter Bid
                            </button>
                            <button
                              onClick={() => handleAcceptHighestBid(item.domain)}
                              className="py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl text-xs font-black transition-all uppercase flex items-center justify-center gap-1 cursor-pointer"
                            >
                              Accept Bid
                            </button>
                          </div>
                        ) : null}
                        
                        <button
                          onClick={() => handleCancelListing(item.domain)}
                          className="w-full py-2 bg-rose-950/20 hover:bg-rose-950/30 text-rose-300 border border-rose-500/20 rounded-xl text-xs font-bold transition-all uppercase cursor-pointer"
                        >
                          Cancel Listing
                        </button>
                      </div>
                    ) : (
                      <div className="space-y-2.5">
                        {/* Dynamic Bidding input for live auctions */}
                        {item.isAuction ? (
                          <div className="flex items-center gap-1.5 bg-slate-900 p-1.5 rounded-xl border border-slate-800">
                            <input
                              type="number"
                              placeholder={`Min: ${((item.highestBid || item.price) + (item.minIncrement || 50)).toLocaleString()}`}
                              value={bidAmountInput[item.domain] || ""}
                              onChange={(e) => setBidAmountInput(prev => ({ ...prev, [item.domain]: e.target.value }))}
                              className="bg-slate-950 text-xs px-2.5 py-1.5 text-slate-200 outline-none w-full rounded-lg font-mono placeholder:text-slate-650"
                            />
                            <button
                              onClick={() => {
                                const bidAmt = parseInt(bidAmountInput[item.domain] || "");
                                if (isNaN(bidAmt) || bidAmt <= 0) {
                                  showToast("Please enter an amount in $DRAGY.", "error");
                                } else {
                                  handlePlaceBid(item.domain, bidAmt);
                                }
                              }}
                              className="px-4 py-1.5 bg-amber-600 hover:bg-amber-500 text-white rounded-xl text-xs font-bold transition-all uppercase tracking-wider cursor-pointer"
                            >
                              Place Bid
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => handleBuyMarketItem(item)}
                            className="w-full py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all uppercase tracking-wide flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Coins className="h-4 w-4" /> Instant Purchase
                          </button>
                        )}
                      </div>
=======
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
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
                    )}
                  </div>

                </div>
              ))}
            </div>

          </div>
        )}

<<<<<<< HEAD
        {activeTab === "mongodb" && (
          <div className="space-y-8 animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6">
            
            {/* Database Hero Title Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500" />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-emerald-500/10 text-emerald-400 text-xs px-2.5 py-1 rounded-full font-mono font-bold border border-emerald-500/20 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                    LIVE DATABASE AUTHORITY
                  </span>
                  <span className="bg-indigo-500/10 text-indigo-400 text-xs px-2.5 py-1 rounded-full font-mono font-bold border border-indigo-500/20">
                    MongoDB System v6.0
                  </span>
                </div>
                <h2 className="text-3xl font-black text-white tracking-tight font-display mb-1">
                  MongoDB Cloud & Local Configurator
                </h2>
                <p className="text-sm text-slate-400 max-w-xl">
                  Real persistence and transactional state authority. Configure custom connection strings, explore native collections, and execute direct queries using the live Compass emulator.
                </p>
              </div>
              <div className="bg-slate-950/60 border border-slate-800 px-5 py-4 rounded-2xl flex flex-col justify-center shrink-0">
                <span className="text-[10px] uppercase font-bold text-slate-500 block mb-1">Active Database Status</span>
                <div className="flex items-center gap-2">
                  <span className={`h-3 w-3 rounded-full ${dbStats?.status === "CONNECTED" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                  <span className="text-base font-black text-white font-mono">
                    {dbStats?.connectionType || "Local File System Emulation"}
                  </span>
                </div>
                <span className="text-xs text-slate-400 font-mono mt-1 text-left">
                  {dbStats?.connectionURI || "Not Registered"}
                </span>
              </div>
            </div>

            {dbStats?.lastError && (
              <div className="mb-8 bg-amber-950/20 border border-amber-500/30 rounded-3xl p-6 text-left animate-fade-in">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-amber-500/10 rounded-2xl border border-amber-500/20 text-amber-500 font-mono text-xl shrink-0">
                    ⚠️
                  </div>
                  <div className="space-y-2 flex-1">
                    <h4 className="text-sm font-bold text-amber-400 uppercase tracking-wide font-mono">
                      MongoDB Connection Error Detected (SSL Handshake Refused)
                    </h4>
                    <p className="text-xs text-slate-300 leading-relaxed font-sans">
                      {dbStats.lastError}
                    </p>
                    <div className="bg-slate-950/80 border border-slate-800/80 rounded-2xl p-4.5 space-y-2.5">
                      <span className="text-[10px] uppercase font-bold text-slate-400 block font-mono">🔧 How to resolve (ขั้นตอนการแก้ไขข้อผิดพลาด):</span>
                      <ol className="list-decimal list-inside text-xs text-slate-300 space-y-2 font-sans leading-relaxed">
                        <li>กรุณาเข้าสู่ระบบ <strong>MongoDB Atlas Dashboard</strong> ของท่าน <a href="https://cloud.mongodb.com/" target="_blank" rel="noopener noreferrer" className="text-purple-400 font-bold underline hover:text-purple-300 ml-1">คลิกที่นี่เพื่อไปที่ MongoDB Atlas 🔗</a></li>
                        <li>ไปที่เมนู <strong className="text-purple-400">Network Access</strong> (อยู่ใต้แถบ Security ทางซ้ายมือ)</li>
                        <li>คลิกปุ่ม <strong className="text-emerald-400">+ Add IP Address</strong></li>
                        <li>ให้ใส่ไอพี <strong className="text-emerald-400 bg-emerald-950/40 px-1.5 py-0.5 rounded font-mono border border-emerald-500/20">0.0.0.0/0</strong> (เพื่ออนุญาตให้อุปกรณ์และ Cloud Run container ของเราสามารถเชื่อมต่อเซิร์ฟเวอร์ฐานข้อมูลได้)</li>
                        <li>คลิก <strong>Confirm</strong> แล้วรอระบบอัปเดตสถานะ 1 นาที จากนั้นกด <strong>Connect & Verify</strong> ใหม่อีกครั้งครับ!</li>
                      </ol>
                    </div>
                    <div className="pt-2">
                      <button
                        onClick={handleRetryConnection}
                        disabled={isRetryingDb}
                        className="w-full sm:w-auto px-5 py-2.5 bg-amber-500 hover:bg-amber-400 disabled:bg-amber-800 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 shadow-lg"
                      >
                        {isRetryingDb ? (
                          <>
                            <span className="inline-block animate-spin">⏳</span>
                            กำลังทดสอบและตรวจสอบ Handshake... (Verifying...)
                          </>
                        ) : (
                          <>
                            <span>🔄</span>
                            กดเพื่อทดสอบเชื่อมต่อใหม่ทันที (Retry Connection Test)
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              
              {/* Left Column: Dynamic URI Connection & Collections stats */}
              <div className="lg:col-span-1 space-y-8 text-left">
                
                {/* 1. MONGODB_URI Dynamic Connector */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    🔌 Swap Database URI
                  </h3>
                  <p className="text-xs text-slate-400">
                    Paste a dynamic <strong>mongodb+srv://</strong> database string to switch from local emulated storage to a live production database cluster!
                  </p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      placeholder="mongodb+srv://admin:pass@cluster0.abc.mongodb.net/test?retryWrites=true&w=majority"
                      value={dbURIInput}
                      onChange={(e) => setDbURIInput(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-3 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-emerald-500 focus:border-emerald-500"
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={async () => {
                          if (!verifyWritePermission("dynamically configuration of Database DB URI")) return;
                          if (!dbURIInput.trim()) {
                            showToast("Please supply a valid MONGODB_URI string", "error");
                            return;
                          }
                          try {
                            const res = await fetch("/api/db/config", {
                              method: "POST",
                              headers: { "Content-Type": "application/json" },
                              body: JSON.stringify({ uri: dbURIInput, email: currentUser?.email })
                            });
                            if (res.ok) {
                              const d = await res.json();
                              showToast(d.message, d.success ? "success" : "info");
                              fetchDbStats();
                            }
                          } catch (e) {
                            showToast("Failed to post configuration URI.", "error");
                          }
                        }}
                        className="flex-1 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-center rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Connect & Verify
                      </button>
                      <button
                        onClick={() => {
                          setDbURIInput("");
                          showToast("Dynamic URI input cleared.", "info");
                        }}
                        className="px-3 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                </div>

                {/* 2. Collection Navigator */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    📁 Database Collections
                  </h3>
                  <div className="space-y-2.5">
                    {dbStats?.collections.map((col) => (
                      <button
                        key={col.name}
                        onClick={() => {
                          setSelectedDbCol(col.name);
                          fetchCollectionDocs(col.name);
                        }}
                        className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition-all text-left cursor-pointer ${
                          selectedDbCol === col.name 
                            ? "bg-slate-950 border-emerald-500/20 text-emerald-300 shadow" 
                            : "bg-slate-950/40 border-slate-800 hover:bg-slate-950 text-slate-400 hover:text-slate-200"
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span className="text-base select-none">
                            {col.name === "users" ? "👤" : col.name === "domains" ? "🛡️" : "🛒"}
                          </span>
                          <div>
                            <p className="font-bold text-xs font-mono">{col.name}</p>
                            <p className="text-[10px] text-slate-500 block">Collection Namespace</p>
                          </div>
                        </div>
                        <span className="bg-slate-900 border border-slate-800 text-[10px] font-bold px-2 py-0.5 rounded-full font-mono text-slate-300">
                          {col.count} docs
                        </span>
                      </button>
                    ))}
                  </div>

                  <div className="bg-slate-950/50 p-3 rounded-2xl text-[10px] font-mono text-slate-500 space-y-1">
                    <p className="font-bold text-slate-400 uppercase tracking-widest text-[8px] mb-1">💡 Schema Guidelines</p>
                    <p>• <span className="text-emerald-400">users</span> collection: stores emails, avatars & balances.</p>
                    <p>• <span className="text-emerald-400">domains</span> collection: stores .dragy domain meta + dns lists.</p>
                    <p>• <span className="text-emerald-400">marketplace</span> collection: registers active listings.</p>
                  </div>
                </div>

              </div>

              {/* Middle & Right Column: Compass Direct Query, JSON document viewer, live DB log list */}
              <div className="lg:col-span-2 space-y-8 text-left">
                
                {/* 1. Compass Emulator Tool */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      🧭 MongoDB Compass Emulator
                    </h3>
                    <span className="bg-emerald-500/10 text-emerald-400 text-[9px] font-extrabold tracking-widest font-mono px-2 py-0.5 rounded-full border border-emerald-500/20">
                      QUERY EXECUTOR
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">
                    Write native JSON queries to execute operations (find, insertOne, updateOne, deleteOne) on the active collection.
                  </p>

                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-1 space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Action Type</label>
                      <select
                        value={mongoActionType}
                        onChange={(e: any) => setMongoActionType(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
                      >
                        <option value="find">find()</option>
                        <option value="insertOne">insertOne()</option>
                        <option value="updateOne">updateOne()</option>
                        <option value="deleteOne">deleteOne()</option>
                      </select>
                    </div>

                    <div className="md:col-span-1 space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Target Collection</label>
                      <select
                        value={selectedDbCol}
                        onChange={(e: any) => {
                          setSelectedDbCol(e.target.value);
                          fetchCollectionDocs(e.target.value);
                        }}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-slate-300 font-mono focus:outline-none cursor-pointer"
                      >
                        <option value="users">users</option>
                        <option value="domains">domains</option>
                        <option value="marketplace">marketplace</option>
                      </select>
                    </div>

                    <div className="md:col-span-2 space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Query Filter JSON</label>
                      <input
                        type="text"
                        placeholder='{"domain": "ai.dragy"}'
                        value={mongoQueryJSON}
                        onChange={(e) => setMongoQueryJSON(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  </div>

                  {(mongoActionType === "insertOne" || mongoActionType === "updateOne") && (
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider">Payload Document Data JSON</label>
                      <textarea
                        rows={2}
                        placeholder={mongoActionType === "insertOne" ? '{"domain": "cool.dragy", "price": 1000, "owner": "manual@google.com"}' : '{"$set": {"price": 1500}}'}
                        value={mongoDataJSON}
                        onChange={(e) => setMongoDataJSON(e.target.value)}
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white font-mono focus:outline-none"
                      />
                    </div>
                  )}

                  <div className="flex items-center gap-3">
                    <button
                      onClick={async () => {
                        if (!verifyWritePermission("execute direct NoSQL database queries")) return;
                        try {
                          let queryObj = {};
                          let dataObj = {};
                          try {
                            queryObj = JSON.parse(mongoQueryJSON || "{}");
                          } catch {
                            showToast("Query Filter has invalid JSON format", "error");
                            return;
                          }
                          try {
                            dataObj = JSON.parse(mongoDataJSON || "{}");
                          } catch {
                            showToast("Document Data has invalid JSON format", "error");
                            return;
                          }

                          const res = await fetch("/api/db/query", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                              action: mongoActionType,
                              collection: selectedDbCol,
                              query: queryObj,
                              data: dataObj,
                              email: currentUser?.email
                            })
                          });

                          if (res.ok) {
                            const outcome = await res.json();
                            setMongoResultText(JSON.stringify(outcome.result, null, 2));
                            showToast("MongoDB query executed successfully!", "success");
                            fetchCollectionDocs(selectedDbCol);
                            fetchDbStats();
                          } else {
                            const err = await res.json();
                            setMongoResultText(JSON.stringify(err, null, 2));
                            showToast("Query threw an error", "error");
                          }
                        } catch (e: any) {
                          setMongoResultText(e.message || "Execution exception");
                        }
                      }}
                      className="px-6 py-2.5 bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 hover:from-emerald-500 hover:via-teal-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer uppercase font-mono"
                    >
                      db.{selectedDbCol}.{mongoActionType}()
                    </button>
                    <button
                      onClick={() => {
                        setMongoQueryJSON("{}");
                        setMongoDataJSON("{}");
                        setMongoResultText("");
                      }}
                      className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 rounded-xl text-xs font-bold transition-all cursor-pointer"
                    >
                      Reset Playground
                    </button>
                  </div>

                  {mongoResultText && (
                    <div className="space-y-1.5">
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider font-mono">Console Command Output:</p>
                      <pre className="p-4 bg-slate-950 border border-slate-800 rounded-2xl text-[11px] font-mono whitespace-pre text-emerald-450 overflow-x-auto max-h-52">
                        {mongoResultText}
                      </pre>
                    </div>
                  )}
                </div>

                {/* 2. Document Collection Inspector Viewer */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        🔍 Collection JSON Inspector
                      </h3>
                      <p className="text-xs text-slate-400">
                        Inspecting documents inside collection: <strong className="text-emerald-400">{selectedDbCol}</strong>
                      </p>
                    </div>
                    <button
                      onClick={() => fetchCollectionDocs(selectedDbCol)}
                      className="p-1 px-3 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs rounded-lg transition-all cursor-pointer"
                    >
                      🔄 Reload Collection
                    </button>
                  </div>

                  {isDbLoading ? (
                    <div className="p-8 text-center bg-slate-950/40 rounded-2xl border border-slate-800 flex flex-col items-center justify-center space-y-2">
                      <span className="animate-spin h-6 w-6 border-2 border-emerald-500 border-t-transparent rounded-full" />
                      <p className="text-xs text-slate-400 font-mono">Querying database cluster...</p>
                    </div>
                  ) : colDocumentList.length === 0 ? (
                    <div className="p-12 text-center bg-slate-950/40 rounded-2xl border border-slate-800">
                      <p className="text-xs text-slate-400 font-mono text-slate-500">No documents found inside collection {selectedDbCol}. Enter a query to seed records.</p>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-96 overflow-y-auto">
                      {colDocumentList.map((doc, idx) => (
                        <div key={idx} className="bg-slate-950 border border-slate-850 rounded-2xl p-4 font-mono text-[11px] text-slate-300 text-left relative group">
                          <span className="absolute top-3 right-3 text-[10px] text-slate-500">[{idx + 1}]</span>
                          <div className="text-emerald-500 font-semibold mb-1 flex items-center gap-1.5">
                            <span>📄</span>
                            <span>_id: {doc._id || doc.id || "autogenerated"}</span>
                          </div>
                          <pre className="overflow-x-auto whitespace-pre text-slate-300">
                            {JSON.stringify(doc, null, 2)}
                          </pre>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Live Log Rail of database actions */}
                <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl space-y-4">
                  <h3 className="text-base font-bold text-white flex items-center gap-2">
                    📋 Active MongoDB System Query Stream (Real-Time logs)
                  </h3>
                  <p className="text-xs text-slate-400">
                    See logs of actual CRUD queries dispatched to either MongoDB Cloud or the Native Local File Emulator.
                  </p>

                  <div className="bg-slate-950 rounded-2xl border border-slate-805 p-4 max-h-60 overflow-y-auto font-mono text-[10px] space-y-2 divider-y divider-slate-800/20">
                    {dbActivityLogs.length === 0 ? (
                      <p className="text-slate-500 italic text-center p-4">No active queries executed yet. Try registering or searching domains!</p>
                    ) : (
                      dbActivityLogs.map((log) => (
                        <div key={log.id || Math.random()} className="relative py-2 border-b border-slate-900 last:border-b-0 space-y-1 text-left">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-1.5">
                              <span className="bg-slate-900 text-indigo-300 px-1.5 py-0.5 rounded border border-indigo-500/20 text-[9px] uppercase font-bold">
                                {log.connectionType}
                              </span>
                              <span className="font-black text-white uppercase text-[9px] bg-slate-900 px-1 rounded text-slate-400">
                                {log.action}
                              </span>
                              <strong className="text-emerald-400 text-[10px]">
                                {log.collection}
                              </strong>
                            </div>
                            <span className="text-slate-500 text-[9px]">{log.timestamp}</span>
                          </div>
                          <p className="text-slate-400 pl-2">
                            Query parameters: <code className="text-slate-300 text-[10px] bg-indigo-950/20 px-1 rounded">{log.query}</code>
                          </p>
                          <p className="text-slate-400 pl-2 line-clamp-1 truncate">
                            Result size: <code className="text-slate-350">{log.result}</code>
                          </p>
                        </div>
                      ))
                    )}
                  </div>
                </div>

              </div>

            </div>

          </div>
        )}

=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
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
<<<<<<< HEAD
          <p>© 2026 ku.Dragy. ลิขสิทธิ์ถูกต้องตามกฎหมาย ดูแลระบบโดย PRABUABAN / Powered by Gemini Core</p>
=======
          <p>© 2026 Dragy Space Inc. Powered by Gemini Core generative intelligence.</p>
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
          <div className="flex gap-4">
            <a href="#" className="hover:text-slate-400">DNS Manual</a>
            <a href="#" className="hover:text-slate-400">API Access</a>
            <a href="#" className="hover:text-slate-400">Play Credits Terms</a>
          </div>
        </div>
      </footer>

<<<<<<< HEAD
      {/* ========================================================= */}
      {/* 🔐 AUTHENTICATION & LOGIN MANAGEMENT DIALOG (MODAL) */}
      {/* ========================================================= */}
      <AnimatePresence>
        {showAuthModal && (
          <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="max-w-md w-full bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden text-left"
            >
              <div className="absolute top-0 right-0 h-1.5 w-full bg-gradient-to-r from-purple-500 via-indigo-500 to-pink-500" />
              
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <span className="text-xl">🔐</span>
                  <h3 className="text-lg font-black text-white font-display">ku.Dragy Portal</h3>
                </div>
                <button
                  onClick={() => setShowAuthModal(false)}
                  className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-slate-200 text-xs rounded-xl transition-all cursor-pointer"
                >
                  Close
                </button>
              </div>

              {currentUser ? (
                // --- Logged In State View ---
                <div className="space-y-6">
                  <div className="bg-indigo-950/40 border border-indigo-500/20 rounded-2xl p-4 flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-gradient-to-tr from-purple-500 via-indigo-600 to-pink-500 flex items-center justify-center text-lg font-bold text-white shadow-lg">
                      {currentUser.username.substring(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-white font-mono">{currentUser.username}</h4>
                        <span className="bg-purple-500/10 text-purple-400 text-[9px] font-bold px-1.5 py-0.5 rounded-full border border-purple-500/20">Verified Admin</span>
                      </div>
                      <p className="text-xs text-slate-400 font-mono">{currentUser.email}</p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Update Profile Details</h5>
                    <div className="space-y-3">
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Display Name</label>
                        <input
                          type="text"
                          value={authUsername}
                          onChange={(e) => setAuthUsername(e.target.value)}
                          placeholder={currentUser.username}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Email Address</label>
                        <input
                          type="email"
                          value={authEmail}
                          onChange={(e) => setAuthEmail(e.target.value)}
                          placeholder={currentUser.email}
                          className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-3 pt-2">
                      <button
                        onClick={() => {
                          const updated = {
                            email: authEmail.trim() || currentUser.email,
                            username: authUsername.trim() || currentUser.username,
                            avatarSeed: "dragy-updated"
                          };
                          setCurrentUser(updated);
                          showToast("Profile details updated successfully!", "success");
                          setShowAuthModal(false);
                        }}
                        className="flex-1 py-2 bg-gradient-to-r from-purple-600 to-indigo-600 hover:zoom-6 text-white text-xs font-bold rounded-xl shadow-lg transition-all cursor-pointer"
                      >
                        Save Configuration
                      </button>

                      <button
                        onClick={() => {
                          setCurrentUser(null);
                          setAuthUsername("");
                          setAuthEmail("");
                          showToast("Logged out of Dragy Node.", "info");
                        }}
                        className="px-3 py-2 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 text-xs font-bold rounded-xl border border-rose-500/20 transition-all cursor-pointer"
                      >
                        Sign Out
                      </button>
                    </div>
                  </div>
                </div>
              ) : (
                // --- Logged Out Login Form View ---
                <div className="space-y-5">
                  <div className="bg-emerald-950/25 border border-emerald-500/25 p-4 rounded-2xl flex flex-col items-center text-center space-y-1">
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-indigo-400 font-display tracking-tight drop-shadow">
                      ku.Dragy
                    </span>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest font-mono">
                      Decentralized Registry Platform
                    </span>
                  </div>
                  
                  <p className="text-xs text-slate-400 text-center">
                    Sign in with your administrator credentials to secure your digital <strong className="text-emerald-400">ku.Dragy</strong> portfolios.
                  </p>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Username</label>
                      <input
                        type="text"
                        value={authUsername}
                        onChange={(e) => setAuthUsername(e.target.value)}
                        placeholder="e.g. DragyLord"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Admin Email</label>
                      <input
                        type="email"
                        value={authEmail}
                        onChange={(e) => setAuthEmail(e.target.value)}
                        placeholder="PRABUABAN444@gmail.com"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] text-slate-400 font-bold block uppercase mb-1">Keys / Secret Password</label>
                      <input
                        type="password"
                        placeholder="••••••••••••••"
                        className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-white focus:outline-none focus:ring-1 focus:ring-purple-500"
                      />
                    </div>
                  </div>

                  <button
                    onClick={async () => {
                      if (!authUsername || !authEmail) {
                        showToast("Please provide both email and user name.", "error");
                        return;
                      }
                      try {
                        const res = await fetch("/api/auth/google-login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: authEmail.trim(),
                            username: authUsername.trim()
                          })
                        });
                        
                        if (res.ok) {
                          const data = await res.json();
                          setCurrentUser(data.user);
                          showToast(`Successfully registered / authenticated with Google Login: ${data.user.username}`, "success");
                          setShowAuthModal(false);
                          syncDatabaseState(data.user.email);
                        } else {
                          const err = await res.json();
                          showToast(err.error || "Login Verification failed", "error");
                        }
                      } catch {
                        setCurrentUser({
                          email: authEmail.trim(),
                          username: authUsername.trim(),
                          avatarSeed: "user-seed"
                        });
                        showToast(`Offline quick login as ${authUsername}`, "success");
                        setShowAuthModal(false);
                      }
                    }}
                    className="w-full py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-black transition-all cursor-pointer shadow-lg shadow-indigo-600/10 mb-2"
                  >
                    Authenticate Account / Sign In
                  </button>

                  <div className="relative my-3 flex items-center justify-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-slate-800"></div>
                    </div>
                    <span className="relative bg-slate-900 px-3 text-[10px] uppercase font-bold text-slate-500 font-mono">Secure Auth Provider</span>
                  </div>

                  <button
                    onClick={async () => {
                      // Click-to-authorize using official Google email PRABUABAN444@gmail.com
                      const defaultEmail = "PRABUABAN444@gmail.com";
                      const defaultName = "PRABUABAN";
                      try {
                        const res = await fetch("/api/auth/google-login", {
                          method: "POST",
                          headers: { "Content-Type": "application/json" },
                          body: JSON.stringify({
                            email: defaultEmail,
                            username: defaultName
                          })
                        });
                        if (res.ok) {
                          const data = await res.json();
                          setCurrentUser(data.user);
                          showToast(`🟢 Google Single Sign-On Success: ${data.user.email}`, "success");
                          setShowAuthModal(false);
                          syncDatabaseState(data.user.email);
                        } else {
                          throw new Error();
                        }
                      } catch {
                        setCurrentUser({
                          email: defaultEmail,
                          username: defaultName,
                          avatarSeed: "prabu"
                        });
                        showToast("Authenticated as PRABUABAN (Local Fallback)", "success");
                        setShowAuthModal(false);
                      }
                    }}
                    className="w-full py-2.5 bg-white hover:bg-slate-100 text-slate-900 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center justify-center gap-2 border border-slate-200 font-sans shadow shadow-white/5 active:scale-95"
                  >
                    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                      />
                    </svg>
                    Continue with Google Single Sign-In
                  </button>

                  <div className="text-center pt-1">
                    <span className="text-[10px] text-slate-500 font-mono block">
                      Selected Provider: <strong className="text-emerald-400">Google accounts.dragy.id</strong>
                    </span>
                  </div>

                  {/* Copyright Notice */}
                  <div className="text-center pt-3 mt-4 border-t border-slate-800/80">
                    <p className="text-[10px] text-slate-500 font-mono tracking-wide leading-relaxed">
                      © 2026 ku.Dragy. All rights reserved.<br/>
                      ลิขสิทธิ์ถูกต้องตามกฎหมาย ดูแลระบบโดย PRABUABAN
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* 🤖 FLOATING CHAT BUTTON FOR THE AI CO-PILOT COMMAND DRAWER */}
      {/* ========================================================= */}
      <div className="fixed bottom-6 right-6 z-40">
        <button
          onClick={() => setIsAiDrawerOpen(!isAiDrawerOpen)}
          className="relative flex items-center gap-2.5 px-4.5 py-3 sm:px-6 sm:py-3.5 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:from-indigo-500 hover:to-purple-500 text-white font-bold text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-2xl hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-500/30 shadow-purple-500/20 focus:outline-none"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
          </span>
          <span className="font-display flex items-center gap-1.5">
            <span>🤖 Drady.ai hattewar</span>
            <span className="bg-slate-950/40 text-[9px] px-1.5 py-0.5 rounded-full text-indigo-200">LIVE</span>
          </span>
        </button>
      </div>

      {/* ========================================================= */}
      {/* 🤖 SLIDE-IN PANEL FOR INTERACTIVE AI WORKING CO-PILOT */}
      {/* ========================================================= */}
      <AnimatePresence>
        {isAiDrawerOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden pointer-events-none">
            {/* Clickable Overlay to close */}
            <div 
              onClick={() => setIsAiDrawerOpen(false)}
              className="absolute inset-0 bg-slate-950/60 backdrop-blur-xs pointer-events-auto transition-opacity" 
            />

            {/* Float out Panel Container */}
            <div className="absolute inset-y-0 right-0 max-w-md w-full bg-[#0d1017] border-l border-slate-800 shadow-2xl flex flex-col pointer-events-auto">
              
              {/* Header */}
              <div className="p-4 border-b border-slate-850 bg-slate-950/60 flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="h-8 w-8 bg-purple-600/10 border border-purple-500/30 rounded-xl flex items-center justify-center text-lg shadow">
                    🤖
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-white tracking-tight">Drady.ai hattewar</h3>
                    <p className="text-[10px] text-slate-400">Automate configuration, bids and registrations</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      setAiChatMessages([
                        {
                          sender: "ai",
                          text: "ประวัติการแชทถูกเคลียร์เรียบร้อยครับเจ้านาย! สั่งการทำงานใหม่ได้เต็มที่เลยครับ 🤖",
                          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                        }
                      ]);
                    }}
                    title="Clear history"
                    className="p-1 px-2 hover:bg-slate-800 text-slate-400 hover:text-slate-200 rounded text-xs transition-all cursor-pointer"
                  >
                    Clear Chat
                  </button>
                  <button
                    onClick={() => setIsAiDrawerOpen(false)}
                    className="p-1 px-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white text-xs font-bold rounded-lg cursor-pointer"
                  >
                    ✕ Close
                  </button>
                </div>
              </div>

              {/* Chat Message Scroll Window */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4 font-sans text-xs flex flex-col">
                {aiChatMessages.map((msg, id) => (
                  <div 
                    key={id} 
                    className={`flex flex-col max-w-[85%] ${msg.sender === "user" ? "self-end items-end" : "self-start items-start"}`}
                  >
                    <div className="flex items-center gap-2 mb-1 text-[10px] text-slate-500 font-mono">
                      <span>{msg.sender === "user" ? (currentUser?.username || "You") : "Drady.ai hattewar"}</span>
                      <span>•</span>
                      <span>{msg.time}</span>
                    </div>

                    <div 
                      className={`p-3.5 rounded-2xl whitespace-pre-line leading-relaxed ${
                        msg.sender === "user"
                          ? "bg-purple-600 text-white rounded-tr-none text-right"
                          : "bg-slate-900 text-slate-200 border border-slate-850 rounded-tl-none"
                      }`}
                    >
                      {msg.text}

                      {/* Display Actions Taken */}
                      {msg.actions && msg.actions.length > 0 && (
                        <div className="mt-3 pt-2 text-left border-t border-slate-800/60 space-y-1.5">
                          <p className="text-[9px] font-bold text-indigo-300 uppercase tracking-widest font-mono">⚡ Autopilot Executed Actions:</p>
                          {msg.actions.map((act: any, idx: number) => (
                            <div key={idx} className="bg-slate-950 p-1.5 rounded border border-indigo-500/10 text-[10px] font-mono text-indigo-200 flex items-center gap-1.5">
                              <span className="text-emerald-400">✅</span>
                              <span>[{act.type}] {act.payload.domain || act.payload.value || "Request successful"}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="self-start flex flex-col items-start max-w-[80%]">
                    <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-mono mb-1">
                      <span className="animate-spin h-3.5 w-3.5 border-2 border-purple-500 border-t-transparent rounded-full" />
                      <span>Co-pilot writing smart config state...</span>
                    </div>
                    <div className="p-3.5 bg-slate-900 text-slate-400 border border-slate-850 rounded-2xl rounded-tl-none italic animate-pulse">
                      Processing NLP instructions and mapping API payloads...
                    </div>
                  </div>
                )}
              </div>

              {/* Immediate Quick Template Pills */}
              <div className="px-4 py-2 border-t border-slate-850 bg-slate-950/40 flex flex-wrap gap-1.5 justify-start">
                <button 
                  onClick={() => setAiDraftInput("ขอแจกเหรียญฟรี 1,000 $DRAGY เครดิต")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-300 text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all"
                >
                  💵 เคลม Faucet
                </button>
                <button 
                  onClick={() => setAiDraftInput("ช่วยจดโดเมน coin.dragy เคนชิน")}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-300 text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all"
                >
                  🛡️ จดทะเบียน coin.dragy
                </button>
                <button 
                  onClick={() => {
                    const firstOwned = ownedDomains[0]?.domain || "sample.dragy";
                    setAiDraftInput(`ช่วยเปลี่ยน DNS ของ ${firstOwned} ไปที่ IP 8.8.8.8`);
                  }}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-300 text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all"
                >
                  🌐 อัปเดตระเบียน DNS A
                </button>
                <button 
                  onClick={() => {
                    const firstOwned = ownedDomains[0]?.domain || "sample.dragy";
                    setAiDraftInput(`เปิดประมูลขายโดเมน ${firstOwned} ราคา 1500`);
                  }}
                  className="bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-400 hover:text-slate-300 text-[10px] px-2 py-1 rounded-full cursor-pointer transition-all"
                >
                  📈 เปิดประมูลขายโดเมน
                </button>
              </div>

              {/* Chat Input Bar Form */}
              <form onSubmit={handleAiCommandSubmit} className="p-4 bg-slate-950 border-t border-slate-850 flex gap-2">
                <input
                  type="text"
                  value={aiDraftInput}
                  onChange={(e) => setAiDraftInput(e.target.value)}
                  placeholder="พิมพ์คำสั่ง เช่น 'จดโดเมน vip.dragy'..."
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2.5 text-slate-100 placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500 text-xs font-mono"
                />
                <button
                  type="submit"
                  disabled={isAiThinking}
                  className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white rounded-xl text-xs font-bold transition-all uppercase cursor-pointer"
                >
                  Send
                </button>
              </form>

            </div>
          </div>
        )}
      </AnimatePresence>

=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
    </div>
  );
}
