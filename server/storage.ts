import { users, type User, type InsertUser } from "@shared/schema";
import { 
  InsertGameSession, 
  GameSession, 
  InsertGameDecision, 
  GameDecision, 
  InsertCandidate, 
  Candidate
} from "@shared/schema";

// Interface with all CRUD methods needed for the app
export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  
  // Game session methods
  getGameSession(sessionId: string): Promise<GameSession | undefined>;
  createGameSession(session: InsertGameSession): Promise<GameSession>;
  updateGameSessionRound(sessionId: string, round: number): Promise<GameSession | undefined>;
  completeGameSession(sessionId: string): Promise<GameSession | undefined>;
  
  // Game decision methods
  getGameDecisions(sessionId: string): Promise<GameDecision[]>;
  createGameDecision(decision: InsertGameDecision): Promise<GameDecision>;
  
  // Candidate methods
  getCandidate(id: number): Promise<Candidate | undefined>;
  createCandidate(candidate: InsertCandidate): Promise<Candidate>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private gameSessions: Map<string, GameSession>;
  private gameDecisions: Map<string, GameDecision[]>;
  private candidates: Map<number, Candidate>;
  private userIdCounter: number;
  private candidateIdCounter: number;
  private decisionIdCounter: number;
  private gameSessionIdCounter: number;

  constructor() {
    this.users = new Map();
    this.gameSessions = new Map();
    this.gameDecisions = new Map();
    this.candidates = new Map();
    this.userIdCounter = 1;
    this.candidateIdCounter = 1;
    this.decisionIdCounter = 1;
    this.gameSessionIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }
  
  // Game session methods
  async getGameSession(sessionId: string): Promise<GameSession | undefined> {
    return this.gameSessions.get(sessionId);
  }
  
  async createGameSession(insertSession: InsertGameSession): Promise<GameSession> {
    const id = this.gameSessionIdCounter++;
    
    // Ensure required fields have default values
    const session: GameSession = { 
      ...insertSession, 
      id,
      // Provide defaults for required fields if they are missing
      userId: insertSession.userId ?? null,
      currentRound: insertSession.currentRound ?? 1,
      maxRounds: insertSession.maxRounds ?? 5,
      level: insertSession.level ?? "Novice Recruiter",
      biasScore: insertSession.biasScore ?? 0,
      selectedCandidates: Array.isArray(insertSession.selectedCandidates) 
        ? insertSession.selectedCandidates 
        : [],
      completedAt: insertSession.completedAt ?? null
    };
    
    this.gameSessions.set(session.sessionId, session);
    this.gameDecisions.set(session.sessionId, []);
    return session;
  }
  
  async updateGameSessionRound(sessionId: string, round: number): Promise<GameSession | undefined> {
    const session = this.gameSessions.get(sessionId);
    if (!session) return undefined;
    
    // Update current round if the new round is higher
    if (round > session.currentRound) {
      session.currentRound = round;
      this.gameSessions.set(sessionId, session);
    }
    
    return session;
  }
  
  async completeGameSession(sessionId: string): Promise<GameSession | undefined> {
    const session = this.gameSessions.get(sessionId);
    if (!session) return undefined;
    
    session.completedAt = new Date().toISOString();
    this.gameSessions.set(sessionId, session);
    
    return session;
  }
  
  // Game decision methods
  async getGameDecisions(sessionId: string): Promise<GameDecision[]> {
    return this.gameDecisions.get(sessionId) || [];
  }
  
  async createGameDecision(insertDecision: InsertGameDecision): Promise<GameDecision> {
    const id = this.decisionIdCounter++;
    
    // Ensure all required fields are present
    const decision: GameDecision = { 
      ...insertDecision, 
      id,
      // Default value for reflectionNotes if undefined
      reflectionNotes: insertDecision.reflectionNotes ?? null
    };
    
    const decisions = this.gameDecisions.get(decision.sessionId) || [];
    decisions.push(decision);
    this.gameDecisions.set(decision.sessionId, decisions);
    
    // Update the selected candidates array in the session
    const session = this.gameSessions.get(decision.sessionId);
    if (session) {
      const candidate = this.candidates.get(decision.selectedCandidateId);
      if (candidate) {
        // Make sure selectedCandidates is an array
        const currentCandidates = Array.isArray(session.selectedCandidates) 
          ? session.selectedCandidates as Candidate[]
          : [] as Candidate[];
        
        // Add candidate to session's selectedCandidates
        session.selectedCandidates = [...currentCandidates, candidate] as any;
        this.gameSessions.set(decision.sessionId, session);
      } else {
        // If we can't find the candidate in our storage, but we have the selected candidate ID,
        // just add the decision without updating the session's selectedCandidates.
        // This prevents errors, but the dashboard won't show the candidate.
        console.log(`Warning: Candidate with ID ${decision.selectedCandidateId} not found in storage.`);
      }
    }
    
    return decision;
  }
  
  // Candidate methods
  async getCandidate(id: number): Promise<Candidate | undefined> {
    return this.candidates.get(id);
  }
  
  async createCandidate(insertCandidate: InsertCandidate): Promise<Candidate> {
    // Check if the candidate already has an ID
    let id = ('id' in insertCandidate && typeof insertCandidate.id === 'number') 
      ? insertCandidate.id 
      : this.candidateIdCounter++;
    
    console.log("Creating candidate with ID:", id, "from:", insertCandidate);
    
    // Ensure all required fields are present
    const candidate: Candidate = { 
      ...insertCandidate, 
      id,
      // Ensure all optional fields have default values
      redFlag: insertCandidate.redFlag ?? null,
      goldStar: insertCandidate.goldStar ?? null
    };
    
    this.candidates.set(id, candidate);
    
    // Update the counter if we used a higher ID
    if (id >= this.candidateIdCounter) {
      this.candidateIdCounter = id + 1;
    }
    
    return candidate;
  }
}

export const storage = new MemStorage();
