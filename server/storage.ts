import { type User, type InsertUser, type FoodAnalysis, type InsertFoodAnalysis } from "@shared/schema";
import { randomUUID } from "crypto";

// modify the interface with any CRUD methods
// you might need

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getFoodAnalyses(userId?: string): Promise<FoodAnalysis[]>;
  createFoodAnalysis(analysis: InsertFoodAnalysis): Promise<FoodAnalysis>;
  getFoodAnalysis(id: string): Promise<FoodAnalysis | undefined>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private foodAnalyses: Map<string, FoodAnalysis>;

  constructor() {
    this.users = new Map();
    this.foodAnalyses = new Map();
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getFoodAnalyses(userId?: string): Promise<FoodAnalysis[]> {
    const analyses = Array.from(this.foodAnalyses.values());
    if (userId) {
      return analyses.filter(analysis => analysis.userId === userId);
    }
    return analyses;
  }

  async createFoodAnalysis(insertAnalysis: InsertFoodAnalysis): Promise<FoodAnalysis> {
    const id = randomUUID();
    const analysis: FoodAnalysis = {
      ...insertAnalysis,
      id,
      createdAt: new Date(),
    };
    this.foodAnalyses.set(id, analysis);
    return analysis;
  }

  async getFoodAnalysis(id: string): Promise<FoodAnalysis | undefined> {
    return this.foodAnalyses.get(id);
  }
}

export const storage = new MemStorage();
