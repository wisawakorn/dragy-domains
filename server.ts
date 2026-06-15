import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

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

  // Setup Vite Middleware in development
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite middleware for development.");
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
startServer();
