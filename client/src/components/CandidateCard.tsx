import { useState, FormEvent } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Button } from "@/components/ui/button";
import { Flag, Star, PlusCircle, MinusCircle, Send } from "lucide-react";
import { Candidate } from "@/types/game";
import { generateCandidateResponse } from "@/services/openaiService";

interface CandidateCardProps {
  candidate: Candidate;
  onSelect: () => void;
}

const CandidateCard = ({ candidate, onSelect }: CandidateCardProps) => {
  const [showFollowup, setShowFollowup] = useState(false);
  const [customQuestion, setCustomQuestion] = useState('');
  const [customAnswer, setCustomAnswer] = useState('');
  const [isAskingQuestion, setIsAskingQuestion] = useState(false);
  const [loading, setLoading] = useState(false);

  // Function to handle asking a personalized question to the candidate
  const handleAskQuestion = async (e: FormEvent) => {
    e.preventDefault();
    
    if (!customQuestion.trim()) return;
    
    setLoading(true);
    
    try {
      // Call the OpenAI service to generate a personalized response
      const response = await generateCandidateResponse({
        candidate,
        question: customQuestion,
        responseType: 'animated' // Use the animated style for more personality
      });
      
      setCustomAnswer(response.text);
      setLoading(false);
    } catch (error) {
      console.error('Error getting candidate response:', error);
      setCustomAnswer("I appreciate your question. Based on my experience, I believe I could bring valuable perspectives to your team. I'm passionate about continuous learning and would love to contribute to your organization's success.");
      setLoading(false);
    }
  };
  
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      {/* Candidate Header */}
      <div className="bg-primary text-white p-4">
        <div className="flex justify-between items-start">
          <div>
            <h3 className="font-heading font-bold text-lg">{candidate.name}</h3>
            <p className="text-sm opacity-90">{candidate.age} years • {candidate.experience} years experience</p>
          </div>
          {candidate.goldStar && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{candidate.goldStar}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
          {candidate.redFlag && (
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger>
                  <Flag className="h-5 w-5 text-destructive" />
                </TooltipTrigger>
                <TooltipContent>
                  <p>{candidate.redFlag}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          )}
        </div>
      </div>
      
      {/* Candidate Tabs */}
      <Tabs defaultValue="education" className="w-full">
        <TabsList className="bg-neutral-100 w-full justify-start rounded-none border-b">
          <TabsTrigger value="education" className="text-sm">Education</TabsTrigger>
          <TabsTrigger value="experience" className="text-sm">Experience</TabsTrigger>
          <TabsTrigger value="skills" className="text-sm">Skills</TabsTrigger>
          <TabsTrigger value="references" className="text-sm">References</TabsTrigger>
        </TabsList>
        
        <div className="p-4">
          {/* Education Tab */}
          <TabsContent value="education" className="mt-0 pt-0">
            {candidate.educationDetails.map((edu, index) => (
              <div key={index} className={index < candidate.educationDetails.length - 1 ? "mb-3" : ""}>
                <h4 className="font-semibold">{edu.institution}</h4>
                <p className="text-sm text-neutral-400">{edu.degree}</p>
                <p className="text-sm text-neutral-400">{edu.years}</p>
              </div>
            ))}
          </TabsContent>
          
          {/* Experience Tab */}
          <TabsContent value="experience" className="mt-0 pt-0">
            {candidate.experienceDetails.map((exp, index) => (
              <div key={index} className={index < candidate.experienceDetails.length - 1 ? "mb-3" : ""}>
                <h4 className="font-semibold">{exp.title}</h4>
                <p className="text-sm text-neutral-400">{exp.company}</p>
                <p className="text-sm text-neutral-400">{exp.years}</p>
                {exp.details && (
                  <ul className="list-disc ml-5 mt-1 text-sm text-neutral-400">
                    {exp.details.map((detail, i) => (
                      <li key={i}>{detail}</li>
                    ))}
                  </ul>
                )}
                {exp.note && (
                  <p className="text-sm text-neutral-400 italic mt-1 text-warning">{exp.note}</p>
                )}
              </div>
            ))}
          </TabsContent>
          
          {/* Skills Tab */}
          <TabsContent value="skills" className="mt-0 pt-0">
            <div className="mb-3">
              <h4 className="font-semibold">Technical Skills</h4>
              <div className="flex flex-wrap gap-2 mt-2">
                {candidate.skills.technical.map((skill, index) => (
                  <span key={index} className="bg-neutral-100 text-neutral-500 px-2 py-1 rounded text-xs">
                    {skill}
                  </span>
                ))}
              </div>
            </div>
            <div>
              <h4 className="font-semibold">Soft Skills</h4>
              <p className="text-sm text-neutral-400 mt-1">
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <span className="italic">"{candidate.softSkill}"</span>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>{candidate.softSkillDetail}</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </p>
            </div>
          </TabsContent>
          
          {/* References Tab */}
          <TabsContent value="references" className="mt-0 pt-0">
            {candidate.references.map((ref, index) => (
              <div key={index} className={index < candidate.references.length - 1 ? "mb-3" : ""}>
                <h4 className="font-semibold">{ref.name}</h4>
                <p className="text-sm text-neutral-400">{ref.title}</p>
                <p className="text-sm italic mt-1">"{ref.quote}"</p>
              </div>
            ))}
          </TabsContent>
        </div>
        
        {/* Interview Section */}
        <div className="border-t p-4">
          <h4 className="font-semibold mb-2">Interview Highlights</h4>
          <p className="text-sm text-neutral-500 italic mb-3">"{candidate.interviewQuote}"</p>
          
          {/* Follow-up Question */}
          <div>
            <button 
              className="text-primary text-sm font-semibold flex items-center gap-1"
              onClick={() => {
                setShowFollowup(!showFollowup);
                setIsAskingQuestion(false);
                setCustomQuestion('');
                setCustomAnswer('');
              }}
            >
              {showFollowup ? (
                <>
                  <MinusCircle className="h-4 w-4" /> Hide interview section
                </>
              ) : (
                <>
                  <PlusCircle className="h-4 w-4" /> Ask interview questions
                </>
              )}
            </button>
            
            {showFollowup && (
              <div className="mt-3 bg-neutral-50 p-3 rounded">
                {/* Standard follow-up question */}
                {!isAskingQuestion && (
                  <>
                    <p className="text-sm font-semibold mb-2">{candidate.followupQuestion}</p>
                    <p className="text-sm text-neutral-500 italic mb-3">"{candidate.followupAnswer}"</p>
                    
                    <div className="flex justify-end">
                      <button 
                        className="text-primary text-xs font-semibold flex items-center gap-1"
                        onClick={() => setIsAskingQuestion(true)}
                      >
                        <PlusCircle className="h-3 w-3" /> Ask your own question
                      </button>
                    </div>
                  </>
                )}
                
                {/* Custom interview question form */}
                {isAskingQuestion && (
                  <div>
                    <h5 className="text-sm font-semibold mb-3">Ask {candidate.name} a personalized question:</h5>
                    
                    <form onSubmit={handleAskQuestion} className="space-y-3">
                      <div>
                        <input
                          type="text"
                          value={customQuestion}
                          onChange={(e) => setCustomQuestion(e.target.value)}
                          placeholder="e.g., How do you handle tight deadlines?"
                          className="w-full p-2 text-sm border border-neutral-200 rounded focus:outline-none focus:ring-1 focus:ring-primary"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          type="submit"
                          size="sm"
                          variant="default"
                          className="text-xs gap-1"
                          disabled={loading || !customQuestion.trim()}
                        >
                          {loading ? (
                            <>
                              <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Send className="h-3 w-3" /> Ask Question
                            </>
                          )}
                        </Button>
                      </div>
                      
                      {/* Display the custom answer */}
                      {customAnswer && (
                        <div className="mt-3 pt-3 border-t border-neutral-200">
                          <p className="text-sm font-semibold mb-1">Response:</p>
                          <p className="text-sm text-neutral-500 italic">"{customAnswer}"</p>
                        </div>
                      )}
                    </form>
                    
                    <div className="flex justify-end mt-3">
                      <button 
                        className="text-neutral-400 text-xs flex items-center gap-1"
                        onClick={() => {
                          setIsAskingQuestion(false);
                          setCustomQuestion('');
                          setCustomAnswer('');
                        }}
                      >
                        <MinusCircle className="h-3 w-3" /> Return to standard question
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        
        {/* Select Button */}
        <div className="bg-neutral-100 p-4">
          <Button 
            variant="default" 
            className="w-full" 
            onClick={onSelect}
          >
            Select Candidate
          </Button>
        </div>
      </Tabs>
    </div>
  );
};

export default CandidateCard;
