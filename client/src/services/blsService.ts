import axios from 'axios';
import { EducationDetail, ExperienceDetail, Candidate } from '@/types/game';

const BLS_API_KEY = import.meta.env.BLS_API_KEY || '';
const BLS_API_URL = 'https://api.bls.gov/publicAPI/v2/timeseries/data/';

interface BlsRequestParams {
  seriesid: string[];
  startyear: string;
  endyear: string;
  registrationKey?: string;
}

interface BlsResponse {
  status: string;
  responseTime: number;
  message: string[];
  Results: {
    series: Array<{
      seriesID: string;
      data: Array<{
        year: string;
        period: string;
        periodName: string;
        value: string;
        footnotes: Array<{ code: string; text: string }>;
      }>;
    }>;
  };
}

interface OccupationData {
  title: string;
  medianSalary: number;
  medianAge: number;
  educationRequirements: string[];
  yearsExperience: number;
  technicalSkills: string[];
  softSkills: string[];
}

/**
 * Fetches occupation data from Bureau of Labor Statistics
 */
export async function getOccupationData(occupationCode: string): Promise<OccupationData | null> {
  try {
    // Mapping of occupation codes to more detailed data (would be enhanced with more BLS API calls)
    const occupationMap: Record<string, OccupationData> = {
      '15-1252': { // Software Developers
        title: 'Software Developer',
        medianSalary: 120730,
        medianAge: 38,
        educationRequirements: ['Bachelor\'s Degree in Computer Science', 'Master\'s Degree in Computer Science'],
        yearsExperience: 4.5,
        technicalSkills: ['JavaScript', 'Python', 'SQL', 'React', 'Node.js', 'AWS'],
        softSkills: ['Problem Solving', 'Communication', 'Teamwork']
      },
      '13-1071': { // Human Resources Specialists
        title: 'HR Specialist',
        medianSalary: 62290,
        medianAge: 42,
        educationRequirements: ['Bachelor\'s Degree in Human Resources', 'Bachelor\'s Degree in Business Administration'],
        yearsExperience: 3.2,
        technicalSkills: ['HRIS Systems', 'ATS Software', 'Microsoft Office', 'Data Analysis'],
        softSkills: ['Communication', 'Conflict Resolution', 'Emotional Intelligence']
      },
      '11-2021': { // Marketing Managers
        title: 'Marketing Manager',
        medianSalary: 133380,
        medianAge: 40,
        educationRequirements: ['Bachelor\'s Degree in Marketing', 'MBA', 'Bachelor\'s Degree in Communications'],
        yearsExperience: 5.8,
        technicalSkills: ['Google Analytics', 'SEO', 'Social Media Marketing', 'Content Management', 'Adobe Creative Suite'],
        softSkills: ['Creativity', 'Strategic Planning', 'Leadership']
      },
      '13-2011': { // Accountants and Auditors
        title: 'Accountant',
        medianSalary: 73560,
        medianAge: 44,
        educationRequirements: ['Bachelor\'s Degree in Accounting', 'CPA Certification'],
        yearsExperience: 4.0,
        technicalSkills: ['QuickBooks', 'Excel', 'Tax Preparation Software', 'ERP Systems'],
        softSkills: ['Attention to Detail', 'Ethics', 'Analytical Thinking']
      }
    };

    // If we have pre-mapped data, return it
    if (occupationMap[occupationCode]) {
      return occupationMap[occupationCode];
    }

    // Otherwise, make a real API call to BLS
    // This would be expanded to use more specific BLS series IDs for detailed data
    const params: BlsRequestParams = {
      seriesid: ['CEU4348400001'], // Example series ID for software publishing employment
      startyear: '2023',
      endyear: '2023',
      registrationKey: BLS_API_KEY
    };

    const response = await axios.post<BlsResponse>(BLS_API_URL, params);
    
    if (response.data.status !== 'REQUEST_SUCCEEDED') {
      console.error('BLS API request failed:', response.data.message);
      return null;
    }

    // This is a placeholder - in a real implementation, we would actually parse the BLS data
    // to extract meaningful occupation information based on various series IDs
    return {
      title: 'Software Developer',
      medianSalary: 120730,
      medianAge: 38,
      educationRequirements: ['Bachelor\'s Degree in Computer Science', 'Master\'s Degree in Computer Science'],
      yearsExperience: 4.5,
      technicalSkills: ['JavaScript', 'Python', 'SQL', 'React', 'Node.js', 'AWS'],
      softSkills: ['Problem Solving', 'Communication', 'Teamwork']
    };
  } catch (error) {
    console.error('Error fetching BLS occupation data:', error);
    return null;
  }
}

