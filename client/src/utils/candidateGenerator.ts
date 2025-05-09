import { Candidate, ExperienceDetail } from "@/types/game";
import { generateRealisticCandidate } from '@/services/blsService';

// Name datasets
const maleFirstNames = [
  "James", "Michael", "David", "John", "Robert", "William", "Joseph", "Thomas", 
  "Christopher", "Daniel", "Matthew", "Anthony", "Mark", "Carlos", "Juan", 
  "Samuel", "Miguel", "Wei", "Chen", "Ahmed", "Raj", "Kiran", "DeShawn", "Jamal"
];

const femaleFirstNames = [
  "Mary", "Patricia", "Jennifer", "Linda", "Elizabeth", "Barbara", "Susan", 
  "Jessica", "Sarah", "Karen", "Lisa", "Nancy", "Betty", "Margaret", "Maria", 
  "Fatima", "Aisha", "Yuki", "Min", "Lakshmi", "Priya", "Keisha", "LaTonya", "Zara"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
  "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Garcia", "Rodriguez", "Martinez", "Lee", "Wang", "Kim", "Patel", "Singh", 
  "Nguyen", "Gonzalez", "Washington", "Jefferson", "Ali", "Khan"
];

// Education datasets
const educationInstitutions = [
  "State University", "City College", "Tech Institute", "Community College", 
  "Ivy League University", "Public University", "Technical School", "Liberal Arts College",
  "Coding Bootcamp Plus", "Online University", "Metropolitan Institute", "County College"
];

const degrees = [
  "Bachelor of Science in Computer Science", 
  "Bachelor of Engineering", 
  "Master of Computer Science", 
  "Associate's Degree in Computer Science",
  "Bachelor of Science in Information Technology",
  "Master of Information Systems",
  "Bachelor of Science in Software Engineering",
  "Self-taught through online courses"
];

// Company datasets
const companies = [
  "TechCorp Inc.", "Global Solutions", "Digital Creations", "StartupXYZ", 
  "Innovative Systems", "NextGen Technologies", "Enterprise Software", "WebDev Solutions",
  "Mobile Innovations", "Cloud Computing Co.", "AI Research Labs", "Data Systems Inc."
];

const jobTitles = [
  "Frontend Developer", "Backend Developer", "Full Stack Developer", "Software Engineer",
  "DevOps Engineer", "Mobile Developer", "UI/UX Developer", "Systems Architect",
  "Junior Developer", "Senior Developer", "Lead Developer", "CTO"
];

// Technical skills
const technicalSkills = [
  "JavaScript", "Python", "Java", "C#", "Ruby", "PHP", "Swift", "Kotlin",
  "React", "Angular", "Vue.js", "Node.js", "Django", "Ruby on Rails", "ASP.NET",
  "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", "CI/CD", "Git",
  "SQL", "MongoDB", "PostgreSQL", "CSS/SASS", "HTML5", "TypeScript", "GraphQL"
];

// Soft skills with details
const softSkills = [
  { 
    skill: "Excels in emotional intelligence during conflict", 
    detail: "Demonstrates ability to understand team dynamics and navigate challenging situations"
  },
  { 
    skill: "Strong analytical approach to problem-solving", 
    detail: "Takes a methodical approach to breaking down complex issues"
  },
  { 
    skill: "Passionate about continuous learning and knowledge sharing", 
    detail: "Regularly contributes to open source and mentors others"
  },
  { 
    skill: "Excellent communication across technical and non-technical teams", 
    detail: "Able to explain complex concepts in accessible language"
  },
  { 
    skill: "Natural leadership abilities in collaborative environments", 
    detail: "Takes initiative to organize and motivate team members"
  }
];

// Gold stars and red flags
const goldStars = [
  "Top performer at previous company",
  "Open source contributor",
  "Winner of programming competition",
  "Created popular developer tool",
  "Mentor to junior developers"
];

const redFlags = [
  "Gap in employment history",
  "Frequent job changes",
  "Incomplete project history",
  "Limited teamwork experience",
  "No relevant portfolio"
];

// Interview quotes
const interviewQuotes = [
  "I believe my greatest strength is my ability to adapt quickly to new technologies. In my previous role, I learned a completely new framework within two weeks to meet project deadlines.",
  "What I lack in formal education, I make up for with practical experience and a passion for learning. I'm constantly working on side projects and contributing to open source.",
  "I've led several large-scale projects and my technical background allows me to make sound architectural decisions. I took time off in 2016 to care for a family member.",
  "My collaborative approach has helped me succeed in diverse teams. I believe that different perspectives lead to better solutions.",
  "I'm driven by solving complex problems. In my last role, I optimized a critical algorithm that improved performance by 40%."
];

