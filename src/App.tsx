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
  Lock,
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
  Database,
  AlertCircle
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { DomainInfo, DnsRecord, AiMetrics, SuggestedDomain, MarketItem } from "./types";
import { INITIAL_OWNED_DOMAINS, INITIAL_PREMIUM_DOMAINS, calculateDomainBaseCost } from "./data";

export default function App() {
  // --- Persistent State Hooks ---
  const [wallet, setWallet] = useState<number>(() => {
    const saved = localStorage.getItem("dragy_wallet");
    return saved ? parseInt(saved) : 15000;
  });

  const [ownedDomains, setOwnedDomains] = useState<DomainInfo[]>(() => {
    const saved = localStorage.getItem("dragy_owned_domains");
    return saved ? JSON.parse(saved) : INITIAL_OWNED_DOMAINS;
  });

  const [marketplaceItems, setMarketplaceItems] = useState<MarketItem[]>(() => {
    const saved = localStorage.getItem("dragy_marketplace");
    return saved ? JSON.parse(saved) : INITIAL_PREMIUM_DOMAINS;
  });

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

  // --- UI Navigation & Interaction ---
  const [activeTab, setActiveTab] = useState<"search" | "portfolio" | "sandbox" | "marketplace" | "mongodb">("search");
  
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
  const [sellType, setSellType] = useState<"instant" | "auction">("instant");
  const [bidAmountInput, setBidAmountInput] = useState<{ [domain: string]: string }>({});

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
  const handleRegisterDomain = async (domainName: string, price: number, isPremium: boolean) => {
    if (!verifyWritePermission("register new .dragy domains")) return;
    const email = currentUser?.email || "PRABUABAN444@gmail.com";
    if (wallet < price) {
      showToast("Insufficient Balance. Recharge with the faucet button in the header!", "error");
      return;
    }

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
      // Deduct wallet local fallback
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
    if (!verifyWritePermission("add DNS records")) return;
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
    if (!verifyWritePermission("delete DNS records")) return;
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
    if (!verifyWritePermission("list domains in the marketplace")) return;
    const listPrice = parseInt(sellPriceInput);
    if (isNaN(listPrice) || listPrice <= 0) {
      showToast("Please enter a valid price in $DRAGY.", "error");
      return;
    }

    const domainObject = ownedDomains.find(d => d.domain === domainName);
    if (!domainObject) return;

    setOwnedDomains(prev => prev.map(d => {
      if (d.domain === domainName) {
        return { ...d, isForSale: true, price: listPrice };
      }
      return d;
    }));

    // Add to marketplace listing
    const score = domainObject.aiMetrics?.score || 72;
    const valuation = domainObject.aiMetrics?.valuation || listPrice;

    const isAuctionMode = sellType === "auction";
    const item: MarketItem = {
      domain: domainName,
      price: listPrice,
      seller: "You",
      valuation: valuation,
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

    setWallet(prev => prev - amount); // reserve bid amount

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
    setBidAmountInput(prev => ({ ...prev, [domainName]: "" }));

    // Trigger AI Bots competition!
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

        setWallet(prev => prev + amount); // Refund outbid user
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

    setWallet(prev => prev + highestBidAmt);
    setOwnedDomains(prev => prev.filter(d => d.domain !== domainName));
    setMarketplaceItems(prev => prev.filter(i => i.domain !== domainName));

    showToast(`Successfully accepted bid of ${highestBidAmt} $DRAGY from ${highestBidder}! Ownership transferred.`, "success");
  };

  const handleCancelListing = (domainName: string) => {
    if (!verifyWritePermission("cancel marketplace listings")) return;
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
    if (!verifyWritePermission("buy domains from the marketplace")) return;
    if (wallet < item.price) {
      showToast("Insufficient Balance. Claim free tokens from the Faucet first!", "error");
      return;
    }
    if (item.seller === "You") {
      showToast("You already own this domain!", "error");
      return;
    }

    setWallet(prev => prev - item.price);

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

  const handleQuickSearchTemplate = (term: string) => {
    setSearchQuery(term);
    setActiveTab("search");
  };

  const handleQuickSandboxTemplate = (text: string) => {
    setSandboxPrompt(text);
    setActiveTab("sandbox");
  };

  // Automated AI Agent execution logic
  const handleAiCommandSubmit = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!verifyWritePermission("execute AI smart co-pilot commands")) return;
    if (!aiDraftInput.trim()) return;

    const userMsgText = aiDraftInput.trim();
    setAiDraftInput("");

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

      // เพิ่มคำตอบจาก AI ลงในแชท
      setAiChatMessages(prev => [...prev, {
        sender: "ai",
        text: aiReplyText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);

      // หากมี Actions กลับมาให้สั่ง Sync ดาต้าเบสใหม่ทันที
      if (resData.actions && resData.actions.length > 0) {
        syncDatabaseState(currentUser?.email || "PRABUABAN444@gmail.com");
      }

    } catch (err) {
      setAiChatMessages(prev => [...prev, {
        sender: "ai",
        text: "ขออภัยครับเจ้านาย เกิดข้อผิดพลาดในการเชื่อมต่อเครือข่าย AI กรุณาลองใหม่อีกครั้งครับ",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* 
         ประกอบหน้าอินเตอร์เฟซ UI ของเจ้านายตามดีไซน์เดิมด้านล่างนี้ได้เลย 
         (เช่น แถบเมนู บานแชท Co-pilot และเงื่อนไขการเรนเดอร์แท็บ activeTab)
      */}
      <div className="p-6 text-center text-xs text-slate-500">
        Dragy Domains Dashboard Engine v2.5 • MongoDB Backplane Ready
      </div>
    </div>
  );
}
