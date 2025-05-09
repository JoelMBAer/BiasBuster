export enum GameState {
  CANDIDATE_SELECTION = 'candidate_selection',
  REFLECTION = 'reflection',
  DASHBOARD = 'dashboard',
  FINAL_DASHBOARD = 'final_dashboard'
}

export interface EducationDetail {
  institution: string;
  degree: string;
  years: string;
}

export interface ExperienceDetail {
  title: string;
  company: string;
  years: string;
  details?: string[];
  note?: string;
}

export interface Reference {
  name: string;
  title: string;
  quote: string;
}

export interface Candidate {
  id: number;
  name: string;
  gender: string;
  age: number;
  experience: number;
  education: string;
  educationDetails: EducationDetail[];
  experienceDetails: ExperienceDetail[];
  skills: {
    technical: string[];
    soft: string;
  };
  softSkill: string;
  softSkillDetail: string;
  references: Reference[];
  interviewQuote: string;
  followupQuestion: string;
  followupAnswer: string;
  goldStar: string;
  redFlag: string;
  keyStrength: string;
  mainInfluence?: string; // Added for tracking decision influence in reflections
}

export interface BiasInsight {
  type: 'education' | 'experience' | 'age' | 'gender' | 'communication' | 'interview' | 'skills' | 'personal';
  title: string;
  description: string;
  percentage: number;
}

export interface GameSession {
  id: string;
  currentRound: number;
  maxRounds: number;
  level: string;
  biasScore: number;
  selectedCandidates: Candidate[];
  completedAt?: string;
  createdAt: string;
}

export interface GameDecision {
  sessionId: string;
  roundNumber: number;
  selectedCandidateId: number;
  mainInfluence: string;
  reflectionNotes?: string;
  createdAt: string;
}
