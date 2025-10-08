import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import { GoogleGenAI } from "@google/genai";
import fs from "fs";
import path from "path";
import { insertFoodAnalysisSchema } from "@shared/schema";

// Configure multer for image uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  }
});

// Use Google Gemini (FREE API)
const ai = new GoogleGenAI({ 
  apiKey: process.env.GEMINI_API_KEY || "default_key" 
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Health check endpoint
  app.get("/api/health", (req, res) => {
    res.json({ status: "ok" });
  });

  // Upload and analyze food image
  app.post("/api/analyze-food", upload.single('image'), async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No image file provided" });
      }

      const imagePath = req.file.path;
      
      // Read image bytes
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Analyze image with Google Gemini (FREE)
      const systemPrompt = `You are a nutrition expert AI that analyzes food images. Analyze the food in the image and provide detailed nutritional information. Respond with JSON in this exact format: { "detectedFood": string, "confidence": number (0-1), "totalCalories": number, "protein": number, "carbs": number, "fats": number, "fiber": number, "sugar": number, "sodium": number, "cholesterol": number, "ingredients": string[], "portionSize": string }`;

      const visionResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        config: {
          systemInstruction: systemPrompt,
          responseMimeType: "application/json",
          responseSchema: {
            type: "object",
            properties: {
              detectedFood: { type: "string" },
              confidence: { type: "number" },
              totalCalories: { type: "number" },
              protein: { type: "number" },
              carbs: { type: "number" },
              fats: { type: "number" },
              fiber: { type: "number" },
              sugar: { type: "number" },
              sodium: { type: "number" },
              cholesterol: { type: "number" },
              ingredients: { type: "array", items: { type: "string" } },
              portionSize: { type: "string" }
            },
            required: ["detectedFood", "confidence", "totalCalories", "protein", "carbs", "fats", "portionSize"]
          }
        },
        contents: [
          {
            inlineData: {
              data: base64Image,
              mimeType: req.file.mimetype
            }
          },
          "Analyze this food image and provide detailed nutritional information. Be as accurate as possible with portion size estimation and nutritional values."
        ]
      });

      const analysisResult = JSON.parse(visionResponse.text || "{}");

      // Validate and save the analysis
      const analysisData = {
        userId: null, // No user system for now
        imagePath: imagePath,
        detectedFood: analysisResult.detectedFood || "Unknown food",
        confidence: analysisResult.confidence || 0,
        totalCalories: analysisResult.totalCalories || 0,
        protein: analysisResult.protein || 0,
        carbs: analysisResult.carbs || 0,
        fats: analysisResult.fats || 0,
        fiber: analysisResult.fiber || 0,
        sugar: analysisResult.sugar || 0,
        sodium: analysisResult.sodium || 0,
        cholesterol: analysisResult.cholesterol || 0,
        ingredients: analysisResult.ingredients || [],
        portionSize: analysisResult.portionSize || "1 serving"
      };

      const validatedData = insertFoodAnalysisSchema.parse(analysisData);
      const savedAnalysis = await storage.createFoodAnalysis(validatedData);

      // Clean up uploaded file
      fs.unlinkSync(imagePath);

      res.json(savedAnalysis);

    } catch (error) {
      console.error("Error analyzing food:", error);
      
      // Clean up uploaded file on error
      if (req.file && fs.existsSync(req.file.path)) {
        fs.unlinkSync(req.file.path);
      }

      if (error instanceof Error) {
        res.status(500).json({ message: `Failed to analyze food: ${error.message}` });
      } else {
        res.status(500).json({ message: "Failed to analyze food due to an unknown error" });
      }
    }
  });

  // Get food analysis history
  app.get("/api/food-analyses", async (req, res) => {
    try {
      const analyses = await storage.getFoodAnalyses();
      res.json(analyses);
    } catch (error) {
      console.error("Error fetching analyses:", error);
      res.status(500).json({ message: "Failed to fetch food analyses" });
    }
  });

  // Get specific food analysis
  app.get("/api/food-analyses/:id", async (req, res) => {
    try {
      const analysis = await storage.getFoodAnalysis(req.params.id);
      if (!analysis) {
        return res.status(404).json({ message: "Food analysis not found" });
      }
      res.json(analysis);
    } catch (error) {
      console.error("Error fetching analysis:", error);
      res.status(500).json({ message: "Failed to fetch food analysis" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
