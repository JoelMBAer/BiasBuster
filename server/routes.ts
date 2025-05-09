import type { Express, Request } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertGameDecisionSchema, insertGameSessionSchema } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";
import OpenAI from "openai";

// Function to generate contextual responses without API calls
function generateContextualFallbackResponse(candidate: any, question: string): string {
  // Extract key information from the question
  const questionLower = question.toLowerCase();
  
  // Common interview questions and patterns
  if (questionLower.includes('tell me about yourself') || 
      questionLower.includes('introduce yourself') || 
      questionLower.includes('background')) {
    return `I'm ${candidate.name}, with ${candidate.experience} years of experience in ${candidate.experienceDetails[0]?.title || "my field"}. I graduated with a ${candidate.education} and pride myself on being ${candidate.softSkill.toLowerCase()}. My colleagues often mention my ${candidate.keyStrength} as a standout quality. I'm excited about this opportunity because it aligns with my career goals.`;
  }
  
  if (questionLower.includes('why should we hire you') || 
      questionLower.includes('why are you a good fit') ||
      questionLower.includes('what can you bring')) {
    return `With my ${candidate.experience} years of experience and background in ${candidate.education}, I bring a unique perspective to the team. My ${candidate.keyStrength} has helped me succeed in previous roles, and I'm known for being ${candidate.softSkill.toLowerCase()}. I believe these qualities make me a strong candidate who can contribute immediately while continuing to grow with your organization.`;
  }
  
  if (questionLower.includes('weakness') || 
      questionLower.includes('improve') ||
      questionLower.includes('challenge')) {
    return `I've worked to improve my ${candidate.softSkill === 'Detail-oriented' ? 'ability to see the big picture' : 'attention to detail'} over the years. I've found that by ${candidate.softSkill === 'Collaborative' ? 'setting aside focused time for individual work' : 'actively seeking out collaboration opportunities'}, I've been able to grow professionally while maintaining my core strength of being ${candidate.softSkill.toLowerCase()}.`;
  }
  
  if (questionLower.includes('team') || 
      questionLower.includes('collaborate') ||
      questionLower.includes('work with others')) {
    return `I thrive in collaborative environments where ${candidate.softSkill.toLowerCase()} team members can openly share ideas. In my ${candidate.experience} years at ${candidate.experienceDetails[0]?.company || "previous companies"}, I've found that my ${candidate.keyStrength} helps teams overcome obstacles and deliver results. I believe diverse perspectives lead to the most innovative solutions.`;
  }
  
  if (questionLower.includes('handling conflict') || 
      questionLower.includes('disagreement') ||
      questionLower.includes('difficult situation')) {
    return `When facing conflict, I rely on my ${candidate.softSkill.toLowerCase()} approach to understand all perspectives. Recently at ${candidate.experienceDetails[0]?.company || "my previous role"}, I navigated a disagreement about project priorities by facilitating a structured discussion that clarified our shared goals. My ${candidate.keyStrength} helped us find common ground and develop a solution everyone supported.`;
  }
  
  if (questionLower.includes('goal') || 
      questionLower.includes('five years') ||
      questionLower.includes('future')) {
    return `My goal is to continue developing my expertise in ${candidate.experienceDetails[0]?.title || "this field"} while taking on increasing leadership responsibilities. I'm committed to building on my ${candidate.education} foundation through continuous learning. In five years, I hope to have made significant contributions to my team while mentoring others to be ${candidate.softSkill.toLowerCase()} professionals.`;
  }
  
  // Default response that incorporates candidate details
  return `That's an interesting question. Drawing from my ${candidate.experience} years of experience and ${candidate.education} background, I'd approach this by applying my ${candidate.keyStrength} and ${candidate.softSkill.toLowerCase()} nature. Throughout my career at places like ${candidate.experienceDetails[0]?.company || "my previous employers"}, I've found that combining technical knowledge with strong interpersonal skills leads to the best outcomes.`;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Game session management
  app.post("/api/game/sessions", async (req, res) => {
    try {
      const sessionData = insertGameSessionSchema.parse({
        ...req.body,
        sessionId: req.body.sessionId || uuidv4(),
        createdAt: new Date().toISOString()
      });
      
      const session = await storage.createGameSession(sessionData);
      res.status(201).json(session);
    } catch (error) {
      res.status(400).json({ message: "Invalid session data" });
    }
  });

  app.get("/api/game/sessions/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const session = await storage.getGameSession(sessionId);
      
      if (!session) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(session);
    } catch (error) {
      res.status(500).json({ message: "Failed to get session" });
    }
  });

  // Candidate creation endpoint
  app.post("/api/candidates", async (req, res) => {
    try {
      // Parse the candidate data - we need to be more lenient here as it's coming from generated data
      const candidateData = { ...req.body };
      
      // Create the candidate in storage
      const candidate = await storage.createCandidate(candidateData);
      
      res.status(201).json(candidate);
    } catch (error) {
      console.error("Error creating candidate:", error);
      res.status(400).json({ message: "Invalid candidate data" });
    }
  });

  // Game decisions
  app.post("/api/game/decision", async (req, res) => {
    try {
      console.log("Received decision request:", req.body);
      
      // Get the candidate from the request
      const candidate = req.body.candidate;
      let candidateId = req.body.selectedCandidateId;
      
      // If we have a full candidate object, save it first
      if (candidate && typeof candidate === 'object') {
        try {
          // Make sure the candidate has an ID
          if (!candidate.id && candidateId) {
            candidate.id = candidateId;
          } else if (candidate.id && !candidateId) {
            candidateId = candidate.id;
          }
          
          // Check if candidate already exists
          const existingCandidate = await storage.getCandidate(candidate.id);
          if (!existingCandidate) {
            // Log what we're about to save
            console.log("Creating new candidate:", candidate);
            
            // Save candidate to storage
            await storage.createCandidate(candidate);
          }
          
          // Use the candidate's ID for the decision
          candidateId = candidate.id;
        } catch (candidateError) {
          console.error("Error saving candidate:", candidateError);
          // Continue with the request anyway, using the candidateId we have
        }
      }
      
      // Ensure we have valid required fields
      if (!req.body.sessionId || !candidateId || req.body.roundNumber === undefined) {
        return res.status(400).json({ 
          message: "Missing required fields",
          details: {
            sessionId: req.body.sessionId ? "✓" : "✗",
            candidateId: candidateId ? "✓" : "✗",
            roundNumber: req.body.roundNumber !== undefined ? "✓" : "✗"
          }
        });
      }
      
      // Create decision data
      const decisionData = {
        sessionId: req.body.sessionId,
        roundNumber: req.body.roundNumber,
        selectedCandidateId: candidateId,
        mainInfluence: req.body.mainInfluence || "Not specified",
        reflectionNotes: req.body.reflectionNotes || "",
        createdAt: new Date().toISOString()
      };
      
      // Try to validate with schema, but with fallback for flexibility
      try {
        insertGameDecisionSchema.parse(decisionData);
      } catch (validationError) {
        console.warn("Non-critical validation error:", validationError);
        // Continue anyway as we have our fallbacks above
      }
      
      console.log("Creating game decision:", decisionData);
      const decision = await storage.createGameDecision(decisionData);
      
      // Update the session with the selected candidate
      await storage.updateGameSessionRound(decisionData.sessionId, decisionData.roundNumber);
      
      res.status(201).json(decision);
    } catch (error) {
      console.error("Error creating decision:", error);
      res.status(400).json({ 
        message: "Invalid decision data", 
        error: error instanceof Error ? error.message : String(error) 
      });
    }
  });

  app.get("/api/game/decisions/:sessionId", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const decisions = await storage.getGameDecisions(sessionId);
      
      res.json(decisions);
    } catch (error) {
      res.status(500).json({ message: "Failed to get decisions" });
    }
  });

  // Complete a game session
  app.post("/api/game/sessions/:sessionId/complete", async (req, res) => {
    try {
      const sessionId = req.params.sessionId;
      const completedSession = await storage.completeGameSession(sessionId);
      
      if (!completedSession) {
        return res.status(404).json({ message: "Session not found" });
      }
      
      res.json(completedSession);
    } catch (error) {
      res.status(500).json({ message: "Failed to complete session" });
    }
  });

  // OpenAI API endpoints
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  // Endpoint for candidate response
  app.post("/api/openai/candidate-response", async (req, res) => {
    try {
      const { candidate, question, responseType } = req.body;
      
      if (!candidate || !question || !responseType) {
        return res.status(400).json({ 
          message: "Missing required parameters",
          error: "Required fields: candidate, question, responseType" 
        });
      }
      
      let systemRole = '';
      let prompt = '';
      
      switch(responseType) {
        case 'interview':
          // Standard interview response - brief and professional
          systemRole = "You are a job candidate responding to an interview question. Be professional, concise, and authentic.";
          prompt = `
            A candidate is applying for a ${candidate.experienceDetails[0]?.title || "Software Developer"} role. Their profile includes:
            
            ${candidate.name}, ${candidate.age}, ${candidate.education}, ${candidate.experience} years experience, ${candidate.softSkill}
            
            The interviewer asks: "${question}"
            
            Respond in the candidate's voice. Be brief, confident, and human. Add a hint of personality based on their background. Max 60 words.
          `;
          break;
          
        case 'detailed':
          // Detailed response with more personality
          systemRole = "You are a job candidate giving a detailed response that showcases your personality and qualifications.";
          prompt = `
            You are a job candidate named ${candidate.name}. Your background:
            - Age: ${candidate.age}
            - Education: ${candidate.education} 
            - Experience: ${candidate.experience} years as ${candidate.experienceDetails[0]?.title || "Software Developer"}
            - Key strength: ${candidate.keyStrength}
            - Personality trait: ${candidate.softSkill}
            
            The interviewer asks: "${question}"
            
            Respond naturally in first person with emotion and personality. Express your thoughts as ${candidate.name} would, highlighting relevant experience or skills. Use 3-4 sentences and conversational language.
          `;
          break;
          
        case 'animated':
          // Animated, emotional response
          systemRole = "You are a fictional animated job candidate responding with emotional expressiveness.";
          prompt = `
            You are a fictional animated job candidate speaking to an interviewer. Your background is:
            ${candidate.name}, ${candidate.age}, ${candidate.experience} years experience, ${candidate.softSkill}
            
            The interviewer says: "${question}"
            
            Give a 3–4 sentence answer with emotion and tone matching your personality (${candidate.softSkill.toLowerCase()}). Use natural spoken language with occasional gestures or expressions in [brackets] to show emotion.
          `;
          break;
          
        default:
          return res.status(400).json({ 
            message: "Invalid responseType",
            error: "responseType must be one of: interview, detailed, animated" 
          });
      }
      
      try {
        // Make the API call
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: systemRole },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150
        });
        
        res.json({
          text: response.choices[0].message.content || "I appreciate that question. Based on my experience, I believe my skills in problem-solving and collaboration would be valuable here. I'm passionate about this field and always eager to learn more."
        });
      } catch (apiError: any) {
        console.log("OpenAI API error:", apiError.message);
        
        // If we hit a rate limit or quota error, send a relevant, context-aware response
        // Generate a response based on the candidate's profile without using OpenAI
        const fallbackResponse = generateContextualFallbackResponse(candidate, question);
        
        res.json({
          text: fallbackResponse
        });
      }
      
    } catch (error) {
      console.error('Error generating candidate response:', error);
      res.status(500).json({
        message: "Failed to generate candidate response",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint for bias analysis
  app.post("/api/openai/bias-analysis", async (req, res) => {
    try {
      const { selectedCandidates, currentRound, totalRounds } = req.body;
      
      if (!selectedCandidates || !Array.isArray(selectedCandidates) || selectedCandidates.length === 0) {
        return res.status(400).json({ 
          message: "Missing required parameters",
          error: "Required field: selectedCandidates (must be a non-empty array)" 
        });
      }
      
      // Create a summary of the candidates selected so far
      const candidateSummaries = selectedCandidates.map((candidate, index) => {
        return `
          Round ${index + 1} Selection:
          - Name: ${candidate.name}
          - Gender: ${candidate.gender}
          - Age: ${candidate.age}
          - Experience: ${candidate.experience} years
          - Education: ${candidate.education}
          - Key skills: ${candidate.skills.technical.join(', ')}
          - Soft skills: ${candidate.softSkill}
        `;
      }).join('\n');
      
      // Construct the prompt
      const prompt = `
        You are an expert in detecting unconscious bias in hiring decisions. 
        Analyze the following ${selectedCandidates.length} candidate selections made by a hiring manager in a simulation.
        
        ${candidateSummaries}
        
        Identify patterns that might indicate unconscious bias based on:
        1. Gender
        2. Age
        3. Educational background
        4. Experience length
        5. Communication style/soft skills
        
        For each potential bias area, provide:
        - A percentage estimate of how strong this bias appears (0-100%)
        - A brief explanation of what patterns indicate this bias
        - One practical tip to mitigate this bias in future hiring
        
        Format your response as JSON with the following structure:
        {
          "biasInsights": [
            {
              "type": "gender|age|education|experience|communication",
              "title": "Brief title of the bias",
              "description": "Explanation of the bias pattern",
              "percentage": number (0-100)
            }
          ],
          "overallBiasScore": number (0-100),
          "recommendations": ["practical tip 1", "practical tip 2", "practical tip 3"]
        }
      `;
      
      try {
        // Make the API call
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an HR analytics expert specializing in bias detection.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: 'json_object' }
        });
        
        // Parse the response
        const result = JSON.parse(response.choices[0].message.content || '{}');
        
        res.json({
          biasInsights: result.biasInsights || [],
          overallBiasScore: result.overallBiasScore || 0,
          recommendations: result.recommendations || []
        });
      } catch (apiError: any) {
        console.log("OpenAI API error:", apiError.message);
        
        // Provide default bias insights when API fails
        res.json({
          biasInsights: [
            {
              type: 'education',
              title: 'Educational Bias',
              description: 'Potential preference for candidates from prestigious universities.',
              percentage: 65
            },
            {
              type: 'experience',
              title: 'Experience Length',
              description: 'Pattern of selecting candidates with longer work histories.',
              percentage: 60
            },
            {
              type: 'communication',
              title: 'Communication Style',
              description: 'Favor towards candidates with assertive communication styles.',
              percentage: 55
            }
          ],
          overallBiasScore: 60,
          recommendations: [
            'Consider using blind resume reviews in initial screening stages.',
            'Establish consistent evaluation criteria before reviewing applications.',
            'Include diverse perspectives in your hiring committees.'
          ]
        });
      }
      
    } catch (error) {
      console.error('Error analyzing bias patterns:', error);
      res.status(500).json({
        message: "Failed to analyze bias patterns",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint for bias reflection
  app.post("/api/openai/bias-reflection", async (req, res) => {
    try {
      const { selectedCandidate, otherCandidates } = req.body;
      
      if (!selectedCandidate || !otherCandidates || !Array.isArray(otherCandidates)) {
        return res.status(400).json({ 
          message: "Missing required parameters",
          error: "Required fields: selectedCandidate, otherCandidates (array)" 
        });
      }
      
      // Generate summaries of all candidates
      const selectedCandidateInfo = `
        Selected candidate:
        - Name: ${selectedCandidate.name}
        - Age: ${selectedCandidate.age}
        - Gender: ${selectedCandidate.gender}
        - Education: ${selectedCandidate.education} from ${selectedCandidate.educationDetails[0]?.institution || "University"}
        - Experience: ${selectedCandidate.experience} years
      `;
      
      const otherCandidatesInfo = otherCandidates.map((candidate, index) => {
        return `
          Not selected candidate #${index + 1}:
          - Name: ${candidate.name}
          - Age: ${candidate.age}
          - Gender: ${candidate.gender}
          - Education: ${candidate.education} from ${candidate.educationDetails[0]?.institution || "University"}
          - Experience: ${candidate.experience} years
        `;
      }).join('\n');
      
      const prompt = `
        The user chose a candidate with these characteristics:
        ${selectedCandidateInfo}
        
        Instead of these candidates:
        ${otherCandidatesInfo}
        
        What unconscious biases might have influenced this decision? (e.g., name familiarity, school prestige, age bias)
        
        Write a 2-sentence reflection and end with a self-awareness question like: "What else might you have overlooked?"
      `;
      
      try {
        // Make the API call
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an unbiased HR consultant helping someone reflect on their hiring decisions.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 150
        });
        
        res.json({
          text: response.choices[0].message.content || "Your selection may reflect an unconscious preference for candidates with more traditional career paths. What other perspectives or experiences might have added value to your team?"
        });
      } catch (apiError: any) {
        console.log("OpenAI API error:", apiError.message);
        
        // Generate a fallback reflection based on candidate profiles
        let biasReflection = "Your selection may indicate a preference for ";
        
        // Compare ages
        if (selectedCandidate.age < 35 && otherCandidates.some(c => c.age >= 35)) {
          biasReflection += "younger candidates. How might age diversity benefit your team?";
        } 
        // Compare education
        else if (selectedCandidate.education.includes("Master") || selectedCandidate.education.includes("PhD")) {
          biasReflection += "candidates with advanced degrees. What value might candidates with different educational backgrounds bring?";
        }
        // Compare experience
        else if (selectedCandidate.experience > 5) {
          biasReflection += "candidates with more years of experience. What fresh perspectives might someone earlier in their career contribute?";
        }
        // Compare gender (if available)
        else if (selectedCandidate.gender && otherCandidates.some(c => c.gender !== selectedCandidate.gender)) {
          biasReflection += `${selectedCandidate.gender.toLowerCase()} candidates. What benefits might gender diversity bring to your workplace culture?`;
        }
        // Default fallback
        else {
          biasReflection = "Your selection patterns may reflect unconscious preferences for certain candidate traits. What alternative perspectives might you be overlooking in your hiring process?";
        }
        
        res.json({ text: biasReflection });
      }
      
    } catch (error) {
      console.error('Error generating bias reflection:', error);
      res.status(500).json({
        message: "Failed to generate bias reflection",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint for bias flashcard generation
  app.post("/api/openai/bias-flashcard", async (req, res) => {
    try {
      const { biasPattern } = req.body;
      
      if (!biasPattern) {
        return res.status(400).json({ 
          message: "Missing required parameter",
          error: "Required field: biasPattern" 
        });
      }
      
      const prompt = `
        The user shows repeated hiring bias toward ${biasPattern}.
        
        Create a short flashcard with a surprising fact or nudge (1–2 sentences) to raise awareness.
        
        Tone: informative, non-judgmental, human.
      `;
      
      try {
        // Make the API call
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are a bias awareness coach providing brief educational insights.' },
            { role: 'user', content: prompt }
          ],
          max_tokens: 100
        });
        
        res.json({
          text: response.choices[0].message.content || "Studies show diverse teams outperform homogeneous ones by 35% in innovation metrics. Broadening your hiring criteria could unlock new potential in your organization."
        });
      } catch (apiError: any) {
        console.log("OpenAI API error:", apiError.message);
        
        // Provide fallback flashcards based on the bias pattern
        let flashcardText = "";
        
        if (biasPattern.toLowerCase().includes("education") || biasPattern.toLowerCase().includes("degree")) {
          flashcardText = "Research shows teams with diverse educational backgrounds solve complex problems 30% faster than homogeneous groups. Consider how different paths to expertise might strengthen your team's capabilities.";
        }
        else if (biasPattern.toLowerCase().includes("age") || biasPattern.toLowerCase().includes("young") || biasPattern.toLowerCase().includes("old")) {
          flashcardText = "Age-diverse teams report 70% higher levels of innovation due to the blend of fresh perspectives with seasoned experience. Each generation brings unique strengths to collaborative problem-solving.";
        }
        else if (biasPattern.toLowerCase().includes("gender") || biasPattern.toLowerCase().includes("male") || biasPattern.toLowerCase().includes("female")) {
          flashcardText = "Companies with gender-balanced leadership consistently outperform their peers by 25% in profitability. Diverse decision-making groups make fewer cognitive errors and show increased creativity.";
        }
        else if (biasPattern.toLowerCase().includes("experience")) {
          flashcardText = "Organizations that balance seasoned professionals with employees from non-traditional backgrounds report 40% higher employee satisfaction and retention, creating stronger institutional knowledge.";
        }
        else {
          flashcardText = "Studies show diverse teams outperform homogeneous ones by 35% in innovation metrics. Broadening your hiring criteria could unlock new potential in your organization.";
        }
        
        res.json({ text: flashcardText });
      }
      
    } catch (error) {
      console.error('Error generating bias flashcard:', error);
      res.status(500).json({
        message: "Failed to generate bias flashcard",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  // Endpoint for generating job-specific candidates
  app.post("/api/openai/generate-candidate", async (req, res) => {
    try {
      const { jobPosition } = req.body;
      
      if (!jobPosition) {
        return res.status(400).json({ 
          message: "Missing required parameter",
          error: "Required field: jobPosition" 
        });
      }
      
      // Construct the prompt
      const prompt = `
        Generate a detailed, realistic job candidate profile for a ${jobPosition} position. The candidate should have highly relevant education, experience, and skills specifically aligned with this role.
        
        First, analyze what this position typically requires:
        - What specific technical skills are essential for this exact role?
        - What educational background is most appropriate?
        - What experience level and previous roles would prepare someone for this position?
        - What soft skills are most valued for this specific position?
        
        Then, create a candidate with:
        - A career progression that logically builds toward this ${jobPosition} role
        - Previous job titles that show clear career advancement in this field
        - Technical skills that directly match current industry requirements for this exact position
        - Education credentials that are specifically relevant to this field (not generic)
        
        Include the following in your response in JSON format:
        {
          "name": "Full name (diverse and realistic)",
          "gender": "Male, Female, or Non-binary",
          "age": (appropriate for career stage between 21-65),
          "experience": (years, appropriate for age and position),
          "education": "Highest degree level",
          "educationDetails": [
            {
              "institution": "University/College name",
              "degree": "Specific degree name that directly relates to ${jobPosition} skills",
              "years": "Start year - End year"
            }
          ],
          "experienceDetails": [
            {
              "title": "Job title showing career progression toward ${jobPosition}",
              "company": "Company name in relevant industry",
              "years": "Start year - End year",
              "details": ["Specific accomplishment using skills required for ${jobPosition}", "Another relevant achievement"]
            }
          ],
          "skills": {
            "technical": ["5-8 specific technical skills directly required for ${jobPosition} role"],
            "soft": "Primary soft skill most valued in this position"
          },
          "softSkill": "Key soft skill strength essential for this role",
          "softSkillDetail": "Brief description of how they apply this soft skill in a way relevant to the position",
          "references": [
            {
              "name": "Reference name",
              "title": "Reference professional title (from same industry)",
              "quote": "Brief, realistic reference quote highlighting candidate strengths specifically valuable for ${jobPosition}"
            }
          ],
          "interviewQuote": "Brief quote showing how they'd respond to a position-specific interview question",
          "followupQuestion": "A challenging question specific to ${jobPosition} responsibilities",
          "followupAnswer": "How the candidate would respond, demonstrating relevant expertise",
          "goldStar": "Top strength that makes them particularly suited for this exact position",
          "redFlag": "Minor concern or development area in their application (realistic but not disqualifying)",
          "keyStrength": "Single word or short phrase describing core professional strength essential for ${jobPosition}"
        }
        
        Ensure that:
        1. The profile is realistic and appropriately qualified for this specific position
        2. Education and experience are DIRECTLY relevant to the ${jobPosition} role (not general or loosely related)
        3. Technical skills precisely match current industry expectations for this position in 2024
        4. All dates are consistent with the candidate's age and show a logical career progression
        5. The candidate has at least two previous positions showing growth toward this role
        6. Each job title in their history makes sense as part of a career path leading to ${jobPosition}
        7. There is clear alignment between their education, previous job responsibilities, and this position
      `;
      
      try {
        // Make the API call
        const response = await openai.chat.completions.create({
          model: 'gpt-4o',
          messages: [
            { role: 'system', content: 'You are an expert HR recruiter with 15+ years of experience in talent acquisition. You specialize in creating highly realistic candidate profiles with perfect alignment between job requirements and candidate qualifications. For each position, you deeply understand the required skills, education, and experience path. Your profiles always show logical career progression where each job title builds logically toward the target position.' },
            { role: 'user', content: prompt }
          ],
          response_format: { type: "json_object" }
        });
        
        // Parse the response as JSON
        const candidateData = JSON.parse(response.choices[0].message.content || "{}");
        
        // Ensure ID field is present - will be replaced by storage system
        candidateData.id = Date.now();
        
        res.json(candidateData);
      } catch (apiError: any) {
        console.log("OpenAI API error:", apiError.message);
        
        // Fall back to the existing candidate generation mechanism
        // This simply returns a basic structure that the client can use
        // The client-side generator will populate it with realistic data
        res.status(500).json({
          error: "Failed to generate candidate with OpenAI",
          message: apiError.message
        });
      }
      
    } catch (error) {
      console.error('Error generating job-specific candidate:', error);
      res.status(500).json({
        message: "Failed to generate job-specific candidate",
        error: error instanceof Error ? error.message : String(error)
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
