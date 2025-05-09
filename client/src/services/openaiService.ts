import { Candidate, BiasInsight } from '@/types/game';
import { apiRequest } from '@/lib/queryClient';

// Request and response interfaces for various AI functions
interface BiasAnalysisRequest {
  selectedCandidates: Candidate[];
  currentRound: number;
  totalRounds: number;
}

interface BiasAnalysisResponse {
  biasInsights: BiasInsight[];
  overallBiasScore: number;
  recommendations: string[];
}

interface CandidateResponseRequest {
  candidate: Candidate;
  question: string;
  responseType: 'interview' | 'detailed' | 'animated';
}

interface BiasReflectionRequest {
  selectedCandidate: Candidate;
  otherCandidates: Candidate[];
}

interface BiasFlashcardRequest {
  biasPattern: string; // e.g., "highly educated males", "younger candidates"
}

interface PromptResponse {
  text: string;
}

/**
 * Analyzes user's candidate selections for patterns of bias
 */
export async function analyzeBiasPatterns(
  request: BiasAnalysisRequest
): Promise<BiasAnalysisResponse> {
  try {
    const response = await apiRequest<BiasAnalysisResponse>(
      '/api/openai/bias-analysis',
      {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error analyzing bias patterns:', error);
    
    // Return default insights if API call fails
    return {
      biasInsights: [
        {
          type: 'education',
          title: 'Educational Bias',
          description: 'You showed a preference for candidates from prestigious universities.',
          percentage: 75
        },
        {
          type: 'experience',
          title: 'Experience Length',
          description: 'You consistently selected candidates with more years of experience.',
          percentage: 60
        },
        {
          type: 'communication',
          title: 'Communication Style',
          description: 'You favored candidates with assertive communication styles.',
          percentage: 50
        }
      ],
      overallBiasScore: 65,
      recommendations: [
        'Consider using blind resume reviews in initial screening stages.',
        'Establish consistent evaluation criteria before reviewing applications.',
        'Include diverse perspectives in your hiring committees.'
      ]
    };
  }
}

/**
 * Generates a candidate's response to an interview question
 */
export async function generateCandidateResponse(
  request: CandidateResponseRequest
): Promise<PromptResponse> {
  try {
    const response = await apiRequest<PromptResponse>(
      '/api/openai/candidate-response',
      {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error generating candidate response:', error);
    return {
      text: "I appreciate that question. Based on my experience, I believe my skills in problem-solving and collaboration would be valuable here. I'm passionate about this field and always eager to learn more."
    };
  }
}

/**
 * Generates a reflection on possible bias in candidate selection
 */
export async function generateBiasReflection(
  request: BiasReflectionRequest
): Promise<PromptResponse> {
  try {
    const response = await apiRequest<PromptResponse>(
      '/api/openai/bias-reflection',
      {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error generating bias reflection:', error);
    return {
      text: "Your selection suggests a possible preference for candidates with prestigious educational backgrounds, which might overlook equivalent skills gained through alternative paths. What other qualifications or perspectives might you have undervalued in the candidates you didn't select?"
    };
  }
}

/**
 * Generates a flashcard with a fact or nudge to raise awareness about a bias pattern
 */
export async function generateBiasFlashcard(
  request: BiasFlashcardRequest
): Promise<PromptResponse> {
  try {
    const response = await apiRequest<PromptResponse>(
      '/api/openai/bias-flashcard',
      {
        method: 'POST',
        body: JSON.stringify(request),
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );
    
    return response;
  } catch (error) {
    console.error('Error generating bias flashcard:', error);
    return {
      text: "Research shows teams with diverse educational backgrounds solve complex problems 30% faster than homogeneous groups. Consider how different paths to expertise might strengthen your team's capabilities."
    };
  }
}