/**
 * Generates a realistic candidate based on BLS data
 */
export async function generateRealisticCandidate(occupationCode: string): Promise<Candidate | null> {
  try {
    const occupationData = await getOccupationData(occupationCode);
    
    if (!occupationData) {
      return null;
    }
    
    // Generate a random name
    const firstNames = ['Michael', 'John', 'David', 'James', 'Robert', 'Sarah', 'Jessica', 'Emily', 'Jennifer', 'Elizabeth'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
    const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
    const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
    const name = `${firstName} ${lastName}`;
    
    // Randomize gender
    const genders = ['Male', 'Female', 'Non-binary'];
    const gender = genders[Math.floor(Math.random() * genders.length)];
    
    // Randomize age based on median age for the occupation
    const ageVariation = Math.floor(Math.random() * 10) - 5; // -5 to +5 years from median
    const age = Math.max(22, occupationData.medianAge + ageVariation);
    
    // Randomize experience within realistic bounds
    const expVariation = Math.floor(Math.random() * 4) - 2; // -2 to +2 years from median
    const experience = Math.max(1, Math.round(occupationData.yearsExperience + expVariation));
    
    // Select education level
    const education = occupationData.educationRequirements[Math.floor(Math.random() * occupationData.educationRequirements.length)];
    
    // Create education details
    const educationDetails: EducationDetail[] = [{
      institution: ['Stanford University', 'MIT', 'University of Michigan', 'Georgia Tech', 'UCLA', 'State University']
        [Math.floor(Math.random() * 6)],
      degree: education,
      years: `${2010 - Math.floor(Math.random() * 5)} - ${2014 - Math.floor(Math.random() * 5)}`
    }];
    
    // Create experience details
    const companies = ['TechCorp', 'Innovate Solutions', 'NextGen Systems', 'Global Dynamics', 'Future Technologies', 'Advanced Applications'];
    const experienceDetails: ExperienceDetail[] = [];
    
    let remainingYears = experience;
    let currentYear = new Date().getFullYear();
    
    while (remainingYears > 0) {
      const jobYears = Math.min(remainingYears, 1 + Math.floor(Math.random() * 3));
      const company = companies[Math.floor(Math.random() * companies.length)];
      const details = [
        'Led development of new product features',
        'Collaborated with cross-functional teams',
        'Improved process efficiency by 25%',
        'Managed team of 3-5 professionals',
        'Participated in strategic planning initiatives'
      ];
      
      experienceDetails.push({
        title: occupationData.title,
        company: company,
        years: `${currentYear - jobYears} - ${currentYear}`,
        details: details.slice(0, 2 + Math.floor(Math.random() * 3))
      });
      
      currentYear -= jobYears;
      remainingYears -= jobYears;
    }
    
    // Select skills
    const technicalSkills = [...occupationData.technicalSkills]
      .sort(() => 0.5 - Math.random()) // Shuffle
      .slice(0, 3 + Math.floor(Math.random() * 3)); // Take 3-5 skills
    
    const softSkill = occupationData.softSkills[Math.floor(Math.random() * occupationData.softSkills.length)];
    
    // Create candidate
    const candidate: Candidate = {
      id: Math.floor(Math.random() * 10000),
      name,
      gender,
      age,
      experience,
      education,
      educationDetails,
      experienceDetails,
      skills: {
        technical: technicalSkills,
        soft: softSkill
      },
      softSkill,
      softSkillDetail: `Strong ${softSkill.toLowerCase()} abilities demonstrated through past projects and team leadership.`,
      references: [
        {
          name: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
          title: 'Former Manager',
          quote: `${firstName} is an exceptional professional with strong ${softSkill.toLowerCase()} skills.`
        }
      ],
      interviewQuote: `I believe my experience with ${technicalSkills[0]} and ${technicalSkills[1]} makes me a strong fit for this role.`,
      followupQuestion: 'How do you handle conflicting priorities?',
      followupAnswer: `I prioritize tasks based on business impact and deadlines, while maintaining open communication with stakeholders.`,
      goldStar: `Exceptional ${softSkill.toLowerCase()} skills that would benefit the team culture.`,
      redFlag: 'May need additional training in newer technologies.',
      keyStrength: technicalSkills[0]
    };
    
    return candidate;
  } catch (error) {
    console.error('Error generating realistic candidate:', error);
    return null;
  }
}