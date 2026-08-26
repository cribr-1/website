/**
 * Centralized Server Environment & Configuration
 * Supports Node.js environment variables across Vite local dev and Vercel serverless functions.
 */
import dotenv from "dotenv";

dotenv.config();

export const SERVER_CONFIG = {
  PORT: process.env.PORT || 3000,
  NODE_ENV: process.env.NODE_ENV || "development",
  
  SUPABASE: {
    URL: process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL || "https://nasccqkadwmfcajgecfs.supabase.co",
    ANON_KEY: process.env.VITE_SUPABASE_ANON_KEY || process.env.SUPABASE_ANON_KEY || "sb_publishable_z98MxzP9Yw3ePFmdVPrDpA_Y8boqwV0",
  },
  
  GROQ: {
    API_KEY: process.env.GROQ_API_KEY || "",
    PRIMARY_MODEL: "llama3-8b-8192",
    FALLBACK_MODELS: ["llama3-70b-8192", "mixtral-8x7b-32768"],
    INTENT_MODEL: "llama3-8b-8192",
  },

  GEMINI: {
    API_KEY: process.env.GEMINI_API_KEY || "",
  }
};

