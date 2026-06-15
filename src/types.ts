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

export interface MarketItem {
  domain: string;
  price: number;
  seller: string;
  valuation: number;
  score: number;
}