// Follow-up questions and answers
const followupQuestionsAndAnswers = [
  {
    question: "How do you handle disagreements with team members?",
    answer: "I try to understand their perspective first. I've found that most disagreements come from different priorities or incomplete information, so I focus on finding common ground."
  },
  {
    question: "How do you approach mentoring junior team members?",
    answer: "I believe in setting clear expectations and providing regular feedback. I try to balance giving them independence with the right level of guidance."
  },
  {
    question: "How do you stay updated with new technologies?",
    answer: "I dedicate time each week to online courses, follow tech blogs, and participate in coding communities. I also try to implement new technologies in small side projects to get hands-on experience."
  },
  {
    question: "How do you handle tight deadlines?",
    answer: "I prioritize tasks, communicate early about potential issues, and focus on delivering the most critical features first. I've found that transparency about progress helps manage expectations."
  },
  {
    question: "What's your approach to debugging complex issues?",
    answer: "I start by reproducing the issue consistently, then use systematic isolation to identify the root cause. I document the process so that similar issues can be resolved more quickly in the future."
  }
];

// Key strengths
const keyStrengths = [
  "Front-end Development",
  "Back-end Development",
  "System Architecture",
  "Performance Optimization",
  "UI/UX Design",
  "Mobile Development",
  "Database Design",
  "API Development",
  "Cloud Infrastructure",
  "Security Implementation"
];

// Reference names and titles
const referenceNames = [
  "Amanda Lee", "Robert Davis", "Sarah Wong", "Michael Chen", "Jennifer Kim",
  "David Martinez", "Emily Johnson", "Hassan Ali", "Priya Patel", "James Wilson"
];

const referenceTitles = [
  "Engineering Manager", "CTO", "Product Manager", "Technical Lead", "Engineering Director",
  "Project Manager", "Senior Developer", "VP of Engineering", "HR Director", "CEO"
];

const referenceQuotes = [
  "Consistently delivers high-quality work and is a team player.",
  "Detail-oriented and thorough in their work.",
  "Innovative and always finds creative solutions to problems.",
  "Strong technical skills but sometimes struggles with communication.",
  "Delivered excellent results on time and on budget.",
  "Great problem solver who isn't afraid to tackle complex issues.",
  "Outstanding ability to work well under pressure.",
  "Demonstrates exceptional leadership potential.",
  "Highly adaptable and quick to learn new technologies.",
  "Valuable team member with strong collaborative skills."
];

// Helper functions
const getRandomItem = <T>(array: T[]): T => {
  return array[Math.floor(Math.random() * array.length)];
};

const getRandomInt = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const getRandomBoolean = (probability = 0.5): boolean => {
  return Math.random() < probability;
};

const generateExperienceYears = (age: number): number => {
  // Assume people start working at 22 on average
  const maxPossibleExperience = age - 22;
  return getRandomInt(1, Math.max(1, maxPossibleExperience));
};

