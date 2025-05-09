import { createContext, useContext, useState, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { GameState, Candidate, BiasInsight } from '../types/game';

interface GameContextType {
  gameState: GameState;
  updateGameState: (state: GameState) => void;
  sessionId: string;
  currentRound: number;
  updateCurrentRound: (round: number) => void;
  maxRounds: number;
  level: string;
  biasScore: number;
  selectedCandidates: Candidate[];
  addSelectedCandidate: (candidate: Candidate) => void;
  biasInsights: BiasInsight[];
  updateBiasInsights: (insights: BiasInsight[]) => void;
  createNewGame: () => void;
}

const defaultBiasInsights: BiasInsight[] = [
  {
    type: 'education',
    title: 'Educational Bias',
    description: 'You showed a 75% preference for candidates from prestigious universities.',
    percentage: 75
  },
  {
    type: 'experience',
    title: 'Experience Length',
    description: 'You consistently selected candidates with 5+ years experience over other factors.',
    percentage: 80
  },
  {
    type: 'communication',
    title: 'Communication Style',
    description: 'You favored candidates with assertive communication styles 60% of the time.',
    percentage: 60
  }
];

const GameContext = createContext<GameContextType>({
  gameState: GameState.CANDIDATE_SELECTION,
  updateGameState: () => {},
  sessionId: '',
  currentRound: 1,
  updateCurrentRound: () => {},
  maxRounds: 5,
  level: 'Novice Recruiter',
  biasScore: 0,
  selectedCandidates: [],
  addSelectedCandidate: () => {},
  biasInsights: defaultBiasInsights,
  updateBiasInsights: () => {},
  createNewGame: () => {}
});

export const GameProvider = ({ children }: { children: ReactNode }): JSX.Element => {
  const [gameState, setGameState] = useState<GameState>(GameState.CANDIDATE_SELECTION);
  const [sessionId, setSessionId] = useState<string>(uuidv4());
  const [currentRound, setCurrentRound] = useState<number>(1);
  const [maxRounds, setMaxRounds] = useState<number>(5);
  const [level, setLevel] = useState<string>('Novice Recruiter');
  const [biasScore, setBiasScore] = useState<number>(0);
  const [selectedCandidates, setSelectedCandidates] = useState<Candidate[]>([]);
  const [biasInsights, setBiasInsights] = useState<BiasInsight[]>(defaultBiasInsights);
  
  const updateGameState = (state: GameState) => {
    setGameState(state);
  };
  
  const updateCurrentRound = (round: number) => {
    setCurrentRound(round);
  };
  
  const addSelectedCandidate = (candidate: Candidate) => {
    setSelectedCandidates(prev => [...prev, candidate]);
  };
  
  const updateBiasInsights = (insights: BiasInsight[]) => {
    setBiasInsights(insights);
  };
  
  const createNewGame = () => {
    setSessionId(uuidv4());
    setGameState(GameState.CANDIDATE_SELECTION);
    setCurrentRound(1);
    setSelectedCandidates([]);
    setBiasScore(0);
    setLevel('Novice Recruiter');
  };
  
  const contextValue = {
    gameState,
    updateGameState,
    sessionId,
    currentRound,
    updateCurrentRound,
    maxRounds,
    level,
    biasScore,
    selectedCandidates,
    addSelectedCandidate,
    biasInsights,
    updateBiasInsights,
    createNewGame
  };
  
  return (
    <GameContext.Provider value={contextValue}>
      {children}
    </GameContext.Provider>
  );
};

export const useGameState = () => useContext(GameContext);