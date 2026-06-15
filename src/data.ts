import { DomainInfo, MarketItem } from "./types";

export const INITIAL_PREMIUM_DOMAINS: MarketItem[] = [
  {
    domain: "ai.dragy",
    price: 3500,
    seller: "Dragy Holdings LLC",
    valuation: 4500,
    score: 98,
    isAuction: true,
    highestBid: 2900,
    minIncrement: 100,
    bids: [
      { id: "b1", bidder: "BlockchainBroker", amount: 2500, time: "2026-06-14 12:00" },
      { id: "b2", bidder: "CyberPioneer", amount: 2900, time: "2026-06-14 14:30" }
    ]
  },
  {
    domain: "crypto.dragy",
    price: 2000,
    seller: "Alpha Ventures",
    valuation: 2200,
    score: 94,
    isAuction: true,
    highestBid: 1400,
    minIncrement: 50,
    bids: [
      { id: "b3", bidder: "DeFiNerd", amount: 1400, time: "2026-06-14 15:00" }
    ]
  },
  {
    domain: "pay.dragy",
    price: 1500,
    seller: "Satoshi G",
    valuation: 1900,
    score: 92,
    isAuction: false
  },
  {
    domain: "cloud.dragy",
    price: 850,
    seller: "SaaS Brokers",
    valuation: 1100,
    score: 88,
    isAuction: false
  },
  {
    domain: "meta.dragy",
    price: 1200,
    seller: "Zuck Fanboy",
    valuation: 1600,
    score: 90,
    isAuction: false
  },
  {
    domain: "gaming.dragy",
    price: 1100,
    seller: "Dragy Holdings LLC",
    valuation: 1300,
    score: 89,
    isAuction: true,
    highestBid: 750,
    minIncrement: 50,
    bids: [
      { id: "b4", bidder: "E-SportsChamp", amount: 750, time: "2026-06-14 11:15" }
    ]
  },
  {
    domain: "chef.dragy",
    price: 350,
    seller: "Gourmet Group",
    valuation: 450,
    score: 78,
    isAuction: false
  },
  {
    domain: "dev.dragy",
    price: 990,
    seller: "Standard Labs",
    valuation: 1400,
    score: 91,
    isAuction: false
  }
];

export const INITIAL_OWNED_DOMAINS: DomainInfo[] = [
  {
    domain: "my-startup.dragy",
    owner: "You",
    price: 120,
    isPremium: false,
    registeredDate: "2026-06-10",
    isForSale: false,
    dnsRecords: [
      { id: "1", type: "A", name: "@", value: "192.168.1.50", ttl: 3600 },
      { id: "2", type: "TXT", name: "_verification", value: "dragy-dns-v1-verified-x903", ttl: 3600 }
    ],
    aiMetrics: {
      score: 72,
      valuation: 180,
      category: "SaaS Startups",
      description: "A solid, highly descriptive and practical domain identity for standard SaaS operations and digital assets.",
      suggestedUses: [
        "Create a simple startup page with direct services overview",
        "Point to internal beta testing links",
        "Set up professional admin redirect emails"
      ],
      alternatives: ["mystartuphq.dragy", "startupgo.dragy", "cleanstartup.dragy"]
    }
  },
  {
    domain: "dragon-ball.dragy",
    owner: "You",
    price: 450,
    isPremium: true,
    registeredDate: "2026-06-12",
    isForSale: false,
    dnsRecords: [
      { id: "1", type: "CNAME", name: "www", value: "ghs.google.com", ttl: 14400 }
    ],
    aiMetrics: {
      score: 86,
      valuation: 550,
      category: "Gaming & Fan Communities",
      description: "An extreme crowd-pleasing, memorable domain that bridges gaming culture, collectibles, and general entertainment.",
      suggestedUses: [
        "Host a fan portal or Wiki database for collectibles",
        "Build a retro community discussion forum",
        "Redirect to private community channels"
      ],
      alternatives: ["dragonballz.dragy", "gokudragy.dragy", "animedrags.dragy"]
    }
  }
];

// Helper to determine base cost based on name characteristics
export function calculateDomainBaseCost(name: string): { cost: number; isPremium: boolean } {
  const clean = name.toLowerCase().replace(/\.dragy$/, "").replace(/[^a-z0-9]/g, "");
  const length = clean.length;
  
  if (length <= 2) {
    return { cost: 1500, isPremium: true };
  } else if (length === 3) {
    return { cost: 600, isPremium: true };
  } else if (length === 4) {
    return { cost: 250, isPremium: true };
  } else {
    // Standard words or long characters
    const commonPremiumWords = ["gold", "play", "tech", "cool", "boss", "free", "shop", "game", "love", "work", "coin", "mine", "blog", "code", "safe", "fast", "web", "app", "link", "fire", "ice", "epic", "easy", "go", "sol", "btc", "eth", "usdt", "thai", "drag"];
    if (commonPremiumWords.some(word => clean.includes(word))) {
      return { cost: 180, isPremium: true };
    }
    return { cost: 12, isPremium: false };
  }
}
