import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Candidate, BiasInsight, GameDecision } from "@/types/game";
import { GraduationCap, TrendingUp, UserCheck, Brain, Users, Lightbulb, BarChart } from "lucide-react";

interface DashboardProps {
  isFinal: boolean;
  selectedCandidates: Candidate[];
  biasInsights: BiasInsight[];
  onContinue: () => void;
  onNewGame: () => void;
  isAnalyzing?: boolean;
}

interface Fact {
  text: string;
  relevance: string;
}

interface SimulationResults {
  diversityChange: number;
  experienceChange: number;
  innovationChange: number;
}

export default function Dashboard({ 
  isFinal, 
  selectedCandidates, 
  biasInsights, 
  onContinue, 
  onNewGame, 
  isAnalyzing = false 
}: DashboardProps) {
  const [activeTab, setActiveTab] = useState("team-stats");
  const [selectedRound, setSelectedRound] = useState(0);
  const [alternativeCandidate, setAlternativeCandidate] = useState<Candidate | null>(null);
  const [simulationResults, setSimulationResults] = useState<SimulationResults>({
    diversityChange: 0,
    experienceChange: 0,
    innovationChange: 0
  });
  
  // Get unique candidates
  const getUniqueCandidates = () => {
    return selectedCandidates.filter((candidate, index, self) => 
      index === self.findIndex(c => c.id === candidate.id)
    );
  };
  
  // Calculate gender distribution for charts
  const calculateGenderDistribution = () => {
    const genderCount = {
      male: { count: 0, percentage: 0 },
      female: { count: 0, percentage: 0 },
      nonbinary: { count: 0, percentage: 0 }
    };
    
    // Use unique candidates only
    const uniqueCandidates = getUniqueCandidates();
    
    uniqueCandidates.forEach(candidate => {
      if (candidate.gender.toLowerCase() === "male") {
        genderCount.male.count++;
      } else if (candidate.gender.toLowerCase() === "female") {
        genderCount.female.count++;
      } else {
        genderCount.nonbinary.count++;
      }
    });
    
    const total = uniqueCandidates.length;
    if (total > 0) {
      genderCount.male.percentage = Math.round((genderCount.male.count / total) * 100);
      genderCount.female.percentage = Math.round((genderCount.female.count / total) * 100);
      genderCount.nonbinary.percentage = Math.round((genderCount.nonbinary.count / total) * 100);
    }
    
    return genderCount;
  };
  
  // Calculate age distribution for charts
  const calculateAgeDistribution = () => {
    const ageCount = {
      '20-29': { count: 0, percentage: 0 },
      '30-39': { count: 0, percentage: 0 },
      '40-49': { count: 0, percentage: 0 },
      '50+': { count: 0, percentage: 0 }
    };
    
    // Use unique candidates
    const uniqueCandidates = getUniqueCandidates();
    
    uniqueCandidates.forEach(candidate => {
      if (candidate.age < 30) {
        ageCount['20-29'].count++;
      } else if (candidate.age < 40) {
        ageCount['30-39'].count++;
      } else if (candidate.age < 50) {
        ageCount['40-49'].count++;
      } else {
        ageCount['50+'].count++;
      }
    });
    
    const total = uniqueCandidates.length;
    if (total > 0) {
      ageCount['20-29'].percentage = Math.round((ageCount['20-29'].count / total) * 100);
      ageCount['30-39'].percentage = Math.round((ageCount['30-39'].count / total) * 100);
      ageCount['40-49'].percentage = Math.round((ageCount['40-49'].count / total) * 100);
      ageCount['50+'].percentage = Math.round((ageCount['50+'].count / total) * 100);
    }
    
    return ageCount;
  };
  
  // Calculate education distribution for charts
  const calculateEducationDistribution = () => {
    const eduCount = {
      bachelors: { count: 0, percentage: 0 },
      masters: { count: 0, percentage: 0 },
      other: { count: 0, percentage: 0 }
    };
    
    // Use unique candidates
    const uniqueCandidates = getUniqueCandidates();
    
    uniqueCandidates.forEach(candidate => {
      if (candidate.education.toLowerCase().includes("bachelor")) {
        eduCount.bachelors.count++;
      } else if (candidate.education.toLowerCase().includes("master")) {
        eduCount.masters.count++;
      } else {
        eduCount.other.count++;
      }
    });
    
    const total = uniqueCandidates.length;
    if (total > 0) {
      eduCount.bachelors.percentage = Math.round((eduCount.bachelors.count / total) * 100);
      eduCount.masters.percentage = Math.round((eduCount.masters.count / total) * 100);
      eduCount.other.percentage = Math.round((eduCount.other.count / total) * 100);
    }
    
    return eduCount;
  };
  
  // Calculate performance score based on diversity and experience
  const calculatePerformanceScore = () => {
    // Get unique candidates
    const uniqueCandidates = getUniqueCandidates();
    if (uniqueCandidates.length === 0) return 50;
    
    // Gender diversity
    const genderDist = { male: 0, female: 0, nonbinary: 0 };
    uniqueCandidates.forEach(c => {
      if (c.gender.toLowerCase() === "male") genderDist.male++;
      else if (c.gender.toLowerCase() === "female") genderDist.female++;
      else genderDist.nonbinary++;
    });
    
    const totalCandidates = uniqueCandidates.length;
    const genderDiversity = Object.values(genderDist).filter(count => 
      (count / totalCandidates) > 0.2
    ).length;
    
    // Age diversity
    const ageDist = { '20-29': 0, '30-39': 0, '40-49': 0, '50+': 0 };
    uniqueCandidates.forEach(c => {
      if (c.age < 30) ageDist['20-29']++;
      else if (c.age < 40) ageDist['30-39']++;
      else if (c.age < 50) ageDist['40-49']++;
      else ageDist['50+']++;
    });
    
    const ageDiversity = Object.values(ageDist).filter(count => 
      (count / totalCandidates) > 0.1
    ).length;
    
    // Education diversity
    const eduDist = { bachelors: 0, masters: 0, other: 0 };
    uniqueCandidates.forEach(c => {
      if (c.education.toLowerCase().includes("bachelor")) eduDist.bachelors++;
      else if (c.education.toLowerCase().includes("master")) eduDist.masters++;
      else eduDist.other++;
    });
    
    const eduDiversity = Object.values(eduDist).filter(count => 
      (count / totalCandidates) > 0.1
    ).length;
    
    // Calculate performance score based on diversity factors
    const avgExperience = uniqueCandidates.reduce((sum, c) => sum + c.experience, 0) / totalCandidates;
    const experienceScore = Math.min(25, avgExperience * 2);
    const diversityScore = (genderDiversity * 10) + (ageDiversity * 5) + (eduDiversity * 10);
    
    return Math.min(95, 50 + diversityScore + experienceScore);
  };
  
  const genderDistribution = calculateGenderDistribution();
  const ageDistribution = calculateAgeDistribution();
  const educationDistribution = calculateEducationDistribution();
  const performanceScore = calculatePerformanceScore();
  
  // Decision influence state
  const [decisionInfluences, setDecisionInfluences] = useState({
    education: { count: 0, percentage: 0 },
    experience: { count: 0, percentage: 0 },
    gender: { count: 0, percentage: 0 },
    age: { count: 0, percentage: 0 },
    communication: { count: 0, percentage: 0 },
    skills: { count: 0, percentage: 0 }
  });
  
  // Fetch decision data to calculate influence percentages
  useEffect(() => {
    const fetchDecisions = async () => {
      try {
        // First check if we have reflected decisions in the game state from selectedCandidates
        let influences = {
          education: 0,
          experience: 0,
          gender: 0,
          age: 0,
          communication: 0,
          skills: 0
        };
        
        // If there's no data from the API, use the current session data
        // Look for the reflectionData in the candidate objects
        selectedCandidates.forEach(candidate => {
          if (candidate.mainInfluence) {
            // Convert the mainInfluence to a key in our influences object
            const key = candidate.mainInfluence.toLowerCase();
            if (influences.hasOwnProperty(key)) {
              influences[key as keyof typeof influences]++;
            }
          }
        });
        
        // Calculate percentages
        const total = Object.values(influences).reduce((sum, count) => sum + count, 0);
        const result = {
          education: { 
            count: influences.education, 
            percentage: total > 0 ? Math.round((influences.education / total) * 100) : 0 
          },
          experience: { 
            count: influences.experience, 
            percentage: total > 0 ? Math.round((influences.experience / total) * 100) : 0 
          },
          gender: { 
            count: influences.gender, 
            percentage: total > 0 ? Math.round((influences.gender / total) * 100) : 0 
          },
          age: { 
            count: influences.age, 
            percentage: total > 0 ? Math.round((influences.age / total) * 100) : 0 
          },
          communication: { 
            count: influences.communication, 
            percentage: total > 0 ? Math.round((influences.communication / total) * 100) : 0 
          },
          skills: { 
            count: influences.skills, 
            percentage: total > 0 ? Math.round((influences.skills / total) * 100) : 0 
          }
        };
        
        // If no influences were found, let's set some default data
        if (total === 0) {
          // Get data from the Game component if it exists
          try {
            const response = await fetch('/api/game/decisions');
            if (response.ok) {
              const decisions: GameDecision[] = await response.json();
              
              // Reset the influences
              influences = {
                education: 0,
                experience: 0,
                gender: 0,
                age: 0,
                communication: 0,
                skills: 0
              };
              
              // Count influences from game decisions
              decisions.forEach((decision) => {
                if (decision.mainInfluence) {
                  const key = decision.mainInfluence.toLowerCase();
                  if (influences.hasOwnProperty(key)) {
                    influences[key as keyof typeof influences]++;
                  }
                }
              });
              
              // Recalculate percentages
              const totalDecisions = Object.values(influences).reduce((sum, count) => sum + count, 0);
              if (totalDecisions > 0) {
                setDecisionInfluences({
                  education: { 
                    count: influences.education, 
                    percentage: Math.round((influences.education / totalDecisions) * 100)
                  },
                  experience: { 
                    count: influences.experience, 
                    percentage: Math.round((influences.experience / totalDecisions) * 100)
                  },
                  gender: { 
                    count: influences.gender, 
                    percentage: Math.round((influences.gender / totalDecisions) * 100)
                  },
                  age: { 
                    count: influences.age, 
                    percentage: Math.round((influences.age / totalDecisions) * 100) 
                  },
                  communication: { 
                    count: influences.communication, 
                    percentage: Math.round((influences.communication / totalDecisions) * 100)
                  },
                  skills: { 
                    count: influences.skills, 
                    percentage: Math.round((influences.skills / totalDecisions) * 100)
                  }
                });
                return; // Exit if we found decision data
              }
            }
          } catch (error) {
            console.error("Error fetching game decisions:", error);
          }
        }
        
        // If we got here, use the data from selectedCandidates
        setDecisionInfluences(result);
      } catch (error) {
        console.error("Error calculating decision influences:", error);
      }
    };
    
    fetchDecisions();
  }, [selectedCandidates]);
  
  // Generate an alternative candidate for what-if simulation
  const generateAlternativeCandidate = async () => {
    try {
      // Import only when needed - now with await since the function is async
      const { generateJobSpecificCandidates } = await import('@/utils/jobSpecificCandidateGenerator');
      
      // Create a diverse array of job positions for corporate settings
      const jobPositions = [
        "Software Developer", 
        "Marketing Manager", 
        "Financial Analyst", 
        "Human Resources Director",
        "Project Manager",
        "Data Scientist",
        "Customer Experience Manager",
        "Product Designer",
        "Operations Manager",
        "Sales Executive"
      ];
      
      // Get unique candidates
      const uniqueCandidates = getUniqueCandidates();
      
      // Generate names that are unique for each round
      const existingNames = uniqueCandidates.map(c => c.name);
      
      // If we're generating for a specific round, use the appropriate job position for that round
      let jobPosition = "";
      if (selectedRound >= 0 && selectedRound < uniqueCandidates.length) {
        // Use the same job position as the current candidate but ensure alternative has different characteristics
        if (uniqueCandidates[selectedRound].experienceDetails && 
            uniqueCandidates[selectedRound].experienceDetails[0] && 
            uniqueCandidates[selectedRound].experienceDetails[0].title) {
          jobPosition = uniqueCandidates[selectedRound].experienceDetails[0].title;
        } else {
          // If no title found (rare case), use a position from our list
          jobPosition = jobPositions[selectedRound % jobPositions.length];
        }
      } else {
        // Default case - use a position based on round number
        jobPosition = jobPositions[selectedRound % jobPositions.length];
      }
      
      // Generate a candidate with that position - now with await since function is async
      const generatedCandidates = await generateJobSpecificCandidates(jobPosition, 1);
      
      // Check if we got valid candidates
      if (!generatedCandidates || generatedCandidates.length === 0) {
        console.error("Failed to generate alternative candidate");
        return;
      }
      
      // Get the first candidate from the generated candidates array
      const newCandidate = generatedCandidates[0];
      
      // No longer need to check for unique names, as we generate with OpenAI
      // This will be handled by the API which creates unique profiles each time
      
      // Set the alternative candidate
      setAlternativeCandidate(newCandidate);
      
      // Calculate what would change if this candidate was selected
      // Create a copy of the unique candidates array
      const simulatedCandidates = [...uniqueCandidates];
      if (selectedRound >= 0 && selectedRound < simulatedCandidates.length) {
        // Replace the candidate at the selected round
        simulatedCandidates[selectedRound] = newCandidate;
        
        // Calculate diversity score with original team
        const originalGenderDiversity = calculateGenderDistribution();
        const originalAgeDiversity = calculateAgeDistribution();
        const originalEduDiversity = calculateEducationDistribution();
        
        // Create a function to calculate with simulated team
        const calculateSimulatedScore = (candidates: Candidate[]) => {
          // Gender diversity
          const genderDist: Record<string, number> = { male: 0, female: 0, nonbinary: 0 };
          candidates.forEach(c => {
            if (c.gender.toLowerCase() === "male") genderDist.male++;
            else if (c.gender.toLowerCase() === "female") genderDist.female++;
            else genderDist.nonbinary++;
          });
          
          const totalCandidates = candidates.length;
          const genderDiversity = Object.values(genderDist).filter(count => 
            (count / totalCandidates) > 0.2
          ).length;
          
          // Age diversity
          const ageDist: Record<string, number> = { '20-29': 0, '30-39': 0, '40-49': 0, '50+': 0 };
          candidates.forEach(c => {
            if (c.age < 30) ageDist['20-29']++;
            else if (c.age < 40) ageDist['30-39']++;
            else if (c.age < 50) ageDist['40-49']++;
            else ageDist['50+']++;
          });
          
          const ageDiversity = Object.values(ageDist).filter(count => 
            (count / totalCandidates) > 0.1
          ).length;
          
          // Education diversity
          const eduDist: Record<string, number> = { bachelors: 0, masters: 0, other: 0 };
          candidates.forEach(c => {
            if (c.education.toLowerCase().includes("bachelor")) eduDist.bachelors++;
            else if (c.education.toLowerCase().includes("master")) eduDist.masters++;
            else eduDist.other++;
          });
          
          const eduDiversity = Object.values(eduDist).filter(count => 
            (count / totalCandidates) > 0.1
          ).length;
          
          // Calculate changes
          return {
            diversityScore: genderDiversity + ageDiversity + eduDiversity,
            avgExperience: candidates.reduce((sum, c) => sum + c.experience, 0) / totalCandidates,
            innovation: Math.min(95, 50 + (genderDiversity * 10) + (ageDiversity * 5) + (eduDiversity * 10))
          };
        };
        
        // Calculate scores
        const originalScore = calculateSimulatedScore(uniqueCandidates);
        const newScore = calculateSimulatedScore(simulatedCandidates);
        
        // Calculate differences and set simulation results
        setSimulationResults({
          diversityChange: Math.round((newScore.diversityScore - originalScore.diversityScore) * 5), 
          experienceChange: Math.round((newScore.avgExperience - originalScore.avgExperience) * 10) / 10,
          innovationChange: Math.round(newScore.innovation - originalScore.innovation)
        });
      }
    } catch (error) {
      console.error("Error generating alternative candidate:", error);
    }
  };
  
  // Handle round selection in What-If simulator
  const handleRoundChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const round = parseInt(e.target.value);
    setSelectedRound(round);
    generateAlternativeCandidate();
  };
  
  // Handle simulation click
  const handleSimulateClick = () => {
    generateAlternativeCandidate();
  };
  
  // Initialize the What-If simulator when the component mounts
  useEffect(() => {
    // Only generate alternative candidate if we have selected candidates
    if (selectedCandidates.length > 0) {
      generateAlternativeCandidate();
    }
  }, []);
  
  return (
    <Card className="shadow-lg overflow-hidden">
      <CardHeader className="bg-primary text-white">
        <CardTitle className="text-xl md:text-2xl font-heading font-bold">Hiring Performance Dashboard</CardTitle>
        <CardDescription className="text-white/90">
          {isFinal 
            ? "After all rounds of hiring, here's your final team assessment" 
            : `After ${getUniqueCandidates().length} team members hired, here's how your team is shaping up`}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="p-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="w-full justify-start border-b rounded-none mb-6">
            <TabsTrigger value="team-stats">Team Statistics</TabsTrigger>
            <TabsTrigger value="bias-analysis">Bias Analysis</TabsTrigger>
            <TabsTrigger value="learning">Learning Insights</TabsTrigger>
          </TabsList>
          
          {/* Team Stats Tab */}
          <TabsContent value="team-stats" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              {/* Gender Diversity */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-heading font-semibold mb-3">Gender Distribution</h3>
                <div className="relative h-40 mb-8">
                  {/* Chart visualization */}
                  <div className="absolute bottom-0 left-0 w-1/3 bg-primary h-full rounded-t" 
                    style={{ height: `${genderDistribution.male.percentage}%` }}></div>
                  <div className="absolute bottom-0 left-1/3 w-1/3 bg-secondary h-full rounded-t" 
                    style={{ height: `${genderDistribution.female.percentage}%` }}></div>
                  <div className="absolute bottom-0 left-2/3 w-1/3 bg-neutral-300 h-full rounded-t" 
                    style={{ height: `${genderDistribution.nonbinary.percentage}%` }}></div>
                </div>
                  
                {/* Chart Labels */}
                <div className="flex justify-between mt-2">
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Male</span>
                    <span className="block text-xs">{genderDistribution.male.percentage}%</span>
                  </div>
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Female</span>
                    <span className="block text-xs">{genderDistribution.female.percentage}%</span>
                  </div>
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Non-binary</span>
                    <span className="block text-xs">{genderDistribution.nonbinary.percentage}%</span>
                  </div>
                </div>
              </div>
              
              {/* Age Distribution */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-heading font-semibold mb-3">Age Distribution</h3>
                <div className="relative h-40 mb-8">
                  <div className="absolute bottom-0 left-0 w-1/4 bg-primary h-full rounded-t" 
                    style={{ height: `${ageDistribution['20-29'].percentage}%` }}></div>
                  <div className="absolute bottom-0 left-1/4 w-1/4 bg-primary/80 h-full rounded-t" 
                    style={{ height: `${ageDistribution['30-39'].percentage}%` }}></div>
                  <div className="absolute bottom-0 left-2/4 w-1/4 bg-primary/60 h-full rounded-t" 
                    style={{ height: `${ageDistribution['40-49'].percentage}%` }}></div>
                  <div className="absolute bottom-0 left-3/4 w-1/4 bg-primary/40 h-full rounded-t" 
                    style={{ height: `${ageDistribution['50+'].percentage}%` }}></div>
                </div>
                  
                {/* Chart Labels */}
                <div className="flex justify-between mt-2">
                  <div className="w-1/4 text-center">
                    <span className="text-xs font-semibold">20-29</span>
                    <span className="block text-xs">{ageDistribution['20-29'].percentage}%</span>
                  </div>
                  <div className="w-1/4 text-center">
                    <span className="text-xs font-semibold">30-39</span>
                    <span className="block text-xs">{ageDistribution['30-39'].percentage}%</span>
                  </div>
                  <div className="w-1/4 text-center">
                    <span className="text-xs font-semibold">40-49</span>
                    <span className="block text-xs">{ageDistribution['40-49'].percentage}%</span>
                  </div>
                  <div className="w-1/4 text-center">
                    <span className="text-xs font-semibold">50+</span>
                    <span className="block text-xs">{ageDistribution['50+'].percentage}%</span>
                  </div>
                </div>
              </div>
              
              {/* Education Background */}
              <div className="border border-neutral-200 rounded-lg p-4">
                <h3 className="font-heading font-semibold mb-3">Education Background</h3>
                <div className="relative h-40 mb-8">
                  <div className="absolute bottom-0 left-0 w-1/3 bg-green-500 h-full rounded-t" 
                    style={{ height: `${educationDistribution.bachelors.percentage}%` }}></div>
                  <div className="absolute bottom-0 left-1/3 w-1/3 bg-orange-500 h-full rounded-t" 
                    style={{ height: `${educationDistribution.masters.percentage}%` }}></div>
                  <div className="absolute bottom-0 left-2/3 w-1/3 bg-neutral-300 h-full rounded-t" 
                    style={{ height: `${educationDistribution.other.percentage}%` }}></div>
                </div>
                  
                {/* Chart Labels */}
                <div className="flex justify-between mt-2">
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Bachelor's</span>
                    <span className="block text-xs">{educationDistribution.bachelors.percentage}%</span>
                  </div>
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Master's</span>
                    <span className="block text-xs">{educationDistribution.masters.percentage}%</span>
                  </div>
                  <div className="w-1/3 text-center">
                    <span className="text-xs font-semibold">Other</span>
                    <span className="block text-xs">{educationDistribution.other.percentage}%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Team Performance Predictor */}
            <div className="border border-neutral-200 rounded-lg p-4 mb-6">
              <h3 className="font-heading font-semibold mb-3">Team Performance Predictor</h3>
              <div className="relative h-12 bg-neutral-100 rounded-full overflow-hidden mb-2">
                <div 
                  className="absolute top-0 left-0 h-full bg-green-500 rounded-full" 
                  style={{ width: `${performanceScore}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-sm">
                <span>Below Average</span>
                <span>Average</span>
                <span>Excellent</span>
              </div>
              <p className="text-sm mt-3 text-neutral-500">
                Your team's predicted performance is <span className="font-semibold text-green-500">{performanceScore}% above average</span> based on diversity of skills, experience, and backgrounds.
              </p>
            </div>
            
            {/* Team Members */}
            <div>
              <h3 className="font-heading font-semibold mb-3">Your Current Team</h3>
              <div className="border border-neutral-200 rounded-lg overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-neutral-100">
                    <tr>
                      <th className="px-4 py-3 text-left">Name</th>
                      <th className="px-4 py-3 text-left">Age</th>
                      <th className="px-4 py-3 text-left">Job Position</th>
                      <th className="px-4 py-3 text-left">Education</th>
                      <th className="px-4 py-3 text-left">Experience</th>
                      <th className="px-4 py-3 text-left">Key Strength</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Show unique candidates only based on candidate ID */}
                    {selectedCandidates
                      .filter((candidate, index, self) => 
                        // Filter out duplicates by checking if this is the first occurrence of this ID
                        index === self.findIndex(c => c.id === candidate.id)
                      )
                      .map((candidate, index) => {
                        // Get the current job position from experience details
                        const jobPosition = candidate.experienceDetails && 
                                          candidate.experienceDetails.length > 0 ? 
                                          candidate.experienceDetails[0].title : 'Professional';
                        
                        return (
                          <tr key={candidate.id || index} className="border-t border-neutral-200">
                            <td className="px-4 py-3">{candidate.name}</td>
                            <td className="px-4 py-3">{candidate.age}</td>
                            <td className="px-4 py-3">{jobPosition}</td>
                            <td className="px-4 py-3">{candidate.education}</td>
                            <td className="px-4 py-3">{candidate.experience} years</td>
                            <td className="px-4 py-3">{candidate.keyStrength}</td>
                          </tr>
                        );
                      })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>
          
          {/* Bias Analysis Tab */}
          <TabsContent value="bias-analysis" className="mt-0">
            {/* Top Unconscious Influences */}
            <div className="mb-8">
              <h3 className="font-heading font-semibold mb-4">Top 3 Unconscious Influences</h3>
              
              {isAnalyzing ? (
                // Loading state
                <div className="py-10">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                    <p className="text-center font-medium text-neutral-600">
                      Analyzing your hiring patterns with AI...
                    </p>
                    <p className="text-center text-sm text-neutral-500 max-w-md mt-2">
                      Our AI is reviewing your candidate selections to identify potential unconscious biases in your decision-making process.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {biasInsights.slice(0, 3).map((insight, index) => (
                    <div key={index} className="border border-neutral-200 rounded-lg p-4">
                      <div className="flex items-center mb-3">
                        <div className={`w-10 h-10 flex items-center justify-center rounded-full ${
                          insight.percentage > 70 ? 'bg-red-100 text-red-600' : 
                          insight.percentage > 40 ? 'bg-orange-100 text-orange-600' : 
                          'bg-green-100 text-green-600'
                        }`}>
                          {insight.type === 'education' ? <GraduationCap size={20} /> : 
                           insight.type === 'experience' ? <TrendingUp size={20} /> :
                           insight.type === 'skills' ? <Brain size={20} /> :
                           insight.type === 'gender' ? <Users size={20} /> :
                           insight.type === 'age' ? <UserCheck size={20} /> :
                           insight.type === 'communication' ? <Lightbulb size={20} /> :
                           <BarChart size={20} />}
                        </div>
                        <div className="ml-3">
                          <h4 className="font-medium">{insight.title}</h4>
                          <div className="flex items-center">
                            <span className={`text-xs ${
                              insight.percentage > 70 ? 'text-red-600' : 
                              insight.percentage > 40 ? 'text-orange-600' : 
                              'text-green-600'
                            }`}>{insight.percentage}% strength</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-neutral-600">{insight.description}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            {/* Decision Consistency Heatmap */}
            <div className="mb-8">
              <h3 className="font-heading font-semibold mb-4">Decision Consistency Heatmap</h3>
              <div className="border border-neutral-200 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-4">
                  This heatmap shows which selection criteria appear to have the strongest influence on your hiring decisions.
                </p>
                <div className="space-y-4">
                  {/* Education */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Education</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.education.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.education.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Experience */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Experience</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.experience.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.experience.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Gender */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Gender</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.gender.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.gender.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Age */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Age</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.age.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.age.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Communication Style */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Communication</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.communication.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.communication.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* Technical Skills */}
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-sm font-medium">Skills</span>
                      <span className="text-xs text-neutral-500">{decisionInfluences.skills.percentage}% influence</span>
                    </div>
                    <div className="grid grid-cols-5 gap-1 mb-1">
                      {Array.from({ length: 5 }).map((_, i) => {
                        // Determine color based on percentage
                        const percentage = decisionInfluences.skills.percentage;
                        let bgColor = "bg-green-500";
                        
                        if (i === 0) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : 
                                   percentage > 20 ? "bg-green-300" : "bg-green-500";
                        } else if (i === 1) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : 
                                   percentage > 40 ? "bg-yellow-500" : "bg-green-300";
                        } else if (i === 2) {
                          bgColor = percentage > 80 ? "bg-red-500" : 
                                   percentage > 60 ? "bg-orange-500" : "bg-yellow-500";
                        } else if (i === 3) {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-orange-500";
                        } else {
                          bgColor = percentage > 80 ? "bg-red-500" : "bg-green-300";
                        }
                        
                        return (
                          <div key={i} className={`h-3 ${bgColor} rounded`}></div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* All categories displayed above */}
                </div>
                <div className="flex justify-between text-xs text-neutral-500 mt-2">
                  <span>Low Influence</span>
                  <span>High Influence</span>
                </div>
              </div>
            </div>
            
            {/* What-If Simulator */}
            <div>
              <h3 className="font-heading font-semibold mb-4">What-If Simulator</h3>
              <div className="border border-neutral-200 rounded-lg p-4">
                <p className="text-sm text-neutral-500 mb-4">
                  Explore how your team composition would change if you selected different candidates.
                </p>
                
                <div className="flex flex-col md:flex-row md:gap-6">
                  {/* Controls */}
                  <div className="w-full md:w-1/3 mb-6 md:mb-0">
                    <label className="block text-sm font-medium mb-2">
                      Choose a hiring round to simulate:
                    </label>
                    <select 
                      className="w-full p-2 border border-neutral-300 rounded-md mb-4"
                      value={selectedRound}
                      onChange={handleRoundChange}
                    >
                      {/* Show unique candidates only by filtering by ID */}
                      {getUniqueCandidates().map((candidate, index) => {
                        // Get the job position from experience details
                        const jobPosition = candidate.experienceDetails && 
                                          candidate.experienceDetails.length > 0 ? 
                                          candidate.experienceDetails[0].title : 'Professional';
                                          
                        return (
                          <option key={candidate.id} value={index}>
                            {candidate.name} ({jobPosition})
                          </option>
                        );
                      })}
                    </select>
                    
                    <Button 
                      onClick={handleSimulateClick}
                      className="w-full mb-4"
                    >
                      Simulate Alternative
                    </Button>
                    
                    <div className="bg-neutral-100 p-3 rounded-md">
                      <h4 className="text-sm font-medium mb-2">Simulation Impact:</h4>
                      
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Team Diversity:</span>
                          <span className="flex items-center text-sm font-medium">
                            {simulationResults.diversityChange > 0 ? (
                              <>
                                <span className="text-green-600">+{simulationResults.diversityChange}%</span>
                                <span className="text-green-600 ml-1">▲</span>
                              </>
                            ) : simulationResults.diversityChange < 0 ? (
                              <>
                                <span className="text-orange-600">{simulationResults.diversityChange}%</span>
                                <span className="text-orange-600 ml-1">▼</span>
                              </>
                            ) : (
                              <span className="text-neutral-600">No change</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Avg. Experience:</span>
                          <span className="flex items-center text-sm font-medium">
                            {simulationResults.experienceChange > 0 ? (
                              <>
                                <span className="text-green-600">+{simulationResults.experienceChange} years</span>
                                <span className="text-green-600 ml-1">▲</span>
                              </>
                            ) : simulationResults.experienceChange < 0 ? (
                              <>
                                <span className="text-orange-600">{simulationResults.experienceChange} years</span>
                                <span className="text-orange-600 ml-1">▼</span>
                              </>
                            ) : (
                              <span className="text-neutral-600">No change</span>
                            )}
                          </span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                          <span className="text-sm">Innovation Potential:</span>
                          <span className="flex items-center text-sm font-medium">
                            {simulationResults.innovationChange > 0 ? (
                              <>
                                <span className="text-green-600">+{simulationResults.innovationChange}%</span>
                                <span className="text-green-600 ml-1">▲</span>
                              </>
                            ) : simulationResults.innovationChange < 0 ? (
                              <>
                                <span className="text-orange-600">{simulationResults.innovationChange}%</span>
                                <span className="text-orange-600 ml-1">▼</span>
                              </>
                            ) : (
                              <span className="text-neutral-600">No change</span>
                            )}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Alternative Candidate */}
                  <div className="w-full md:w-2/3 border border-neutral-200 rounded-lg">
                    {alternativeCandidate ? (
                      <div className="p-4">
                        <h4 className="font-medium text-md mb-3">Alternative Candidate Profile</h4>
                        
                        <div className="flex flex-col md:flex-row mb-4">
                          <div className="md:w-1/2 mb-4 md:mb-0 md:pr-4">
                            <p className="text-xl font-semibold">{alternativeCandidate.name}</p>
                            <div className="flex items-center mt-1 mb-2">
                              <Badge variant="outline" className="mr-2">
                                {alternativeCandidate.gender}
                              </Badge>
                              <Badge variant="outline">
                                {alternativeCandidate.age} years old
                              </Badge>
                            </div>
                            
                            <p className="text-sm">
                              <span className="font-medium">Education:</span> {alternativeCandidate.education}
                            </p>
                            
                            <p className="text-sm">
                              <span className="font-medium">Experience:</span> {alternativeCandidate.experience} years
                            </p>
                            
                            <p className="text-sm mt-2">
                              <span className="font-medium">Key strength:</span> {alternativeCandidate.keyStrength}
                            </p>
                            
                            <p className="text-sm"><span className="font-medium">Soft skill:</span> {alternativeCandidate.softSkill}</p>
                          </div>
                          
                          <div className="md:w-1/2">
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Key Technical Skills</p>
                              <div className="flex flex-wrap gap-2">
                                {alternativeCandidate.skills.technical.map((skill, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                            
                            <div className="mb-3">
                              <p className="text-sm font-medium mb-1">Current Position</p>
                              <p className="text-sm">
                                {alternativeCandidate.experienceDetails?.[0]?.title} at {alternativeCandidate.experienceDetails?.[0]?.company}
                              </p>
                            </div>
                            
                            <div>
                              <p className="text-sm font-medium mb-1">Interview Quote</p>
                              <p className="text-sm italic">&ldquo;{alternativeCandidate.interviewQuote}&rdquo;</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-48">
                        <p className="text-neutral-500">Loading alternative candidate...</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
          
          {/* Learning Insights Tab */}
          <TabsContent value="learning" className="mt-0">
            <div className="space-y-6">
              {/* Key Learning Points */}
              <div className="border border-neutral-200 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-4">Key Learning Insights</h3>
                
                <div className="space-y-4">
                  <div className="flex">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4 flex-shrink-0">
                      1
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Awareness of Educational Bias</h4>
                      <p className="text-sm text-neutral-600">
                        Your selections show a pattern favoring candidates with degrees from prestigious institutions. 
                        Consider focusing more on relevant skills and experience rather than academic pedigree, which
                        can help increase diversity of thought in your organization.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4 flex-shrink-0">
                      2
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Age Diversity Opportunity</h4>
                      <p className="text-sm text-neutral-600">
                        Your team currently has limited age diversity, with 70% of selections in the 30-39 age range. 
                        Consider how candidates from different age groups might bring valuable perspective and experience
                        to your team.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex">
                    <div className="w-8 h-8 flex items-center justify-center rounded-full bg-primary/10 text-primary mr-4 flex-shrink-0">
                      3
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Communication Style Preference</h4>
                      <p className="text-sm text-neutral-600">
                        You appear to favor candidates with more assertive communication styles. While effective 
                        communication is important, consider how different communication styles can be valuable in
                        different contexts and encourage a more inclusive workplace.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Recommended Reading */}
              <div className="border border-neutral-200 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-4">Recommended Reading</h3>
                
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center flex-shrink-0 mr-4">
                      <BookIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">Blindspot: Hidden Biases of Good People</h4>
                      <p className="text-sm text-neutral-600">
                        Explores how unconscious biases affect even the most well-intentioned people and offers 
                        tools for identifying and addressing these blindspots.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="w-12 h-12 bg-neutral-100 rounded-md flex items-center justify-center flex-shrink-0 mr-4">
                      <BookIcon size={24} className="text-primary" />
                    </div>
                    <div>
                      <h4 className="font-medium mb-1">What Works: Gender Equality by Design</h4>
                      <p className="text-sm text-neutral-600">
                        Provides evidence-based solutions for reducing gender bias in workplace decisions through 
                        behavioral design approaches.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Did You Know Facts */}
              <div className="border border-neutral-200 rounded-lg p-6">
                <h3 className="font-heading font-semibold mb-4">Did You Know?</h3>
                
                <div className="space-y-4">
                  {[
                    {
                      text: "Companies in the top quartile for gender diversity are 25% more likely to have above-average profitability compared to their peers.",
                      relevance: "High"
                    },
                    {
                      text: "Diverse teams are 87% better at making decisions, according to research from People Management.",
                      relevance: "High"
                    },
                    {
                      text: "Candidates with traditionally white-sounding names receive 50% more callbacks than identical resumes with names perceived as belonging to racial minorities.",
                      relevance: "Medium"
                    }
                  ].map((fact: Fact, index) => (
                    <div key={index} className="flex">
                      <div className="w-8 h-8 flex items-center justify-center rounded-full bg-secondary/10 text-secondary mr-4 flex-shrink-0">
                        <LightbulbIcon size={18} />
                      </div>
                      <div>
                        <p className="text-sm text-neutral-600 mb-1">{fact.text}</p>
                        <Badge variant="outline" className="text-xs">Relevance: {fact.relevance}</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 mt-8">
          {isFinal ? (
            <Button onClick={onNewGame} className="bg-primary">
              Start New Game
            </Button>
          ) : (
            <Button onClick={onContinue} className="bg-primary">
              Continue to Next Round
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}

// Icon components for the Learning Insights tab
function BookIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
    </svg>
  );
}

function LightbulbIcon(props: any) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M9 18h6"></path>
      <path d="M10 22h4"></path>
      <path d="M15.09 14c.18-.98.65-1.74 1.41-2.5A4.65 4.65 0 0 0 18 8 6 6 0 0 0 6 8c0 1 .23 2.23 1.5 3.5A4.61 4.61 0 0 1 8.91 14"></path>
    </svg>
  );
}