// Main candidate generator
export const generateCandidates = async (count: number): Promise<Candidate[]> => {
  const candidates: Candidate[] = [];
  const fallbackToLocalGeneration = async () => {
    console.log('Falling back to local candidate generation');
    
    // Use the original generator code as fallback
    for (let i = 0; i < count; i++) {
      // Determine gender (for name selection)
      const gender = getRandomBoolean() ? "male" : "female";
      const firstName = gender === "male" 
        ? getRandomItem(maleFirstNames) 
        : getRandomItem(femaleFirstNames);
      const lastName = getRandomItem(lastNames);
      const name = `${firstName} ${lastName}`;
      
      // Basic attributes
      const age = getRandomInt(24, 45);
      const experience = generateExperienceYears(age);
      
      // Education
      const educationLevel = getRandomBoolean(0.7) ? "college" : "other";
      const education = educationLevel === "college" 
        ? getRandomBoolean(0.3) ? "Master's Degree" : "Bachelor's Degree"
        : "Self-taught / Bootcamp";
      
      // Generate 1-2 education entries
      const educationDetails = [];
      const mainInstitution = getRandomItem(educationInstitutions);
      const mainDegree = getRandomItem(degrees);
      const gradYear = new Date().getFullYear() - getRandomInt(1, experience + 3);
      const startYear = gradYear - getRandomInt(2, 4);
      
      educationDetails.push({
        institution: mainInstitution,
        degree: mainDegree,
        years: `${startYear} - ${gradYear}`
      });
      
      // Add additional education for some candidates
      if (getRandomBoolean(0.4)) {
        const secondInstitution = getRandomItem(educationInstitutions.filter(i => i !== mainInstitution));
        const secondDegree = getRandomItem(degrees.filter(d => d !== mainDegree));
        const secondGradYear = startYear - getRandomInt(1, 3);
        const secondStartYear = secondGradYear - getRandomInt(2, 4);
        
        educationDetails.push({
          institution: secondInstitution,
          degree: secondDegree,
          years: `${secondStartYear} - ${secondGradYear}`
        });
      }
      
      // Generate 1-2 experience entries
      const experienceDetails = [];
      const currentCompany = getRandomItem(companies);
      const currentTitle = getRandomItem(jobTitles);
      const currentStartYear = new Date().getFullYear() - getRandomInt(1, experience);
      
      const accomplishments = [
        "Led redesign of company's main product",
        "Mentored junior developers",
        "Implemented CI/CD pipeline",
        "Reduced load time by 40%",
        "Built e-commerce platform from scratch",
        "Architect for cloud migration project",
        "Led team of developers",
        "Optimized database queries"
      ];
      
      // Randomly select 2-3 accomplishments
      const selectedAccomplishments = [];
      const shuffledAccomplishments = [...accomplishments].sort(() => 0.5 - Math.random());
      const numAccomplishments = getRandomInt(2, 3);
      
      for (let j = 0; j < numAccomplishments; j++) {
        selectedAccomplishments.push(shuffledAccomplishments[j]);
      }
      
      experienceDetails.push({
        title: currentTitle,
        company: currentCompany,
        years: `${currentStartYear} - Present`,
        details: selectedAccomplishments
      });
      
      // Add previous job for more experienced candidates
      if (experience > 3 && getRandomBoolean(0.8)) {
        const previousCompany = getRandomItem(companies.filter(c => c !== currentCompany));
        const previousTitle = getRandomItem(jobTitles);
        const previousEndYear = currentStartYear - 1;
        const previousStartYear = previousEndYear - getRandomInt(1, experience - (new Date().getFullYear() - currentStartYear));
        
        // Create job detail with optional note field
        const jobDetail: ExperienceDetail = {
          title: previousTitle,
          company: previousCompany,
          years: `${previousStartYear} - ${previousEndYear}`
        };
        
        // Add employment gap for some candidates
        if (getRandomBoolean(0.2)) {
          const gapStart = previousEndYear;
          const gapEnd = currentStartYear;
          if (gapEnd - gapStart > 1) {
            jobDetail.note = `${gapEnd - gapStart}-year gap in employment (${gapStart}-${gapEnd})`;
          }
        }
        
        experienceDetails.push(jobDetail);
      }
      
      // Generate skills
      const numTechnicalSkills = getRandomInt(4, 6);
      const shuffledSkills = [...technicalSkills].sort(() => 0.5 - Math.random());
      const technicalSkillSet = shuffledSkills.slice(0, numTechnicalSkills);
      
      const selectedSoftSkill = getRandomItem(softSkills);
      
      // Generate references
      const references = [];
      const numReferences = getRandomInt(1, 2);
      
      for (let j = 0; j < numReferences; j++) {
        const refName = getRandomItem(referenceNames);
        const refTitle = getRandomItem(referenceTitles);
        const refCompany = getRandomItem([currentCompany, ...experienceDetails.map(e => e.company)]);
        const refQuote = getRandomItem(referenceQuotes);
        
        references.push({
          name: refName,
          title: `${refTitle}, ${refCompany}`,
          quote: refQuote
        });
      }
      
      // Randomly assign gold stars or red flags
      let goldStar = "";
      let redFlag = "";
      
      if (getRandomBoolean(0.3)) {
        goldStar = getRandomItem(goldStars);
      } else if (getRandomBoolean(0.3)) {
        redFlag = getRandomItem(redFlags);
      }
      
      // Select interview quote and follow-up
      const interviewQuote = getRandomItem(interviewQuotes);
      const followup = getRandomItem(followupQuestionsAndAnswers);
      
      // Create the candidate
      candidates.push({
        id: i + 1,
        name,
        gender,
        age,
        experience,
        education,
        educationDetails,
        experienceDetails,
        skills: {
          technical: technicalSkillSet,
          soft: selectedSoftSkill.skill
        },
        softSkill: selectedSoftSkill.skill,
        softSkillDetail: selectedSoftSkill.detail,
        references,
        interviewQuote,
        followupQuestion: followup.question,
        followupAnswer: followup.answer,
        goldStar,
        redFlag,
        keyStrength: getRandomItem(keyStrengths)
      });
    }
    
    return candidates;
  };
  
  try {
    // Use BLS API to generate realistic candidates
    const occupationCodes = ['15-1252', '13-1071', '11-2021', '13-2011'];
    
    for (let i = 0; i < count; i++) {
      // Select a random occupation code
      const occupationCode = occupationCodes[Math.floor(Math.random() * occupationCodes.length)];
      
      // Generate a realistic candidate using BLS data
      const candidate = await generateRealisticCandidate(occupationCode);
      
      if (candidate) {
        // Set a proper ID
        candidate.id = i + 1;
        candidates.push(candidate);
      } else {
        // If candidate generation failed, fall back to random generation for this candidate
        console.warn(`Failed to generate realistic candidate ${i+1}, falling back to random generation`);
        const randomCandidates = await fallbackToLocalGeneration();
        candidates.push(randomCandidates[0]);
      }
    }
    
    return candidates;
  } catch (error) {
    console.error('Error in generateCandidates:', error);
    return fallbackToLocalGeneration();
  }
};
