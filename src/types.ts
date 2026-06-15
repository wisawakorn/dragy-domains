export interface DnsRecord {
  id: string;
  type: "A" | "AAAA" | "CNAME" | "TXT";
  name: string; // e.g., "@", "www"
  value: string;
  ttl: number;
}

export interface AiMetrics {
  score: number;
  valuation: number;
  category: string;
  description: string;
  suggestedUses: string[];
  alternatives: string[];
}

export interface DomainInfo {
  domain: string;
  owner: string; // "You", "System", "Registrar"
  price: number; // in $DRAGY
  isPremium: boolean;
  registeredDate?: string;
  dnsRecords: DnsRecord[];
  aiMetrics?: AiMetrics;
  isForSale: boolean;
}

export interface SuggestedDomain {
  domain: string;
  premiumRating: string;
  valuation: number;
  description: string;
  audience: string;
}

<<<<<<< HEAD
export interface Bid {
  id: string;
  bidder: string;
  amount: number;
  time: string;
}

=======
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
export interface MarketItem {
  domain: string;
  price: number;
  seller: string;
  valuation: number;
  score: number;
<<<<<<< HEAD
  isAuction?: boolean;
  highestBid?: number;
  bids?: Bid[];
  auctionEndTime?: string; // ISO string or custom countdown
  minIncrement?: number;
}

=======
}
>>>>>>> b69daee977005acd679ee8c9c66f62781c7ed7af
