import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import multer from "multer";
import OpenAI from "openai";
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

// the newest OpenAI model is "gpt-5" which was released August 7, 2025. do not change this unless explicitly requested by the user
const openai = new OpenAI({ 
  apiKey: process.env.OPENAI_API_KEY || process.env.VITE_OPENAI_API_KEY || "default_key" 
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
      
      // Convert image to base64
      const imageBuffer = fs.readFileSync(imagePath);
      const base64Image = imageBuffer.toString('base64');

      // Analyze image with OpenAI Vision
      const visionResponse = await openai.chat.completions.create({
        model: "gpt-5",
        messages: [
          {
            role: "system",
            content: "You are a nutrition expert AI that analyzes food images. Analyze the food in the image and provide detailed nutritional information. Respond with JSON in this exact format: { 'detectedFood': string, 'confidence': number (0-1), 'totalCalories': number, 'protein': number, 'carbs': number, 'fats': number, 'fiber': number, 'sugar': number, 'sodium': number, 'cholesterol': number, 'ingredients': string[], 'portionSize': string }"
          },
          {
            role: "user",
            content: [
              {
                type: "text",
                text: "Analyze this food image and provide detailed nutritional information. Be as accurate as possible with portion size estimation and nutritional values."
              },
              {
                type: "image_url",
                image_url: {
                  url: `data:image/jpeg;base64,${base64Image}`
                }
              }
            ],
          },
        ],
        response_format: { type: "json_object" },
        max_completion_tokens: 2048,
      });

      const analysisResult = JSON.parse(visionResponse.choices[0].message.content || "{}");

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
