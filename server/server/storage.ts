import {
  users,
  threats,
  evidence,
  incidents,
  simulations,
  analytics,
  type User,
  type UpsertUser,
  type Threat,
  type InsertThreat,
  type Evidence,
  type InsertEvidence,
  type Incident,
  type InsertIncident,
  type Simulation,
  type InsertSimulation,
  type Analytics,
  type InsertAnalytics,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and } from "drizzle-orm";
import { randomUUID } from "crypto";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Threat operations
  getThreats(limit?: number): Promise<Threat[]>;
  createThreat(threat: InsertThreat): Promise<Threat>;
  updateThreat(id: string, updates: Partial<InsertThreat>): Promise<Threat>;
  
  // Evidence operations
  getEvidence(limit?: number): Promise<Evidence[]>;
  createEvidence(evidence: InsertEvidence): Promise<Evidence>;
  verifyEvidence(id: string): Promise<Evidence>;
  
  // Incident operations
  getIncidents(limit?: number): Promise<Incident[]>;
  createIncident(incident: InsertIncident): Promise<Incident>;
  updateIncident(id: string, updates: Partial<InsertIncident>): Promise<Incident>;
  
  // Simulation operations
  getSimulations(limit?: number): Promise<Simulation[]>;
  createSimulation(simulation: InsertSimulation): Promise<Simulation>;
  updateSimulation(id: string, updates: Partial<InsertSimulation>): Promise<Simulation>;
  
  // Analytics operations
  getAnalytics(metricType?: string, limit?: number): Promise<Analytics[]>;
  createAnalytics(analytics: InsertAnalytics): Promise<Analytics>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Threat operations
  async getThreats(limit = 50): Promise<Threat[]> {
    return await db
      .select()
      .from(threats)
      .orderBy(desc(threats.createdAt))
      .limit(limit);
  }

  async createThreat(threat: InsertThreat): Promise<Threat> {
    const [newThreat] = await db
      .insert(threats)
      .values(threat)
      .returning();
    return newThreat;
  }

  async updateThreat(id: string, updates: Partial<InsertThreat>): Promise<Threat> {
    const [updatedThreat] = await db
      .update(threats)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(threats.id, id))
      .returning();
    return updatedThreat;
  }

  // Evidence operations
  async getEvidence(limit = 50): Promise<Evidence[]> {
    return await db
      .select()
      .from(evidence)
      .orderBy(desc(evidence.createdAt))
      .limit(limit);
  }

  async createEvidence(evidenceData: InsertEvidence): Promise<Evidence> {
    // Generate blockchain hash
    const blockHash = this.generateBlockHash();
    
    const [newEvidence] = await db
      .insert(evidence)
      .values({
        ...evidenceData,
        blockHash,
        dataHash: this.generateDataHash(evidenceData.description || ''),
      })
      .returning();
    return newEvidence;
  }

  async verifyEvidence(id: string): Promise<Evidence> {
    const [verifiedEvidence] = await db
      .update(evidence)
      .set({ verified: true })
      .where(eq(evidence.id, id))
      .returning();
    return verifiedEvidence;
  }

  // Incident operations
  async getIncidents(limit = 50): Promise<Incident[]> {
    return await db
      .select()
      .from(incidents)
      .orderBy(desc(incidents.createdAt))
      .limit(limit);
  }

  async createIncident(incident: InsertIncident): Promise<Incident> {
    const [newIncident] = await db
      .insert(incidents)
      .values(incident)
      .returning();
    return newIncident;
  }

  async updateIncident(id: string, updates: Partial<InsertIncident>): Promise<Incident> {
    const [updatedIncident] = await db
      .update(incidents)
      .set({ ...updates, updatedAt: new Date() })
      .where(eq(incidents.id, id))
      .returning();
    return updatedIncident;
  }

  // Simulation operations
  async getSimulations(limit = 50): Promise<Simulation[]> {
    return await db
      .select()
      .from(simulations)
      .orderBy(desc(simulations.createdAt))
      .limit(limit);
  }

  async createSimulation(simulation: InsertSimulation): Promise<Simulation> {
    const [newSimulation] = await db
      .insert(simulations)
      .values(simulation)
      .returning();
    return newSimulation;
  }

  async updateSimulation(id: string, updates: Partial<InsertSimulation>): Promise<Simulation> {
    const [updatedSimulation] = await db
      .update(simulations)
      .set(updates)
      .where(eq(simulations.id, id))
      .returning();
    return updatedSimulation;
  }

  // Analytics operations
  async getAnalytics(metricType?: string, limit = 100): Promise<Analytics[]> {
    if (metricType) {
      return await db
        .select()
        .from(analytics)
        .where(eq(analytics.metricType, metricType))
        .orderBy(desc(analytics.timestamp))
        .limit(limit);
    }
    
    return await db
      .select()
      .from(analytics)
      .orderBy(desc(analytics.timestamp))
      .limit(limit);
  }

  async createAnalytics(analyticsData: InsertAnalytics): Promise<Analytics> {
    const [newAnalytics] = await db
      .insert(analytics)
      .values(analyticsData)
      .returning();
    return newAnalytics;
  }

  // Utility methods for blockchain functionality
  private generateBlockHash(): string {
    return `0x${randomUUID().replace(/-/g, '').substring(0, 8)}`;
  }

  private generateDataHash(data: string): string {
    return `0x${Buffer.from(data).toString('hex').substring(0, 16)}`;
  }
}

export const storage = new DatabaseStorage();
