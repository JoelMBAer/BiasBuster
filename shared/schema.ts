import { pgTable, text, serial, integer, boolean, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export const candidates = pgTable("candidates", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  gender: text("gender").notNull(),
  age: integer("age").notNull(),
  experience: integer("experience").notNull(),
  education: text("education").notNull(), 
  educationDetails: jsonb("education_details").notNull(),
  experience_details: jsonb("experience_details").notNull(),
  skills: jsonb("skills").notNull(),
  softSkill: text("soft_skill").notNull(),
  softSkillDetail: text("soft_skill_detail").notNull(),
  references: jsonb("references").notNull(),
  interviewQuote: text("interview_quote").notNull(),
  followupQuestion: text("followup_question").notNull(),
  followupAnswer: text("followup_answer").notNull(),
  redFlag: text("red_flag").default(""),
  goldStar: text("gold_star").default(""),
  keyStrength: text("key_strength").notNull(),
});

export const insertCandidateSchema = createInsertSchema(candidates).omit({
  id: true, 
});

export const gameSessions = pgTable("game_sessions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id"),
  sessionId: text("session_id").notNull().unique(),
  currentRound: integer("current_round").notNull().default(1),
  maxRounds: integer("max_rounds").notNull().default(5),
  level: text("level").notNull().default("Novice Recruiter"),
  biasScore: integer("bias_score").notNull().default(0),
  selectedCandidates: jsonb("selected_candidates").notNull().default([]),
  completedAt: text("completed_at"),
  createdAt: text("created_at").notNull(),
});

export const insertGameSessionSchema = createInsertSchema(gameSessions).omit({
  id: true,
});

export const gameDecisions = pgTable("game_decisions", {
  id: serial("id").primaryKey(),
  sessionId: text("session_id").notNull(),
  roundNumber: integer("round_number").notNull(),
  selectedCandidateId: integer("selected_candidate_id").notNull(),
  mainInfluence: text("main_influence").notNull(),
  reflectionNotes: text("reflection_notes"),
  createdAt: text("created_at").notNull(),
});

export const insertGameDecisionSchema = createInsertSchema(gameDecisions).omit({
  id: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCandidate = z.infer<typeof insertCandidateSchema>;
export type Candidate = typeof candidates.$inferSelect;

export type InsertGameSession = z.infer<typeof insertGameSessionSchema>;
export type GameSession = typeof gameSessions.$inferSelect;

export type InsertGameDecision = z.infer<typeof insertGameDecisionSchema>;
export type GameDecision = typeof gameDecisions.$inferSelect;
