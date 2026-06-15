import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";
import fs from "fs";
import { MongoClient } from "mongodb";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // =========================================================
  // 🗄️ MONGODB CORE ENGINE & SYSTEM QUERY LOGGER
  // =========================================================
  interface DBLog {
    id: string;
    timestamp: string;
    collection: string;
    action: string;
    query: string;
    result: string;
    connectionType: string;
  }

  let dbLogs: DBLog[] = [];

  function pushDBLog(collection: string, action: string, query: any, result: any, connectionType: string) {
    dbLogs.unshift({
      id: "log-" + Date.now() + "-" + Math.floor(Math.random() * 10000),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      collection,
      action,
      query: typeof query === "object" ? JSON.stringify(query) : String(query),
      result: typeof result === "object" ? JSON.stringify(result).substring(0, 350) + (JSON.stringify(result).length > 350 ? "..." : "") : String(result),
      connectionType
    });
    if (dbLogs.length > 50) dbLogs.pop();
  }

  let mongoClient: MongoClient | null = null;
  let useRealMongo = false;
  let realMongoURI = process.env.MONGODB_URI || "";
  let lastMongoError: string | null = null;

  async function getMongoClient() {
    if (useRealMongo && mongoClient) return mongoClient;
    if (!realMongoURI || realMongoURI.trim() === "") {
      useRealMongo = false;
      lastMongoError = "Missing MONGODB_URI environment variable or connection string.";
      return null;
    }
    try {
      // Clean target client
      const client = new MongoClient(realMongoURI);
      await client.connect();
      mongoClient = client;
      useRealMongo = true;
      lastMongoError = null;
      console.log("MongoDB is successfully connected at standard URI scale!");
      return mongoClient;
    } catch (err: any) {
      const errMsg = err.message || String(err);
      console.error("Failed to connect to configured MongoDB. Defaulting to high-performance local file system Emulator.", errMsg);
      
      let friendlyError = errMsg;
      if (errMsg.includes("alert number 80") || errMsg.includes("tlsv1 alert internal error") || errMsg.includes("0A000438") || errMsg.includes("SSL routines")) {
        friendlyError = "IP_ACCESS_DENIED_ALERT_80: MongoDB Atlas rejected the connection. You MUST add IP '0.0.0.0/0' (Allow access from anywhere) to your MongoDB Atlas Network Access whitelist to allow incoming connections from this Cloud Run container environment!";
      }
      
      lastMongoError = friendlyError;
      useRealMongo = false;
      return null;
    }
  }

  // --- LOCAL FILE ENGINE WITH PRE-POPULATED HIGH QUALITY TEST METRICS ---
  const DATA_DIR = path.join(process.cwd(), "db_data");
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  function readLocalCollection(name: string): any[] {
    const filePath = path.join(DATA_DIR, `db_${name}.json`);
    if (!fs.existsSync(filePath)) {
      if (name === "domains") {
        return [
          {
            domain: "my-startup.dragy",
            owner: "PRABUABAN444@gmail.com",
            price: 500,
            isPremium: false,
            registeredDate: "2026-06-14",
            dnsRecords: [
              { id: "dns-1", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 },
              { id: "dns-2", type: "CNAME", name: "www", value: "my-startup.dragy", ttl: 3600 }
            ],
            aiMetrics: {
              score: 78,
              valuation: 650,
              category: "SaaS Startups",
              description: "A solid, highly brandable tech identity suitable for dynamic modern SaaS architectures.",
              suggestedUses: ["Decentralized main portal", "Redirect to product repository", "Private staging environment"],
              alternatives: ["mystartuphub.dragy", "gostartup.dragy", "startupdev.dragy"]
            },
            isForSale: false
          }
        ];
      }
      if (name === "marketplace") {
        return [
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
          }
        ];
      }
      if (name === "users") {
        return [
          {
            email: "PRABUABAN444@gmail.com",
            username: "PRABUABAN (Admin)",
            wallet: 15000,
            avatarSeed: "prabu",
            createdAt: new Date().toISOString()
          }
        ];
      }
      return [];
    }
    try {
      return JSON.parse(fs.readFileSync(filePath, "utf-8"));
    } catch (err) {
      console.error(`Error reading db file ${name}:`, err);
      return [];
    }
  }

  function writeLocalCollection(name: string, data: any[]) {
    const filePath = path.join(DATA_DIR, `db_${name}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf-8");
  }

  const DragyDB = {
    async find(collectionName: string, query: any = {}) {
      try {
        const client = await getMongoClient();
        if (client && useRealMongo) {
          const db = client.db("dragy_dns");
          const results = await db.collection(collectionName).find(query).toArray();
          pushDBLog(collectionName, "find", query, results, "MongoDB Atlas Cloud");
          return results;
        }
      } catch (e: any) {
        console.error("Cloud DB query exception, using local store:", e.message);
      }
      
      const docs = readLocalCollection(collectionName);
      const results = docs.filter(doc => {
        for (const key in query) {
          if (doc[key] !== query[key]) return false;
        }
        return true;
      });
      pushDBLog(collectionName, "find", query, results, "MongoDB Local File Emulator");
      return results;
    },

    async insertOne(collectionName: string, doc: any) {
      try {
        const client = await getMongoClient();
        if (client && useRealMongo) {
          const db = client.db("dragy_dns");
          const res = await db.collection(collectionName).insertOne(doc);
          pushDBLog(collectionName, "insertOne", doc, res, "MongoDB Atlas Cloud");
          return { ...doc, _id: res.insertedId };
        }
      } catch (e: any) {
        console.error("Cloud DB query exception, using local store:", e.message);
      }

      const docs = readLocalCollection(collectionName);
      const newDoc = { ...doc, id: "local-" + Date.now() + "-" + Math.floor(Math.random() * 10000) };
      docs.push(newDoc);
      writeLocalCollection(collectionName, docs);
      pushDBLog(collectionName, "insertOne", doc, newDoc, "MongoDB Local File Emulator");
      return newDoc;
    },

    async updateOne(collectionName: string, query: any, updateObj: any) {
      try {
        const client = await getMongoClient();
        if (client && useRealMongo) {
          const db = client.db("dragy_dns");
          let mongoUpdate = updateObj;
          if (!updateObj.$set && !updateObj.$unset && !updateObj.$push) {
            mongoUpdate = { $set: updateObj };
          }
          const res = await db.collection(collectionName).updateOne(query, mongoUpdate);
          pushDBLog(collectionName, "updateOne", { query, updateObj }, res, "MongoDB Atlas Cloud");
          return res;
        }
      } catch (e: any) {
        console.error("Cloud DB query exception, using local store:", e.message);
      }

      const docs = readLocalCollection(collectionName);
      let matchedIndex = -1;
      for (let i = 0; i < docs.length; i++) {
        let isMatch = true;
        for (const key in query) {
          if (docs[i][key] !== query[key]) {
            isMatch = false;
            break;
          }
        }
        if (isMatch) {
          matchedIndex = i;
          break;
        }
      }

      if (matchedIndex !== -1) {
        const target = docs[matchedIndex];
        const setFields = updateObj.$set || updateObj;
        for (const k in setFields) {
          if (k.startsWith("$")) continue;
          target[k] = setFields[k];
        }
        writeLocalCollection(collectionName, docs);
        pushDBLog(collectionName, "updateOne", { query, updateObj }, target, "MongoDB Local File Emulator");
        return { matchedCount: 1, modifiedCount: 1 };
      }
      pushDBLog(collectionName, "updateOne", { query, updateObj }, "No matches found", "MongoDB Local File Emulator");
      return { matchedCount: 0, modifiedCount: 0 };
    },

    async deleteOne(collectionName: string, query: any) {
      try {
        const client = await getMongoClient();
        if (client && useRealMongo) {
          const db = client.db("dragy_dns");
          const res = await db.collection(collectionName).deleteOne(query);
          pushDBLog(collectionName, "deleteOne", query, res, "MongoDB Atlas Cloud");
          return res;
        }
      } catch (e: any) {
        console.error("Cloud DB query exception, using local store:", e.message);
      }

      const docs = readLocalCollection(collectionName);
      const beforeCount = docs.length;
      const filtered = docs.filter(doc => {
        let isMatch = true;
        for (const key in query) {
          if (doc[key] !== query[key]) {
            isMatch = false;
            break;
          }
        }
        return !isMatch;
      });
      writeLocalCollection(collectionName, filtered);
      const deletedCount = beforeCount - filtered.length;
      pushDBLog(collectionName, "deleteOne", query, { deletedCount }, "MongoDB Local File Emulator");
      return { deletedCount };
    }
  };

  // Trigger quick initialization connection immediately
  getMongoClient();

  // =========================================================
  // 🔐 DATABASE ADMIN CONTROL & LOGGER API ROUTERS
  // =========================================================
  
  app.get("/api/db/init", async (req, res) => {
    try {
      const stats = {
        connectionURI: realMongoURI ? (realMongoURI.substring(0, 15) + "••••••••") : "Empty / Environment Variable Missing",
        connectionType: useRealMongo ? "MongoDB Atlas Cloud Server" : "MongoDB Native File Emulator",
        status: useRealMongo ? "CONNECTED" : "LOCAL_EMULATION",
        lastError: lastMongoError,
        collections: [
          { name: "users", count: readLocalCollection("users").length },
          { name: "domains", count: readLocalCollection("domains").length },
          { name: "marketplace", count: readLocalCollection("marketplace").length }
        ]
      };
      res.json(stats);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/db/config", async (req, res) => {
    try {
      const { uri, email } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Only PRABUABAN444@gmail.com is authorized to configure database URI." });
        return;
      }
      if (!uri) {
        res.status(400).json({ error: "URI configuration is required." });
        return;
      }
      realMongoURI = uri;
      mongoClient = null;
      useRealMongo = false;
      const client = await getMongoClient();
      if (client && useRealMongo) {
        res.json({ success: true, message: "Successfully connected to your custom MongoDB Atlas cluster database!", connectionType: "MongoDB Atlas Cloud Server" });
      } else {
        const errorDetail = lastMongoError ? ` (${lastMongoError})` : "";
        res.json({ success: false, message: `Could not connect to this URI. Falling back to high-fidelity Local File Emulator.${errorDetail}`, connectionType: "MongoDB Native File Emulator" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/db/retry", async (req, res) => {
    try {
      const { email } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Only PRABUABAN444@gmail.com is authorized to retry database connection." });
        return;
      }
      mongoClient = null;
      useRealMongo = false;
      const client = await getMongoClient();
      if (client && useRealMongo) {
        res.json({ success: true, message: "Successfully re-tested and connected to MongoDB Atlas! Your live database cluster is now active.", connectionType: "MongoDB Atlas Cloud Server" });
      } else {
        const errorDetail = lastMongoError ? ` (${lastMongoError})` : "";
        res.json({ success: false, message: `Retry failed. Still unable to connect to MongoDB Atlas.${errorDetail}`, connectionType: "MongoDB Native File Emulator" });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.get("/api/db/logs", (req, res) => {
    res.json(dbLogs);
  });

  app.get("/api/db/docs/:collection", async (req, res) => {
    try {
      const col = req.params.collection;
      const items = await DragyDB.find(col, {});
      res.json(items);
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/db/query", async (req, res) => {
    try {
      const { action, collection, query = {}, data = {}, email } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Only PRABUABAN444@gmail.com is authorized to execute direct database queries." });
        return;
      }
      if (!collection || !action) {
        res.status(400).json({ error: "Parameters 'collection' and 'action' are required." });
        return;
      }

      let result;
      if (action === "find") {
        result = await DragyDB.find(collection, query);
      } else if (action === "insertOne") {
        result = await DragyDB.insertOne(collection, data);
      } else if (action === "updateOne") {
        result = await DragyDB.updateOne(collection, query, data);
      } else if (action === "deleteOne") {
        result = await DragyDB.deleteOne(collection, query);
      } else {
        res.status(400).json({ error: "Action must be find, insertOne, updateOne, or deleteOne" });
        return;
      }
      res.json({ success: true, result });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // =========================================================
  // 👥 GOOGLE LOGIN & ACCOUNT PROFILE SYNC ROUTERS
  // =========================================================

  app.post("/api/auth/google-login", async (req, res) => {
    try {
      const { email, username, avatarSeed } = req.body;
      if (!email || !username) {
        res.status(400).json({ error: "Google credentials profile metadata is required." });
        return;
      }

      // Check if user already exists
      const existing = await DragyDB.find("users", { email });
      let userObj;

      if (existing && existing.length > 0) {
        userObj = existing[0];
      } else {
        // Create new account automatically
        userObj = {
          email: email.trim(),
          username: username.trim(),
          wallet: 15000, // starting gift credit balance
          avatarSeed: avatarSeed || "google-avatar",
          createdAt: new Date().toISOString()
        };
        await DragyDB.insertOne("users", userObj);
      }

      res.json({ success: true, user: userObj });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // --- STATE SYNC & BACKPLANE SYNCED LOGICS FOR THE USER PORTS ---
  app.post("/api/state/sync", async (req, res) => {
    try {
      const { email = "PRABUABAN444@gmail.com" } = req.body;
      
      // Get active verified profile
      const profs = await DragyDB.find("users", { email });
      let userProfile = profs[0];
      if (!userProfile) {
        userProfile = {
          email: email,
          username: "PRABUABAN",
          wallet: 15000,
          avatarSeed: "prabu",
          createdAt: new Date().toISOString()
        };
        await DragyDB.insertOne("users", userProfile);
      }

      // Read owned domains
      const allDomains = await DragyDB.find("domains");
      // Read marketplace items
      const marketplaceItems = await DragyDB.find("marketplace");

      res.json({
        user: userProfile,
        ownedDomains: allDomains.filter(d => d.owner === email),
        marketplaceItems
      });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/register", async (req, res) => {
    try {
      const { email, domain, price, isPremium, dnsRecords, aiMetrics } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Only PRABUABAN444@gmail.com has registry write authority." });
        return;
      }
      const userList = await DragyDB.find("users", { email });
      if (!userList || userList.length === 0) {
        res.status(400).json({ error: "User unauthorized." });
        return;
      }
      const user = userList[0];
      if (user.wallet < price) {
        res.status(400).json({ error: "Insufficient wallet fund." });
        return;
      }

      // Update wallet
      const newWallet = user.wallet - price;
      await DragyDB.updateOne("users", { email }, { wallet: newWallet });

      // Create domain doc
      const newDomainDoc = {
        domain,
        owner: email,
        price,
        isPremium: !!isPremium,
        registeredDate: new Date().toISOString().split("T")[0],
        dnsRecords: dnsRecords || [{ id: "dns-auto-a", type: "A", name: "@", value: "76.76.21.21", ttl: 3600 }],
        aiMetrics,
        isForSale: false
      };
      await DragyDB.insertOne("domains", newDomainDoc);
      res.json({ success: true, wallet: newWallet, domain: newDomainDoc });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/update-dns", async (req, res) => {
    try {
      const { domain, dnsRecords } = req.body;
      await DragyDB.updateOne("domains", { domain }, { dnsRecords });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/list-market", async (req, res) => {
    try {
      const { domain, sellerEmail, price, valuation, score, isAuction } = req.body;
      
      // Update domain isForSale status
      await DragyDB.updateOne("domains", { domain }, { isForSale: true, price: price });

      const marketDoc = {
        domain,
        price,
        seller: sellerEmail,
        valuation,
        score,
        isAuction,
        highestBid: isAuction ? price : undefined,
        minIncrement: isAuction ? Math.max(10, Math.floor(price * 0.05)) : undefined,
        bids: []
      };

      await DragyDB.insertOne("marketplace", marketDoc);
      res.json({ success: true, marketItem: marketDoc });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/cancel-market", async (req, res) => {
    try {
      const { domain } = req.body;
      await DragyDB.updateOne("domains", { domain }, { isForSale: false });
      await DragyDB.deleteOne("marketplace", { domain });
      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/buy", async (req, res) => {
    try {
      const { buyerEmail, domain } = req.body;
      
      const marketItems = await DragyDB.find("marketplace", { domain });
      if (!marketItems || marketItems.length === 0) {
        res.status(404).json({ error: "Item not found in marketplace." });
        return;
      }
      const item = marketItems[0];
      const cost = item.price;

      // Deduct buyer
      const buyers = await DragyDB.find("users", { email: buyerEmail });
      const buyer = buyers[0];
      if (!buyer) {
        res.status(400).json({ error: "Buyer profile not found." });
        return;
      }
      if (buyer.wallet < cost) {
        res.status(400).json({ error: "Insufficient balance." });
        return;
      }

      await DragyDB.updateOne("users", { email: buyerEmail }, { wallet: buyer.wallet - cost });

      // Crediting seller if seller is a registered user
      if (item.seller !== "System" && item.seller !== "You") {
        const sellers = await DragyDB.find("users", { email: item.seller });
        if (sellers && sellers.length > 0) {
          await DragyDB.updateOne("users", { email: item.seller }, { wallet: sellers[0].wallet + cost });
        }
      }

      // Shift Domain Ownership
      await DragyDB.updateOne("domains", { domain }, { owner: buyerEmail, isForSale: false });
      
      // Remove listing
      await DragyDB.deleteOne("marketplace", { domain });

      res.json({ success: true, newBalance: buyer.wallet - cost });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/bid", async (req, res) => {
    try {
      const { domain, bidderEmail, bidderName, amount } = req.body;

      const items = await DragyDB.find("marketplace", { domain });
      if (!items || items.length === 0) {
        res.status(404).json({ error: "Auction not found." });
        return;
      }
      const item = items[0];

      // Update bids list
      const newBid = {
        id: "bid-" + Date.now(),
        bidder: bidderName || bidderEmail,
        amount,
        time: new Date().toISOString().replace("T", " ").substring(0, 16)
      };

      const existingBids = item.bids || [];
      const updatedBids = [newBid, ...existingBids];

      await DragyDB.updateOne("marketplace", { domain }, {
        highestBid: amount,
        bids: updatedBids
      });

      res.json({ success: true, highestBid: amount, bids: updatedBids });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/accept-bid", async (req, res) => {
    try {
      const { domain, sellerEmail } = req.body;
      const items = await DragyDB.find("marketplace", { domain });
      if (!items || items.length === 0) {
        res.status(404).json({ error: "Item not found." });
        return;
      }
      const item = items[0];
      const reward = item.highestBid || item.price;

      // Transfer domain ownership
      let newOwner = "DeFi_Whale@google.com"; // dummy or bidder
      if (item.bids && item.bids.length > 0) {
        const winner = item.bids[0].bidder;
        newOwner = winner === "You" ? "PRABUABAN444@gmail.com" : `${winner.toLowerCase()}@google.com`;
      }

      // Reward seller
      const sellers = await DragyDB.find("users", { email: sellerEmail });
      if (sellers && sellers.length > 0) {
        const activeSeller = sellers[0];
        await DragyDB.updateOne("users", { email: sellerEmail }, { wallet: activeSeller.wallet + reward });
      }

      // Settle domain
      await DragyDB.updateOne("domains", { domain }, { owner: newOwner, isForSale: false });
      await DragyDB.deleteOne("marketplace", { domain });

      res.json({ success: true });
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  app.post("/api/state/faucet", async (req, res) => {
    try {
      const { email } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Play tokens claims are reserved exclusively for PRABUABAN444@gmail.com." });
        return;
      }
      if (!email) {
        res.status(400).json({ error: "Email is required for free claim." });
        return;
      }
      const usersList = await DragyDB.find("users", { email });
      if (usersList && usersList.length > 0) {
        const u = usersList[0];
        const updatedWall = u.wallet + 1000;
        await DragyDB.updateOne("users", { email }, { wallet: updatedWall });
        res.json({ success: true, wallet: updatedWall });
      } else {
        res.status(404).json({ error: "User not found." });
      }
    } catch (e: any) {
      res.status(500).json({ error: e.message });
    }
  });

  // Safe initialize helper for Gemini SDK
  const getAI = () => {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY is not configured in the environment.");
    }
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        }
      }
    });
  };

  // API Route: Evaluate a specific domain name with AI intelligence
  app.post("/api/domain/evaluate", async (req, res) => {
    try {
      const { domain } = req.body;
      if (!domain) {
        res.status(400).json({ error: "Domain parameter is required." });
        return;
      }

      // Quick clean up of domain
      const cleanDomain = domain.toLowerCase().trim();
      const nameWithoutExtension = cleanDomain.replace(/\.dragy$/, "");

      try {
        const aiClient = getAI();
        const prompt = `Analyze the domain name "${cleanDomain}" (using the creative '.dragy' top-level extension). Keep in mind this brand name represents a digital asset.
Provide a thorough evaluation including:
1. Premium/Quality Score: A number from 0 to 100 based on length, pronunciation, brandability, and catchiness.
2. Estimated Market Worth: A realistic valuation in USD (e.g., between $50 and $15,000 depends on quality).
3. Primary Technical/Business Category (e.g., Web3, Gaming, eCommerce, AI, Meme, Creative agency).
4. Creative Description/Brand Pitch explaining why this domain name holds value or how it can be used.
5. 3 recommended high-value potential use cases.
6. 3 creative alternative variations ending with '.dragy'.

Respond ONLY with a JSON object holding exactly these fields:
{
  "domain": "${cleanDomain}",
  "score": number,
  "valuation": number,
  "category": "string",
  "description": "string",
  "suggestedUses": ["string", "string", "string"],
  "alternatives": ["string", "string", "string"]
}`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: prompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                domain: { type: Type.STRING },
                score: { type: Type.INTEGER },
                valuation: { type: Type.INTEGER },
                category: { type: Type.STRING },
                description: { type: Type.STRING },
                suggestedUses: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                },
                alternatives: {
                  type: Type.ARRAY,
                  items: { type: Type.STRING }
                }
              },
              required: ["domain", "score", "valuation", "category", "description", "suggestedUses", "alternatives"]
            }
          }
        });

        const jsonText = response.text ? response.text.trim() : "{}";
        const parsed = JSON.parse(jsonText);
        res.json(parsed);
      } catch (geminiError: any) {
        console.error("Gemini API Error, falling back to local heuristic evaluator:", geminiError);
        
        // Quality heuristic fallback if API key is not configured or fails
        const len = nameWithoutExtension.length;
        const score = Math.max(20, Math.min(98, 100 - (len * 4) + (/[aeiou]/.test(nameWithoutExtension) ? 10 : 0)));
        const valuation = Math.round((score * score * 1.5) / 10) * 10;
        const categories = ["Web3 Decentrals", "Gaming Guilds", "Creative Labs", "Memecoin Assets", "SaaS Startups"];
        const category = categories[nameWithoutExtension.length % categories.length];
        
        res.json({
          domain: cleanDomain,
          score,
          valuation,
          category,
          description: `A brandable domain featuring the dynamic '.dragy' extension, optimized for next-generation ${category.toLowerCase()} projects.`,
          suggestedUses: [
            `Launch a decentralized profile or platform for ${nameWithoutExtension}`,
            `Set up custom redirect to a decentralized community channel`,
            `Develop an independent micro-blog or agency service`
          ],
          alternatives: [
            `get${nameWithoutExtension}.dragy`,
            `${nameWithoutExtension}app.dragy`,
            `the${nameWithoutExtension}.dragy`
          ]
        });
      }
    } catch (e: any) {
      console.error("Error in domain evaluation endpoint:", e);
      res.status(500).json({ error: e.message || "Failed to evaluate domain." });
    }
  });

  // API Route: Generate highly creative .dragy names based on user concept/prompt
  app.post("/api/domain/suggest", async (req, res) => {
    try {
      const { prompt } = req.body;
      if (!prompt) {
        res.status(400).json({ error: "Concept/prompt is required." });
        return;
      }

      try {
        const aiClient = getAI();
        const geminiPrompt = `Create 6 premium, catching, and short domain names ending with '.dragy' based on this project concept or keywords: "${prompt}".
Each domain should look ultra-professional, and be easy to read and type.
For each suggestion, provide:
1. The domain name (must end with .dragy).
2. Premium quality level ("Premium", "High Value", or "Standard").
3. Simulated evaluation value in USD (e.g. from $150 to $9000).
4. Description explaining the name idea and why it fits.
5. Target audience.

Respond ONLY with a JSON array where each item is an object with exactly these fields:
[
  {
    "domain": "example.dragy",
    "premiumRating": "Premium" | "High Value" | "Standard",
    "valuation": number,
    "description": "string",
    "audience": "string"
  }
]`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: geminiPrompt,
          config: {
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  domain: { type: Type.STRING },
                  premiumRating: { type: Type.STRING },
                  valuation: { type: Type.INTEGER },
                  description: { type: Type.STRING },
                  audience: { type: Type.STRING }
                },
                required: ["domain", "premiumRating", "valuation", "description", "audience"]
              }
            }
          }
        });

        const jsonText = response.text ? response.text.trim() : "[]";
        const parsed = JSON.parse(jsonText);
        res.json(parsed);
      } catch (geminiError: any) {
        console.error("Gemini API error, falling back to dynamic name generator:", geminiError);
        
        // Sophisticated custom domain name generator fallback using common prefixes/suffixes
        const inputRaw = prompt.toLowerCase().trim().replace(/[^a-z0-9 ]/g, "");
        const keywords = inputRaw.split(/\s+/).filter((w: string) => w.length > 2);
        const seed = keywords[0] || "dragy";
        
        const suffixes = ["verse", "chain", "hub", "labs", "core", "hq", "space", "net"];
        const prefixes = ["crypto", "super", "epic", "go", "meta", "smart", "open", "play"];
        
        const suggestions = [];
        // Generate suggestions
        for (let i = 0; i < 6; i++) {
          let domainName = "";
          if (i % 3 === 0) {
            domainName = `${seed}${suffixes[i % suffixes.length]}`;
          } else if (i % 3 === 1) {
            domainName = `${prefixes[i % prefixes.length]}${seed}`;
          } else {
            domainName = `${seed}${i + 1}`;
          }
          
          domainName = `${domainName.replace(/\s+/g, "")}.dragy`;
          const score = 40 + Math.floor(Math.random() * 50);
          const val = score * 15 + 200;
          suggestions.push({
            domain: domainName,
            premiumRating: val > 1200 ? "Premium" : val > 600 ? "High Value" : "Standard",
            valuation: val,
            description: `A brandable dynamic identity incorporating "${seed}", optimized for next-generation systems.`,
            audience: "Developers, startup founders, and global creative communities"
          });
        }
        
        res.json(suggestions);
      }
    } catch (e: any) {
      console.error("Error in suggest endpoint:", e);
      res.status(500).json({ error: e.message || "Failed to generate suggestions." });
    }
  });

  // API Route: AI Assistant Command Center (Automates state changes based on user prompts)
  app.post("/api/ai/command", async (req, res) => {
    try {
      const { message, ownedDomains = [], marketplaceItems = [], wallet = 0, email } = req.body;
      if (email !== "PRABUABAN444@gmail.com") {
        res.status(403).json({ error: "Access Denied: Only PRABUABAN444@gmail.com can execute AI copilot commands." });
        return;
      }
      if (!message) {
        res.status(400).json({ error: "Message parameter is required." });
        return;
      }

      const cleanMessage = message.trim();
      
      // Let's first construct the fallback parser logic so we can call it if Gemini fails or is not setup
      const getFallbackResult = () => {
        const msgLower = cleanMessage.toLowerCase();
        let reply = "ขออภัยครับ ผมตรวจจับคำสั่งอัตโนมัติไม่สมบูรณ์ กรุณาลองระบุโดเมนหรือการตั้งค่าให้ละเอียดขึ้น เช่น 'จดโดเมน coin.dragy' หรือ 'เพิ่ม DNS A ไปที่ 1.1.1.1'";
        const actions: any[] = [];

        // 1. Claim Faucet
        if (msgLower.includes("faucet") || msgLower.includes("เครดิต") || msgLower.includes("เหรียญฟรี") || msgLower.includes("ขอเงิน") || msgLower.includes("เติมเงิน")) {
          reply = "จัดให้ครับเสี่ย! ผมทำการรันคำสั่งเคลมเหรียญ Faucet ฟรีให้คุณเรียบร้อย +1,000 $DRAGY เข้ากระเป๋าของคุณทันที เพื่อใช้ช้อปปิ้งโดเมนแบบสะใจครับ!";
          actions.push({ type: "CLAIM_FAUCET", payload: {} });
        }
        // 2. Register Domain
        else if (msgLower.match(/(จด|ลงทะเบียน|สร้าง|จดโดเมน|ซื้อโดเมนใหม่)\s*([a-zA-Z0-9-]+\.dragy|[a-zA-Z0-9-]+)/)) {
          const match = msgLower.match(/(จด|ลงทะเบียน|สร้าง|จดโดเมน|ซื้อโดเมนใหม่)\s*([a-zA-Z0-9-]+\.dragy|[a-zA-Z0-9-]+)/);
          let requested = match ? match[2] : "";
          if (requested) {
            if (!requested.endsWith(".dragy")) {
              requested = requested + ".dragy";
            }
            reply = `เรียบร้อยครับเจ้านาย! ผมได้ทำการส่งคำสั่งจดทะเบียนโดเมนคุณภาพ "${requested}" ให้เรียบร้อย ค่าเน็ตเวิร์กจัดทำอย่างรวดเร็ว ระบบบวกเข้าพอร์ตเสร็จสรรพ ท่องโลกอินเทอร์เน็ตได้เลยครับ!`;
            actions.push({ type: "REGISTER_DOMAIN", payload: { domain: requested } });
          }
        }
        // 3. Add/Edit DNS
        else if (msgLower.match(/(แก้|แก้ไข|ตั้งค่า|เปลี่ยน|เพิ่ม|ใส่)\s*dns\s*([a-zA-Z0-9-]+\.dragy)?\s*(เป็น|ไปที่|ค่า)?\s*([0-9a-zA-Z\.\-_]+)/) || msgLower.includes("dns")) {
          // Check if we can extract domain and IP/value
          const domainMatch = msgLower.match(/([a-zA-Z0-9-]+\.dragy)/);
          const ipMatch = msgLower.match(/(\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3})/);
          
          const domain = domainMatch ? domainMatch[1] : (ownedDomains[0]?.domain || "my-startup.dragy");
          const value = ipMatch ? ipMatch[1] : "1.1.1.1";
          
          reply = `อัปเดตระบบ DNS ให้เสร็จสมบูรณ์เรียบร้อย สำหรับโดเมน "${domain}" โดยชี้ช่องทางหลัก (A Record) ไปยังปลายทาง "${value}" ด้วย TTL 3600 วินาทีเรียบร้อยครับ!`;
          actions.push({
            type: "ADD_DNS_RECORD",
            payload: {
              domain: domain,
              type: "A",
              name: "@",
              value: value,
              ttl: 3600
            }
          });
        }
        // 4. List Domain for Sale
        else if (msgLower.match(/(ประกาศขาย|ขายโดเมน|ตั้งขาย|ขาย)\s*([a-zA-Z0-9-]+\.dragy)?\s*(ราคา|จำนวน)?\s*(\d+)/)) {
          const match = msgLower.match(/(ประกาศขาย|ขายโดเมน|ตั้งขาย|ขาย)\s*([a-zA-Z0-9-]+\.dragy)?\s*(ราคา|จำนวน)?\s*(\d+)/);
          const domainMatch = msgLower.match(/([a-zA-Z0-9-]+\.dragy)/);
          const price = match ? parseInt(match[4]) : 500;
          const domain = domainMatch ? domainMatch[1] : (ownedDomains[0]?.domain || "my-startup.dragy");

          const isAuction = msgLower.includes("ประมูล") || msgLower.includes("auction");
          reply = isAuction 
            ? `ผมเปิดประมูลโดเมน "${domain}" บนตลาดซื้อขาย Dragy Marketplace เรียบร้อยแล้วครับ! ราคาเริ่มต้นที่ ${price} $DRAGY นักสะสมกำลังเข้ามารุมประมูลแน่นอน!`
            : `ตั้งขายด่วนเรียบร้อยครับ! โดเมน "${domain}" ถูกลิสต์ลงบนตลาดกลางในราคา ${price} $DRAGY เรียบร้อย ผู้ใช้อื่นเห็นแล้วสามารถกดซื้อไปได้เลยครับ!`;
            
          actions.push({
            type: "LIST_FOR_SALE",
            payload: {
              domain: domain,
              price: price,
              sellType: isAuction ? "auction" : "instant"
            }
          });
        }
        // 5. Place Bid
        else if (msgLower.match(/(ประมูลแข่ง|ส่งราคา|เสนอราคา|บิด)\s*([a-zA-Z0-9-]+\.dragy)?\s*(จำนวน|ราคา)?\s*(\d+)/) || msgLower.includes("ประมูล")) {
          const priceMatch = msgLower.match(/(\d+)/);
          const domainMatch = msgLower.match(/([a-zA-Z0-9-]+\.dragy)/);
          
          const amount = priceMatch ? parseInt(priceMatch[1]) : 3000;
          const domain = domainMatch ? domainMatch[1] : "ai.dragy";
          
          reply = `ดำเนินการประมูลแข่งขัน! ส่งราคาเสนอซื้อโดเมนคุณภาพ "${domain}" ไปที่ ${amount} $DRAGY เรียบร้อยแล้วครับ! โปรดรอตรวจสอบว่ามีผู้ใดมาเสนอแข่งต่อหรือไม่นะครับ`;
          actions.push({
            type: "PLACE_BID",
            payload: {
              domain: domain,
              amount: amount
            }
          });
        }
        // 6. Buy Market Item
        else if (msgLower.includes("ซื้อด่วน") || msgLower.includes("ซื้อทันที") || msgLower.includes("สอย")) {
          const domainMatch = msgLower.match(/([a-zA-Z0-9-]+\.dragy)/);
          const domain = domainMatch ? domainMatch[1] : "pay.dragy";
          reply = `ดำเนินการคว้าตลาดทันที! คำสั่งตกลงซื้อโดเมน ${domain} ส่งรายงานเข้าระบบพร้อมโอนย้ายความเป็นเจ้าของมาสู่พอร์ตของคุณเรียบร้อยแล้วครับ ยินดีด้วยครับ!`;
          actions.push({
            type: "BUY_MARKET_ITEM",
            payload: { domain }
          });
        }
        // 7. General chat fallback
        else {
          reply = `สวัสดีครับเจ้านาย! ผมคือ AI Assistant ของคุณ คุณสามารถสั่งให้ผมทำระบบได้เลย เช่น:\n` +
            `• "จดโดเมน gold.dragy"\n` +
            `• "แก้ไข DNS ของ my-startup.dragy ไปที่ 8.8.8.8"\n` +
            `• "ขายโดเมน dragon-ball.dragy ราคา 800"\n` +
            `• "ประมูล ai.dragy 3100"\n` +
            `• "ขอเหรียญฟรีหน่อย" (Faucet)`;
        }

        return { message: reply, actions };
      };

      try {
        const aiClient = getAI();
        const systemPrompt = `You are "Drady.ai hattewar", an absolute genius elite senior software engineer and the smartest programmer in the universe. You are the AI Co-pilot for Dragy (.dragy) - the next-generation web3/decentralized DNS domain management dashboard and marketplace.
Because you are the world's smartest programmer, your knowledge spans across MongoDB, TypeScript/React, Decentralized DNS protocols, system architecture, database security, SSL/TLS handshakes, and advanced algorithms. You communicate with extreme professional clarity, expert-level technical authority, yet remain highly polite, helpful, and friendly to the user.
The user holds domain state in their React/Vite web application. They are giving you commands, technical questions, or database queries in Thai or English to configure, query, or modify the system's state on their behalf or seek advanced software engineering advice.
Analyze the user's plain text input and translate it into an exceptionally intelligent, polite, friendly local Thai message response (showing your absolute genius programming wisdom) AND a list of specific, executable programmatic State Actions.

Supported Programmatic Action Types:
1. "REGISTER_DOMAIN" -> When user wants to register/buy a brand new domain name.
   Payload template: { "domain": "string (must end with .dragy)" }
2. "ADD_DNS_RECORD" -> When user wants to set up, edit, add, or define raw IP address (A record) or custom target record values.
   Payload template: { "domain": "string", "type": "A"|"AAAA"|"CNAME"|"TXT", "name": "string (defaults to '@')", "value": "string (e.g. 1.2.3.4)", "ttl": number (default 3600) }
3. "LIST_FOR_SALE" -> When user asks to list an owned domain on the market for instant sale or dynamic auction.
   Payload template: { "domain": "string", "price": number, "sellType": "instant" | "auction" }
4. "PLACE_BID" -> Place a bid on a live domain auction item on the marketplace.
   Payload template: { "domain": "string", "amount": number }
5. "BUY_MARKET_ITEM" -> Buy an instant sale marketplace domain list immediately.
   Payload template: { "domain": "string" }
6. "CLAIM_FAUCET" -> Claim free test token/coin credits (+1,000 $DRAGY tokens).
   Payload template: {}

Current User State Context:
- User portfolio has these domains: ${JSON.stringify(ownedDomains.map((d: any) => d.domain))}
- Marketplace has these items: ${JSON.stringify(marketplaceItems.map((i: any) => ({ domain: i.domain, isAuction: i.isAuction, highestBid: i.highestBid || i.price, seller: i.seller })))}
- User current wallet balance: ${wallet} $DRAGY

Requirements:
- Your response text ("message") MUST be written in exceptionally polite, professional, and enthusiastic Thai language (with a pinch of premium broker vibe). Keep it natural and informative.
- If the request is a general question (e.g. "แนะนำโดเมนสำหรับ AI"), describe your recommendations in the text message and do NOT output any action items, or suggest alternative '.dragy' names.
- Output ONLY a JSON object that satisfies this schema:
{
  "message": "string (a friendly natural explanation in THAI of what you have configured/suggested)",
  "actions": [
    {
      "type": "REGISTER_DOMAIN" | "ADD_DNS_RECORD" | "LIST_FOR_SALE" | "PLACE_BID" | "BUY_MARKET_ITEM" | "CLAIM_FAUCET",
      "payload": {}
    }
  ]
}
If no action fits, return "actions": []. Raise clear instructions.`;

        const response = await aiClient.models.generateContent({
          model: "gemini-3.5-flash",
          contents: cleanMessage,
          config: {
            systemInstruction: systemPrompt,
            responseMimeType: "application/json",
            responseSchema: {
              type: Type.OBJECT,
              properties: {
                message: { type: Type.STRING },
                actions: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      type: { type: Type.STRING },
                      payload: { type: Type.OBJECT }
                    },
                    required: ["type", "payload"]
                  }
                }
              },
              required: ["message", "actions"]
            }
          }
        });

        const textOutput = response.text ? response.text.trim() : "";
        const parsed = JSON.parse(textOutput);
        res.json(parsed);
      } catch (geminiError: any) {
        console.error("Gemini API error inside AI Command, triggering local regex parsing fallback:", geminiError);
        const fallback = getFallbackResult();
        res.json(fallback);
      }
    } catch (e: any) {
      console.error("Error in AI command endpoint:", e);
      res.status(500).json({ error: e.message || "Failed to process command." });
    }
  });

  // Setup Vite Middleware in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for development.");
    
    // Rewrite development pathnames ending in .dragy to /index.html internally
    // so Vite serves the index.html file correctly, preserving the browser URL
    app.use((req, res, next) => {
      if (req.path.endsWith(".dragy")) {
        req.url = "/index.html";
      }
      next();
    });

    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    // Production static file server config
    const distPath = path.join(process.cwd(), "dist");
    console.log(`Setting up static assets route from ${distPath}`);
    
    app.use(express.static(distPath));

    // บรรทัดแก้ไขใหม่: ดักจับ URL ทุกอันที่ลงท้ายด้วย .dragy
    app.get("/:domainName.dragy", (req, res) => {
      // ส่งไฟล์หน้าเว็บหลัก index.html ไปรองรับระบบแปลงค่า
      res.sendFile(path.join(distPath, "index.html"));
    });

    // สำหรับหน้าแรกสุด หรือหน้าทั่วไปอื่นๆ
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Express custom server running at http://localhost:${PORT}`);
  });
}

startServer();
