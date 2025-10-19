import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  integer,
  boolean,
  real
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table (mandatory for Replit Auth)
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table (mandatory for Replit Auth)
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("viewer"), // admin, analyst, viewer
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Threat detection records
export const threats = pgTable("threats", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // deepfake, autonomous_malware, ai_phishing
  severity: varchar("severity").notNull(), // critical, high, medium, low
  source: varchar("source"),
  description: text("description"),
  detected: boolean("detected").default(false),
  aiConfidence: real("ai_confidence"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Evidence records with blockchain logging
export const evidence = pgTable("evidence", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  threatId: varchar("threat_id").references(() => threats.id),
  blockHash: varchar("block_hash").notNull(),
  previousHash: varchar("previous_hash"),
  dataHash: varchar("data_hash").notNull(),
  description: text("description"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Incident records
export const incidents = pgTable("incidents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: varchar("title").notNull(),
  description: text("description"),
  severity: varchar("severity").notNull(),
  status: varchar("status").default("open"), // open, investigating, resolved, closed
  assignedTo: varchar("assigned_to").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Attack simulations
export const simulations = pgTable("simulations", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  type: varchar("type").notNull(), // deepfake, autonomous_malware, ai_phishing
  name: varchar("name").notNull(),
  description: text("description"),
  status: varchar("status").default("pending"), // pending, running, completed, failed
  detectionRate: real("detection_rate"),
  runBy: varchar("run_by").references(() => users.id),
  createdAt: timestamp("created_at").defaultNow(),
  completedAt: timestamp("completed_at"),
});

// Analytics data
export const analytics = pgTable("analytics", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  metricType: varchar("metric_type").notNull(),
  metricValue: real("metric_value").notNull(),
  timestamp: timestamp("timestamp").defaultNow(),
});

// System logs
export const logs = pgTable("logs", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  level: varchar("level").notNull(), // info, warning, error, critical
  category: varchar("category").notNull(), // security, forensic, system, user
  event: varchar("event").notNull(),
  description: text("description"),
  userId: varchar("user_id").references(() => users.id),
  metadata: text("metadata"), // JSON string for additional data
  timestamp: timestamp("timestamp").defaultNow(),
});

// Insert schemas
export const insertThreatSchema = createInsertSchema(threats).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertEvidenceSchema = createInsertSchema(evidence).omit({
  id: true,
  createdAt: true,
});

export const insertIncidentSchema = createInsertSchema(incidents).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertSimulationSchema = createInsertSchema(simulations).omit({
  id: true,
  createdAt: true,
  completedAt: true,
});

export const insertAnalyticsSchema = createInsertSchema(analytics).omit({
  id: true,
  timestamp: true,
});

export const insertLogSchema = createInsertSchema(logs).omit({
  id: true,
  timestamp: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Threat = typeof threats.$inferSelect;
export type InsertThreat = z.infer<typeof insertThreatSchema>;
export type Evidence = typeof evidence.$inferSelect;
export type InsertEvidence = z.infer<typeof insertEvidenceSchema>;
export type Incident = typeof incidents.$inferSelect;
export type InsertIncident = z.infer<typeof insertIncidentSchema>;
export type Simulation = typeof simulations.$inferSelect;
export type InsertSimulation = z.infer<typeof insertSimulationSchema>;
export type Analytics = typeof analytics.$inferSelect;
export type InsertAnalytics = z.infer<typeof insertAnalyticsSchema>;
export type Log = typeof logs.$inferSelect;
export type InsertLog = z.infer<typeof insertLogSchema>;
