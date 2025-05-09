import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/layout/Header";
import CandidateCard from "@/components/CandidateCard";
import ReflectionScreen from "@/components/ReflectionScreen";
import Dashboard from "@/components/Dashboard";
import EducationalPopup from "@/components/EducationalPopup";
import { useGameState } from "@/hooks/useGameState";
import { apiRequest } from "@/lib/queryClient";
import { generateCandidates } from "@/utils/candidateGenerator";
import { GameState, Candidate } from "@/types/game";

const Game = () => {
  const { toast } = useToast();
  const { 
    gameState, 
    updateGameState, 
    currentRound, 
    updateCurrentRound,
    maxRounds,
    level,
    selectedCandidates,
    addSelectedCandidate,
    biasInsights,
    updateBiasInsights,
    createNewGame,
    sessionId
  } = useGameState();
  
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showEducationalPopup, setShowEducationalPopup] = useState(false);
  const [educationalContent, setEducationalContent] = useState({
    title: "",
    content: "",
    tip: ""
  });
  
  // Loading state for candidates
  const [isLoading, setIsLoading] = useState(false);

  // Array of different job positions organized by department for more diversity
  const jobPositionsByDepartment = {
    technology: [
      "Software Engineer", 
      "Frontend Developer", 
      "Data Scientist",
      "DevOps Engineer",
      "Mobile App Developer",
      "Cloud Solutions Architect",
      "Machine Learning Engineer"
    ],
    business: [
      "Marketing Manager", 
      "Financial Analyst", 
      "Business Development Director",
      "Sales Executive",
      "Brand Strategist",
      "Market Research Analyst"
    ],
    creative: [
      "UX/UI Designer",
      "Product Designer",
      "Content Strategist",
      "Creative Director",
      "User Experience Researcher"
    ],
    people: [
      "Human Resources Director",
      "Talent Acquisition Manager",
      "Employee Experience Lead",
      "Learning & Development Specialist",
      "Diversity & Inclusion Manager"
    ],
    operations: [
      "Project Manager",
      "Operations Director",
      "Quality Assurance Manager",
      "Logistics Coordinator",
      "Customer Success Manager"
    ]
  };

  // State for the current job position and department
  const [currentJobPosition, setCurrentJobPosition] = useState<string>("Software Engineer");
  const [currentDepartment, setCurrentDepartment] = useState<string>("Technology");

  // Generate candidates on initial load and round change
  useEffect(() => {
    const loadCandidates = async () => {
      if (gameState === GameState.CANDIDATE_SELECTION) {
        setIsLoading(true);
        
        // Update job position based on current round - rotate through departments and positions
        const departmentKeys = Object.keys(jobPositionsByDepartment);
        const departmentIndex = (currentRound - 1) % departmentKeys.length;
        const newDepartment = departmentKeys[departmentIndex];
        
        // Determine position within the department
        const positionsInDepartment = jobPositionsByDepartment[newDepartment as keyof typeof jobPositionsByDepartment];
        const positionIndex = Math.floor((currentRound - 1) / departmentKeys.length) % positionsInDepartment.length;
        const newPosition = positionsInDepartment[positionIndex];
        
        // Update state for department and position
        setCurrentDepartment(newDepartment);
        setCurrentJobPosition(newPosition);
        
        console.log(`Round ${currentRound}: Generating candidates for ${newPosition} (${newDepartment} department)`);
        
        try {
          // Import the job-specific candidate generator
          const { generateJobSpecificCandidates } = await import('@/utils/jobSpecificCandidateGenerator');
          
          // Generate candidates aligned with the current job position
          const generatedCandidates = await generateJobSpecificCandidates(newPosition, 3);
          
          // Update state with the generated candidates
          setCandidates(generatedCandidates);
        } catch (error) {
          console.error('Error generating candidates:', error);
          toast({
            title: "Error",
            description: "Failed to generate candidates. Please try again.",
            variant: "destructive"
          });
        } finally {
          setIsLoading(false);
        }
      }
    };
    
    loadCandidates();
  }, [gameState, currentRound, toast]);

  // Analyze bias with OpenAI or fallback to local generation
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  const analyzeBias = async () => {
    if (selectedCandidates.length === 0) return;
    
    setIsAnalyzing(true);
    try {
      const { analyzeBiasPatterns } = await import('@/services/openaiService');
      const { generateBiasInsights } = await import('@/utils/biasInsightGenerator');
      
      try {
        // First try to use OpenAI
        const result = await analyzeBiasPatterns({
          selectedCandidates,
          currentRound,
          totalRounds: maxRounds
        });
        
        // Update bias insights and proceed to dashboard
        updateBiasInsights(result.biasInsights);
        return result;
      } catch (apiError) {
        // If OpenAI fails, generate insights locally
        console.warn('Falling back to local bias insight generation:', apiError);
        
        // Generate local insights based on candidate patterns
        const localInsights = generateBiasInsights(selectedCandidates);
        updateBiasInsights(localInsights);
        
        return {
          biasInsights: localInsights,
          overallBiasScore: 65,
          recommendations: [
            'Consider using blind resume reviews in initial screening stages.',
            'Establish consistent evaluation criteria before reviewing applications.',
            'Include diverse perspectives in your hiring committees.'
          ]
        };
      }
    } catch (error) {
      console.error('Error analyzing bias patterns:', error);
      toast({
        title: "Error",
        description: "Could not analyze bias patterns. Using default insights.",
        variant: "destructive"
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Submit decision to server
  const submitDecision = async (mainInfluence: string, reflectionNotes?: string) => {
    if (!selectedCandidate) return;
    
    try {
      console.log("Submitting decision for candidate:", selectedCandidate);
      
      // Attach the mainInfluence directly to the candidate for easier analysis
      const updatedCandidate = {
        ...selectedCandidate,
        mainInfluence: mainInfluence // Add the influence factor to the candidate
      };
      
      // First, save the candidate with the influence data
      const apiRequestOptions = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedCandidate)
      };
      
      // Save the candidate to ensure it exists in storage
      await apiRequest("/api/candidates", apiRequestOptions);
      
      // Now submit the decision
      const decisionPayload = {
        sessionId,
        roundNumber: currentRound,
        selectedCandidateId: updatedCandidate.id,
        candidate: updatedCandidate, // Include the full updated candidate object
        mainInfluence,
        reflectionNotes: reflectionNotes || "",
        createdAt: new Date().toISOString()
      };
      
      console.log("Submitting decision payload:", decisionPayload);
      
      await apiRequest("/api/game/decision", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(decisionPayload)
      });
      
      // Add to selected candidates with the influence data
      addSelectedCandidate(updatedCandidate);
      
      // Show educational popup after each round with different content
      const educationalPopups = [
        {
          title: "Name Bias in Hiring",
          content: "Studies show that candidates with traditionally \"White-sounding\" names receive 50% more callbacks than identical resumes with names perceived as belonging to racial minorities.",
          tip: "Consider implementing \"blind resume\" reviews where names and identifying information are removed during initial screening."
        },
        {
          title: "Age Discrimination Awareness",
          content: "Research indicates that workers over 40 experience bias in hiring, with applicants over 50 having to submit up to 50% more applications to receive the same number of interviews as younger candidates.",
          tip: "Focus on job-relevant skills and experiences rather than graduation dates or career length. Consider implementing age-blind application reviews."
        },
        {
          title: "Gender Bias in Technical Roles",
          content: "Studies show that women in technical fields face bias during hiring, with identical resumes receiving different evaluations when the name is changed from male to female.",
          tip: "Use structured interviews with predetermined questions and evaluation criteria to reduce the impact of unconscious gender bias."
        },
        {
          title: "Education Prestige Bias",
          content: "Candidates from prestigious universities often receive preferential treatment regardless of actual skills or experience, limiting diversity and overlooking qualified candidates from other institutions.",
          tip: "Implement skills-based assessments that directly measure job-relevant abilities rather than using alma mater as a proxy for quality."
        },
        {
          title: "Affinity Bias Awareness",
          content: "People naturally gravitate toward candidates who remind them of themselves, creating 'mini-me' hiring patterns that limit diversity and innovation.",
          tip: "Include diverse perspectives in the hiring process and create accountability mechanisms to challenge hiring decisions."
        }
      ];
      
      // Select an educational popup based on the round number
      if (currentRound <= educationalPopups.length) {
        setEducationalContent(educationalPopups[currentRound - 1]);
        setShowEducationalPopup(true);
      }
      
      // Only show dashboard at the final round
      if (currentRound >= maxRounds) {
        // Final dashboard - analyze bias for final insights
        await analyzeBias();
        updateGameState(GameState.FINAL_DASHBOARD);
      } else {
        // Move to next round
        updateCurrentRound(currentRound + 1);
        updateGameState(GameState.CANDIDATE_SELECTION);
        setSelectedCandidate(null);
      }
      
    } catch (error) {
      console.error("Error submitting decision:", error);
      // Show a more descriptive error message
      let errorMessage = "Failed to submit your decision. Please try again.";
      
      if (error instanceof Error) {
        errorMessage += " Error: " + error.message;
      }
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
        duration: 5000 // Give users more time to read the error
      });
    }
  };

  const handleCandidateSelect = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    updateGameState(GameState.REFLECTION);
  };

  const handleContinueFromDashboard = () => {
    updateCurrentRound(currentRound + 1);
    updateGameState(GameState.CANDIDATE_SELECTION);
  };

  const renderGameContent = () => {
    switch (gameState) {
      case GameState.CANDIDATE_SELECTION:
        return (
          <div>
            <div className="mb-8">
              <h2 className="text-xl md:text-2xl font-heading font-bold text-neutral-500 mb-2">Select the Best Candidate</h2>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800">
                  {currentDepartment} Department
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                  Round {currentRound} of {maxRounds}
                </span>
              </div>
              <p className="text-muted-foreground">Review each candidate's profile and select one to hire for the <span className="font-semibold text-primary">{currentJobPosition}</span> position.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {isLoading ? (
                // Loading skeleton
                <>
                  {[...Array(3)].map((_, index) => (
                    <div key={index} className="animate-pulse bg-white rounded-lg shadow-md p-6">
                      <div className="flex items-center mb-4">
                        <div className="w-12 h-12 bg-neutral-200 rounded-full mr-3"></div>
                        <div className="flex-1">
                          <div className="h-4 bg-neutral-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-neutral-200 rounded w-1/2"></div>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="h-3 bg-neutral-200 rounded"></div>
                        <div className="h-3 bg-neutral-200 rounded"></div>
                        <div className="h-3 bg-neutral-200 rounded w-5/6"></div>
                      </div>
                      <div className="mt-6 h-10 bg-neutral-200 rounded"></div>
                    </div>
                  ))}
                </>
              ) : (
                // Actual candidates
                candidates.map((candidate, index) => (
                  <CandidateCard 
                    key={index} 
                    candidate={candidate} 
                    onSelect={() => handleCandidateSelect(candidate)}
                  />
                ))
              )}
            </div>
          </div>
        );
      
      case GameState.REFLECTION:
        return (
          <ReflectionScreen 
            selectedCandidate={selectedCandidate} 
            onSubmit={submitDecision}
          />
        );
      
      case GameState.DASHBOARD:
      case GameState.FINAL_DASHBOARD:
        return (
          <Dashboard 
            isFinal={gameState === GameState.FINAL_DASHBOARD}
            selectedCandidates={selectedCandidates}
            biasInsights={biasInsights}
            isAnalyzing={isAnalyzing}
            onContinue={handleContinueFromDashboard}
            onNewGame={() => {
              createNewGame();
              updateGameState(GameState.CANDIDATE_SELECTION);
            }}
          />
        );
      
      default:
        return null;
    }
  };
  
  return (
    <div className="min-h-screen bg-neutral-100 flex flex-col">
      <Header 
        currentRound={currentRound} 
        maxRounds={maxRounds} 
        level={level} 
      />
      
      {/* Game Progress Bar */}
      <div className="bg-white shadow-sm">
        <div className="container mx-auto px-6 py-3">
          <div className="flex items-center justify-between mb-1">
            <span className="text-sm font-semibold text-neutral-400">Game Progress</span>
            <span className="text-sm font-semibold text-neutral-400">{Math.round((currentRound / maxRounds) * 100)}%</span>
          </div>
          <div className="w-full bg-neutral-200 rounded-full h-2">
            <div 
              className="bg-secondary h-2 rounded-full transition-all duration-500" 
              style={{ width: `${Math.round((currentRound / maxRounds) * 100)}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      {/* Main Game Area */}
      <main className="flex-grow container mx-auto px-4 py-6">
        {renderGameContent()}
      </main>
      
      {/* Educational Popup */}
      <EducationalPopup 
        show={showEducationalPopup}
        title={educationalContent.title}
        content={educationalContent.content}
        tip={educationalContent.tip}
        onClose={() => setShowEducationalPopup(false)}
      />
    </div>
  );
};

export default Game;
