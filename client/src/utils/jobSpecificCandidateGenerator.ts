import { Candidate, ExperienceDetail } from "@/types/game";
import { generateRealisticCandidate } from '@/services/blsService';
import { apiRequest } from '@/lib/queryClient';

// Function to generate a candidate using OpenAI API
async function generateCandidateWithOpenAI(jobPosition: string): Promise<Candidate | null> {
  try {
    const response = await apiRequest<Candidate>('/api/openai/generate-candidate', {
      method: 'POST',
      body: JSON.stringify({ jobPosition }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    // Ensure we have valid skills array format - defensive coding
    if (!response.skills) {
      response.skills = {
        technical: [],
        soft: ""
      };
    }
    
    if (!Array.isArray(response.skills.technical)) {
      response.skills.technical = [];
    }
    
    return response;
  } catch (error) {
    console.error('Error generating candidate with OpenAI:', error);
    return null;
  }
}

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

const nonBinaryFirstNames = [
  "Riley", "Jordan", "Taylor", "Jamie", "Alex", "Casey", "Morgan", "Quinn",
  "Avery", "Hayden", "Peyton", "Rowan", "Dakota", "Skyler", "Sage", "Phoenix"
];

const lastNames = [
  "Smith", "Johnson", "Williams", "Jones", "Brown", "Davis", "Miller", "Wilson", 
  "Moore", "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin",
  "Garcia", "Rodriguez", "Martinez", "Lee", "Wang", "Kim", "Patel", "Singh", 
  "Nguyen", "Gonzalez", "Washington", "Jefferson", "Ali", "Khan"
];

// Common reference names and titles
const referenceNames = [
  "Amanda Lee", "Robert Davis", "Sarah Wong", "Michael Chen", "Jennifer Kim",
  "David Martinez", "Emily Johnson", "Hassan Ali", "Priya Patel", "James Wilson"
];

const referenceTitles = {
  "Software Developer": ["Engineering Manager", "CTO", "Technical Lead", "Senior Developer", "VP of Engineering"],
  "Marketing Manager": ["Marketing Director", "CMO", "Brand Manager", "VP of Marketing", "Sales Director"],
  "Financial Analyst": ["Finance Director", "CFO", "Investment Manager", "Financial Controller", "Accounting Manager"],
  "Human Resources Director": ["CEO", "VP of HR", "Chief People Officer", "Talent Acquisition Director", "HR Manager"],
  "Project Manager": ["PMO Director", "Operations Director", "Program Manager", "Department Head", "CEO"],
  "Data Scientist": ["Head of Data", "Director of Analytics", "Research Director", "Chief Data Officer", "AI Team Lead"],
  "Customer Experience Manager": ["VP of Customer Success", "COO", "Service Director", "Customer Operations Head", "Retail Director"],
  "Product Designer": ["Design Director", "UX Lead", "Creative Director", "Product Manager", "Innovation Director"],
  "Operations Manager": ["COO", "Logistics Director", "Supply Chain Head", "Facility Manager", "Regional Manager"],
  "Sales Executive": ["VP of Sales", "Regional Director", "Chief Revenue Officer", "Sales Manager", "Business Development Director"]
};

const referenceQuotes = {
  "Software Developer": [
    "An exceptional problem solver who writes elegant, efficient code.",
    "Consistently delivered high-quality software and mentored junior developers.",
    "Demonstrated strong technical skills and innovative solutions to complex problems.",
    "A standout developer who balances technical excellence with practical delivery.",
    "Excellent at translating business requirements into technical solutions."
  ],
  "Marketing Manager": [
    "Led several successful campaigns that significantly increased brand awareness.",
    "Exceptional at developing strategic marketing plans with measurable results.",
    "A creative thinker who consistently finds innovative approaches to marketing challenges.",
    "Demonstrated strong leadership in cross-functional marketing initiatives.",
    "Excellent track record of growing market share and customer engagement."
  ],
  "Financial Analyst": [
    "Produced insightful financial models that guided key investment decisions.",
    "Demonstrated exceptional analytical skills and attention to detail in financial reporting.",
    "Consistently identified cost-saving opportunities that improved profitability.",
    "Provided valuable financial insights that helped shape business strategy.",
    "Exceptional ability to translate complex financial data into actionable recommendations."
  ],
  "Human Resources Director": [
    "Transformed our recruitment process, significantly improving the quality of hires.",
    "Exceptional talent for developing and implementing effective HR policies.",
    "Successfully managed complex employee relations issues with professionalism.",
    "Led initiatives that significantly improved employee retention and satisfaction.",
    "Demonstrated strong leadership in developing our company culture and values."
  ],
  "Project Manager": [
    "Consistently delivered projects on time and under budget.",
    "Exceptional ability to manage stakeholder expectations and coordinate cross-functional teams.",
    "Strong leadership skills in navigating complex projects with multiple dependencies.",
    "Implemented process improvements that increased project delivery efficiency.",
    "Excellent communication skills that kept everyone aligned throughout project execution."
  ],
  "Data Scientist": [
    "Developed predictive models that significantly improved business decision-making.",
    "Exceptional ability to extract meaningful insights from complex datasets.",
    "Innovative approach to solving business problems through data analytics.",
    "Strong technical skills combined with excellent business acumen.",
    "Transformed raw data into valuable strategic insights for the organization."
  ],
  "Customer Experience Manager": [
    "Transformed our customer service approach, significantly improving satisfaction scores.",
    "Implemented innovative solutions that enhanced the customer journey.",
    "Exceptional ability to identify pain points and develop effective solutions.",
    "Led initiatives that significantly reduced customer churn.",
    "Demonstrated strong leadership in building a customer-centric culture."
  ],
  "Product Designer": [
    "Created innovative designs that significantly enhanced user experience.",
    "Exceptional ability to translate user needs into elegant design solutions.",
    "Consistently delivered designs that balanced aesthetics with functionality.",
    "Strong collaborative skills in working with engineering and product teams.",
    "Transformed complex requirements into intuitive, user-friendly designs."
  ],
  "Operations Manager": [
    "Implemented process improvements that significantly increased operational efficiency.",
    "Strong leadership in managing complex logistics and supply chain operations.",
    "Exceptional ability to identify and eliminate operational bottlenecks.",
    "Led initiatives that reduced costs while maintaining quality standards.",
    "Demonstrated excellence in managing resources and optimizing workflows."
  ],
  "Sales Executive": [
    "Consistently exceeded sales targets and expanded our customer base.",
    "Exceptional ability to build and maintain strategic client relationships.",
    "Strong negotiation skills that secured high-value contracts.",
    "Implemented innovative sales strategies that opened new market segments.",
    "Demonstrated leadership in building and motivating high-performing sales teams."
  ]
};

// Job-specific education datasets
const educationByPosition = {
  "Software Developer": {
    institutions: [
      "MIT", "Stanford University", "Carnegie Mellon", "Georgia Tech", 
      "University of Washington", "Cal Poly", "Purdue University", "CodeAcademy",
      "App Academy", "Lambda School", "Hack Reactor", "UC Berkeley"
    ],
    degrees: [
      "Bachelor of Computer Science", "Master of Software Engineering", 
      "Associate's in Computer Programming", "Ph.D. in Computer Science",
      "Coding Bootcamp Graduate", "Bachelor of Web Development", 
      "Master of Information Technology", "Self-taught"
    ]
  },
  "Marketing Manager": {
    institutions: [
      "Northwestern University", "New York University", "University of Pennsylvania", 
      "Columbia University", "University of Michigan", "Boston University", 
      "UCLA", "University of Texas", "Duke University", "Emerson College"
    ],
    degrees: [
      "Bachelor of Marketing", "MBA with Marketing Concentration", 
      "Master of Digital Marketing", "Bachelor of Business Administration",
      "Associate's in Marketing", "Certificate in Digital Strategy", 
      "Bachelor of Communications", "Master of Advertising"
    ]
  },
  "Financial Analyst": {
    institutions: [
      "University of Chicago", "Wharton School", "London School of Economics", 
      "NYU Stern", "Harvard Business School", "Stanford GSB", 
      "Cornell University", "INSEAD", "Michigan Ross", "Columbia Business School"
    ],
    degrees: [
      "Bachelor of Finance", "Master of Financial Analysis", 
      "MBA in Finance", "CFA Certification",
      "Bachelor of Economics", "Master of Accounting", 
      "Bachelor of Business with Finance Major", "Ph.D. in Economics"
    ]
  },
  "Human Resources Director": {
    institutions: [
      "Cornell ILR School", "Michigan State University", "Rutgers University", 
      "University of Illinois", "Penn State", "Ohio State University", 
      "University of Minnesota", "Temple University", "Villanova University", "USC"
    ],
    degrees: [
      "Bachelor of Human Resources", "Master of HR Management", 
      "MBA with HR Concentration", "SHRM Certification",
      "Bachelor of Psychology", "Master of Organizational Development", 
      "PHR/SPHR Certification", "Bachelor of Business Administration"
    ]
  },
  "Project Manager": {
    institutions: [
      "Boston University", "George Washington University", "UC Irvine", 
      "University of Maryland", "Stevens Institute of Technology", 
      "Northeastern University", "Arizona State University", "Penn State", "NYU", "UCLA"
    ],
    degrees: [
      "Bachelor of Project Management", "Master of Project Management", 
      "MBA", "PMP Certification",
      "Bachelor of Business Administration", "Master of Engineering Management", 
      "Bachelor of Systems Engineering", "Scrum Master Certification"
    ]
  },
  "Data Scientist": {
    institutions: [
      "Stanford University", "MIT", "UC Berkeley", "Carnegie Mellon", 
      "University of Washington", "Georgia Tech", "Harvard University", 
      "Columbia University", "University of Michigan", "NYU"
    ],
    degrees: [
      "Master of Data Science", "Ph.D. in Statistics", 
      "Bachelor of Computer Science", "Master of Machine Learning",
      "Bachelor of Mathematics", "Master of Computational Science", 
      "Ph.D. in Artificial Intelligence", "Bachelor of Statistical Science"
    ]
  },
  "Customer Experience Manager": {
    institutions: [
      "Arizona State University", "Michigan State University", "University of Florida", 
      "San Jose State", "University of Georgia", "University of Oregon", 
      "Purdue University", "Texas A&M", "University of Arizona", "Syracuse University"
    ],
    degrees: [
      "Bachelor of Business Administration", "MBA with Service Management Focus", 
      "Bachelor of Customer Service Management", "Master of Service Design",
      "Bachelor of Communications", "Service Experience Certification", 
      "Bachelor of Hospitality Management", "Master of Public Relations"
    ]
  },
  "Product Designer": {
    institutions: [
      "Rhode Island School of Design", "Parsons School of Design", "Pratt Institute", 
      "Art Center College of Design", "Academy of Art University", "SCAD", 
      "California College of the Arts", "Maryland Institute College of Art", "Carnegie Mellon", "Cooper Union"
    ],
    degrees: [
      "Bachelor of Industrial Design", "Master of UX Design", 
      "Bachelor of Product Design", "Master of Interaction Design",
      "Bachelor of Design", "Master of Design Thinking", 
      "Bachelor of Fine Arts", "Certificate in User Experience Design"
    ]
  },
  "Operations Manager": {
    institutions: [
      "Michigan State University", "Penn State", "MIT", "Georgia Tech", 
      "Purdue University", "Ohio State University", "Arizona State University", 
      "University of Tennessee", "University of Michigan", "Texas A&M"
    ],
    degrees: [
      "Bachelor of Operations Management", "Master of Supply Chain Management", 
      "MBA with Operations Focus", "Six Sigma Certification",
      "Bachelor of Logistics", "Master of Industrial Engineering", 
      "Bachelor of Business Administration", "Lean Management Certification"
    ]
  },
  "Sales Executive": {
    institutions: [
      "University of Michigan", "Arizona State University", "Indiana University", 
      "Boston College", "University of Georgia", "Florida State University", 
      "Ohio State University", "Texas A&M", "University of South Carolina", "Miami University"
    ],
    degrees: [
      "Bachelor of Sales and Marketing", "MBA", 
      "Bachelor of Business Administration", "Master of Marketing",
      "Bachelor of Communications", "Sales Management Certification", 
      "Bachelor of Economics", "Master of Business Development"
    ]
  }
};

// Job-specific company datasets
const companiesByPosition = {
  "Software Developer": [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", 
    "Uber", "Airbnb", "Salesforce", "Adobe", "IBM", "Oracle", 
    "Twitter", "Shopify", "Stripe", "Square", "Twilio", "Zoom"
  ],
  "Marketing Manager": [
    "Procter & Gamble", "Unilever", "Coca-Cola", "PepsiCo", "Nike", 
    "Ogilvy", "McCann", "BBDO", "Leo Burnett", "Saatchi & Saatchi", 
    "Wieden+Kennedy", "Digitas", "HubSpot", "Mailchimp", "GroupM"
  ],
  "Financial Analyst": [
    "JPMorgan Chase", "Goldman Sachs", "Morgan Stanley", "Bank of America", 
    "Citigroup", "Wells Fargo", "BlackRock", "Vanguard", "Fidelity", 
    "KPMG", "Deloitte", "PwC", "EY", "Credit Suisse", "UBS"
  ],
  "Human Resources Director": [
    "ADP", "Workday", "SAP SuccessFactors", "LinkedIn", "Indeed", 
    "Randstad", "Adecco", "Manpower", "Kelly Services", "Robert Half", 
    "The Hackett Group", "Mercer", "Willis Towers Watson", "Aon"
  ],
  "Project Manager": [
    "Accenture", "McKinsey", "Boston Consulting Group", "Bain & Company", 
    "Deloitte", "KPMG", "PwC", "EY", "IBM Global Services", "Capgemini", 
    "Cognizant", "Infosys", "Wipro", "Tata Consultancy Services"
  ],
  "Data Scientist": [
    "Google", "Microsoft", "Amazon", "Meta", "Apple", "IBM", "Palantir", 
    "Databricks", "Cloudera", "SAS", "Dataiku", "Splunk", "Snowflake", 
    "DataRobot", "Alteryx", "Tableau", "H2O.ai", "Domino Data Lab"
  ],
  "Customer Experience Manager": [
    "Zappos", "Disney", "Ritz-Carlton", "Amazon", "Apple", "Starbucks", 
    "Nordstrom", "Southwest Airlines", "JetBlue", "Trader Joe's", 
    "USAA", "Chick-fil-A", "Costco", "REI", "Wegmans", "Warby Parker"
  ],
  "Product Designer": [
    "Apple", "Google", "Microsoft", "Adobe", "Figma", "Airbnb", "Uber", 
    "Spotify", "Nike", "IDEO", "Frog Design", "Pentagram", "Designit", 
    "Fjord", "Smart Design", "Continuum", "Fuseproject", "Huge"
  ],
  "Operations Manager": [
    "Amazon", "UPS", "FedEx", "DHL", "Maersk", "Walmart", "Target", 
    "Costco", "Procter & Gamble", "Unilever", "Toyota", "General Electric", 
    "Johnson & Johnson", "3M", "Siemens", "Bosch", "Caterpillar"
  ],
  "Sales Executive": [
    "Oracle", "Salesforce", "SAP", "Microsoft", "IBM", "Dell", "HP", 
    "Cisco", "Accenture", "ADP", "ServiceNow", "Workday", "VMware", 
    "Adobe", "Intuit", "Zendesk", "HubSpot", "DocuSign"
  ]
};

// Job-specific titles
const jobTitlesByPosition = {
  "Software Developer": [
    "Software Engineer", "Backend Developer", "Frontend Developer", "Full Stack Developer", 
    "Mobile Developer", "DevOps Engineer", "Cloud Engineer", "Application Architect", 
    "Systems Engineer", "Web Developer", "API Developer", "QA Engineer"
  ],
  "Marketing Manager": [
    "Digital Marketing Manager", "Brand Manager", "Content Marketing Manager", 
    "Social Media Manager", "SEO Specialist", "Marketing Communications Manager", 
    "Growth Marketing Manager", "Product Marketing Manager", "Marketing Analytics Manager"
  ],
  "Financial Analyst": [
    "Investment Analyst", "Financial Advisor", "Portfolio Manager", "Risk Analyst", 
    "Budget Analyst", "Equity Analyst", "Credit Analyst", "Corporate Finance Analyst", 
    "Treasury Analyst", "Quantitative Analyst", "Financial Consultant"
  ],
  "Human Resources Director": [
    "HR Manager", "Talent Acquisition Specialist", "Employee Relations Manager", 
    "Training and Development Manager", "Compensation and Benefits Manager", 
    "HRIS Manager", "HR Business Partner", "Organizational Development Manager"
  ],
  "Project Manager": [
    "Program Manager", "Scrum Master", "Agile Coach", "IT Project Manager", 
    "Construction Project Manager", "PMO Manager", "Product Owner", 
    "Implementation Manager", "Business Project Manager", "Technical Project Manager"
  ],
  "Data Scientist": [
    "Data Analyst", "Machine Learning Engineer", "Business Intelligence Analyst", 
    "Research Scientist", "Data Engineer", "AI Specialist", "Statistician", 
    "Computational Scientist", "Big Data Engineer", "Quantitative Researcher"
  ],
  "Customer Experience Manager": [
    "Customer Success Manager", "Client Relationship Manager", "Customer Service Director", 
    "User Experience Manager", "Customer Insights Manager", "Customer Journey Manager", 
    "Account Manager", "Client Services Manager", "Customer Support Manager"
  ],
  "Product Designer": [
    "UX Designer", "UI Designer", "Interaction Designer", "Experience Designer", 
    "Visual Designer", "Industrial Designer", "Design Strategist", "Design Researcher", 
    "Service Designer", "Creative Director", "Design Manager"
  ],
  "Operations Manager": [
    "Logistics Manager", "Supply Chain Manager", "Procurement Manager", 
    "Warehouse Manager", "Production Manager", "Process Improvement Manager", 
    "Facility Manager", "Distribution Center Manager", "Quality Control Manager"
  ],
  "Sales Executive": [
    "Account Executive", "Business Development Manager", "Sales Representative", 
    "Regional Sales Manager", "Enterprise Sales Manager", "Inside Sales Manager", 
    "Sales Engineer", "Solution Consultant", "Territory Manager", "Channel Sales Manager"
  ]
};

// Job-specific technical skills
const technicalSkillsByPosition = {
  "Software Developer": [
    "JavaScript", "Python", "Java", "C#", "C++", "Go", "Rust", "TypeScript", 
    "React", "Angular", "Vue.js", "Node.js", "Django", "Spring Boot", "ASP.NET", 
    "AWS", "Azure", "GCP", "Docker", "Kubernetes", "CI/CD", "Git", 
    "SQL", "MongoDB", "PostgreSQL", "Redis", "GraphQL", "REST APIs", "Microservices"
  ],
  "Marketing Manager": [
    "SEO", "SEM", "Google Analytics", "Google Ads", "Meta Ads", "Content Management", 
    "Marketing Automation", "HubSpot", "Mailchimp", "Marketo", "Salesforce Marketing Cloud", 
    "Adobe Creative Suite", "Canva", "Social Media Platforms", "Email Marketing", 
    "A/B Testing", "Conversion Rate Optimization", "Customer Segmentation", "Marketing Analytics"
  ],
  "Financial Analyst": [
    "Financial Modeling", "Valuation Methods", "DCF Analysis", "Excel Advanced Functions", 
    "VBA", "Bloomberg Terminal", "FactSet", "Capital IQ", "Python for Finance", "R", 
    "SQL", "Tableau", "Power BI", "Financial Statement Analysis", "Risk Assessment", 
    "Forecasting", "Budgeting", "Investment Analysis", "Accounting Principles"
  ],
  "Human Resources Director": [
    "HRIS Systems", "ATS Software", "Workday", "SAP SuccessFactors", "Oracle HCM", 
    "Performance Management", "Compensation Planning", "Benefits Administration", 
    "Employee Relations", "Labor Laws", "Talent Acquisition", "Learning Management Systems", 
    "Diversity & Inclusion Strategies", "Organizational Development", "Change Management"
  ],
  "Project Manager": [
    "MS Project", "Jira", "Asana", "Trello", "Monday.com", "Smartsheet", "Basecamp", 
    "Gantt Charts", "Agile Methodologies", "Scrum", "Kanban", "PRINCE2", "Waterfall", 
    "Stakeholder Management", "Risk Management", "Resource Allocation", "Critical Path Analysis", 
    "Earned Value Management", "Project Portfolio Management", "Change Control Processes"
  ],
  "Data Scientist": [
    "Python", "R", "SQL", "Hadoop", "Spark", "TensorFlow", "PyTorch", "scikit-learn", 
    "Pandas", "NumPy", "Jupyter", "Tableau", "Power BI", "Machine Learning", "Deep Learning", 
    "NLP", "Computer Vision", "Big Data Technologies", "Statistical Analysis", "A/B Testing", 
    "Feature Engineering", "Data Visualization", "Experiment Design", "Bayesian Methods"
  ],
  "Customer Experience Manager": [
    "CRM Systems", "Salesforce", "Zendesk", "HubSpot", "Microsoft Dynamics", "ServiceNow", 
    "Customer Journey Mapping", "Voice of Customer (VoC) Tools", "NPS Measurement", 
    "Customer Analytics", "Survey Design", "User Testing", "Service Blueprinting", 
    "Call Center Management", "Complaint Resolution Systems", "Customer Feedback Analysis"
  ],
  "Product Designer": [
    "Figma", "Adobe XD", "Sketch", "InVision", "Photoshop", "Illustrator", "After Effects", 
    "ProtoPie", "Framer", "Principle", "3D Modeling", "CAD Software", "Design Systems", 
    "Wireframing", "Prototyping", "User Research", "Usability Testing", "Accessibility Standards", 
    "Typography", "Color Theory", "Interaction Design", "Visual Design", "Motion Design"
  ],
  "Operations Manager": [
    "ERP Systems", "SAP", "Oracle", "Inventory Management", "Supply Chain Software", 
    "Six Sigma", "Lean Management", "Process Mapping", "Quality Control Systems", 
    "Production Planning", "JIT Inventory", "Capacity Planning", "Logistics Management", 
    "Procurement Systems", "Warehouse Management Systems", "Performance Metrics", "KPI Tracking"
  ],
  "Sales Executive": [
    "CRM Systems", "Salesforce", "HubSpot", "Microsoft Dynamics", "Sales Analytics", 
    "Pipeline Management", "Sales Forecasting", "Territory Management", "Account Planning", 
    "Relationship Management", "Value Proposition Development", "Negotiation Techniques", 
    "Solution Selling", "Consultative Selling", "Sales Automation Tools", "LinkedIn Sales Navigator"
  ]
};

// Job-specific soft skills
const softSkillsByPosition = {
  "Software Developer": [
    {
      skill: "Problem Solving", 
      detail: "Approaches complex technical challenges with structured thinking and creativity"
    },
    {
      skill: "Communication", 
      detail: "Effectively explains technical concepts to non-technical stakeholders"
    },
    {
      skill: "Teamwork", 
      detail: "Collaborates well in agile environments and cross-functional teams"
    },
    {
      skill: "Adaptability", 
      detail: "Quickly learns new technologies and adjusts to changing requirements"
    },
    {
      skill: "Attention to Detail", 
      detail: "Produces clean, well-documented code with thorough testing"
    }
  ],
  "Marketing Manager": [
    {
      skill: "Creativity", 
      detail: "Develops innovative campaigns that capture audience attention"
    },
    {
      skill: "Strategic Thinking", 
      detail: "Aligns marketing initiatives with broader business objectives"
    },
    {
      skill: "Communication", 
      detail: "Crafts compelling messaging and presents ideas persuasively"
    },
    {
      skill: "Project Management", 
      detail: "Coordinates multiple campaigns across various channels simultaneously"
    },
    {
      skill: "Data-Driven Decision Making", 
      detail: "Uses analytics to optimize marketing performance and ROI"
    }
  ],
  "Financial Analyst": [
    {
      skill: "Analytical Thinking", 
      detail: "Identifies patterns and insights in complex financial data"
    },
    {
      skill: "Attention to Detail", 
      detail: "Ensures accuracy in financial models and calculations"
    },
    {
      skill: "Critical Thinking", 
      detail: "Evaluates financial information with objectivity and thoroughness"
    },
    {
      skill: "Communication", 
      detail: "Presents financial insights in clear, actionable terms"
    },
    {
      skill: "Ethical Judgment", 
      detail: "Maintains integrity and confidentiality with sensitive financial information"
    }
  ],
  "Human Resources Director": [
    {
      skill: "Empathy", 
      detail: "Understands employee concerns and mediates conflicts effectively"
    },
    {
      skill: "Communication", 
      detail: "Clearly explains policies and provides constructive feedback"
    },
    {
      skill: "Cultural Awareness", 
      detail: "Promotes inclusive workplace practices and diversity initiatives"
    },
    {
      skill: "Discretion", 
      detail: "Handles confidential information with appropriate sensitivity"
    },
    {
      skill: "Strategic Thinking", 
      detail: "Aligns HR initiatives with organizational goals and values"
    }
  ],
  "Project Manager": [
    {
      skill: "Leadership", 
      detail: "Motivates team members and builds consensus across stakeholders"
    },
    {
      skill: "Communication", 
      detail: "Provides clear direction and manages expectations effectively"
    },
    {
      skill: "Problem Solving", 
      detail: "Addresses project obstacles with creative solutions"
    },
    {
      skill: "Adaptability", 
      detail: "Adjusts project plans in response to changing priorities"
    },
    {
      skill: "Organization", 
      detail: "Manages multiple workstreams and dependencies simultaneously"
    }
  ],
  "Data Scientist": [
    {
      skill: "Critical Thinking", 
      detail: "Questions assumptions and validates hypotheses methodically"
    },
    {
      skill: "Communication", 
      detail: "Translates complex analyses into business-relevant insights"
    },
    {
      skill: "Curiosity", 
      detail: "Continuously explores data to uncover hidden patterns and opportunities"
    },
    {
      skill: "Domain Understanding", 
      detail: "Applies data science techniques with relevant business context"
    },
    {
      skill: "Storytelling", 
      detail: "Creates compelling narratives from data for executive audiences"
    }
  ],
  "Customer Experience Manager": [
    {
      skill: "Empathy", 
      detail: "Deeply understands customer needs and pain points"
    },
    {
      skill: "Communication", 
      detail: "Listens actively and responds appropriately to customer concerns"
    },
    {
      skill: "Problem Solving", 
      detail: "Resolves complex customer issues with creative solutions"
    },
    {
      skill: "Adaptability", 
      detail: "Adjusts approach based on different customer personalities"
    },
    {
      skill: "Resilience", 
      detail: "Maintains composure and effectiveness in high-pressure situations"
    }
  ],
  "Product Designer": [
    {
      skill: "Creativity", 
      detail: "Generates innovative design solutions to user problems"
    },
    {
      skill: "Empathy", 
      detail: "Deeply understands user needs and pain points"
    },
    {
      skill: "Collaboration", 
      detail: "Works effectively with developers, product managers, and stakeholders"
    },
    {
      skill: "Communication", 
      detail: "Articulates design decisions and presents concepts persuasively"
    },
    {
      skill: "Critical Thinking", 
      detail: "Evaluates design solutions against user needs and business goals"
    }
  ],
  "Operations Manager": [
    {
      skill: "Leadership", 
      detail: "Directs teams effectively and builds operational excellence"
    },
    {
      skill: "Problem Solving", 
      detail: "Identifies and eliminates inefficiencies in processes"
    },
    {
      skill: "Communication", 
      detail: "Clearly explains operational procedures and changes"
    },
    {
      skill: "Decision Making", 
      detail: "Makes timely, informed decisions under pressure"
    },
    {
      skill: "Attention to Detail", 
      detail: "Monitors quality standards and compliance with procedures"
    }
  ],
  "Sales Executive": [
    {
      skill: "Persuasion", 
      detail: "Effectively communicates value proposition to potential clients"
    },
    {
      skill: "Relationship Building", 
      detail: "Establishes trust and long-term partnerships with clients"
    },
    {
      skill: "Active Listening", 
      detail: "Identifies client needs and tailors solutions accordingly"
    },
    {
      skill: "Resilience", 
      detail: "Persists through rejection and maintains positive attitude"
    },
    {
      skill: "Negotiation", 
      detail: "Achieves win-win outcomes in complex sales discussions"
    }
  ]
};

// Job-specific achievements and accomplishments
const accomplishmentsByPosition = {
  "Software Developer": [
    "Led development of new product features that increased user engagement by 30%",
    "Reduced application load time by 40% through code optimization",
    "Implemented CI/CD pipeline that reduced deployment time from days to hours",
    "Refactored legacy code base, reducing bugs by 25%",
    "Developed API that processes 1M+ requests daily",
    "Created automated testing suite that increased code coverage to 90%",
    "Optimized database queries, improving performance by 60%",
    "Architected microservices solution to replace monolithic application"
  ],
  "Marketing Manager": [
    "Led digital campaign that increased conversions by 45%",
    "Developed content strategy that grew organic traffic by 65%",
    "Managed rebranding initiative that improved brand recognition by 30%",
    "Optimized marketing spend, reducing CAC by 25% while increasing acquisitions",
    "Built social media presence from zero to 500K followers",
    "Created email marketing strategy that improved open rates by 35%",
    "Implemented marketing automation that increased qualified leads by 40%",
    "Directed product launch campaign that exceeded sales targets by 20%"
  ],
  "Financial Analyst": [
    "Developed financial models that guided $10M investment decision",
    "Identified cost-saving opportunities resulting in 15% reduction in expenses",
    "Created forecasting model with 95% accuracy rate",
    "Led financial due diligence for successful acquisition",
    "Implemented new budgeting process that improved department efficiency by 25%",
    "Conducted risk analysis that prevented potential $2M loss",
    "Redesigned financial reporting, reducing preparation time by 30%",
    "Improved cash flow management, reducing working capital needs by 20%"
  ],
  "Human Resources Director": [
    "Reduced employee turnover by 25% through improved hiring and retention strategies",
    "Developed training program that increased productivity by 15%",
    "Implemented new HRIS system that streamlined HR processes by 30%",
    "Created diversity and inclusion initiative that improved workforce diversity by 20%",
    "Led compensation restructuring that improved employee satisfaction by 35%",
    "Designed onboarding program that reduced new hire ramp-up time by 40%",
    "Negotiated benefits package that improved coverage while reducing costs by 10%",
    "Resolved complex employee relations issues, preventing potential litigation"
  ],
  "Project Manager": [
    "Delivered $2M project on time and 10% under budget",
    "Led cross-functional team of 15 people across 3 departments",
    "Implemented new project methodology that improved delivery time by 25%",
    "Managed stakeholder expectations through effective communication strategies",
    "Successfully coordinated international project across 5 countries",
    "Recovered failing project and brought it back on schedule",
    "Developed project tracking system that improved visibility and accountability",
    "Aligned project objectives with strategic business goals, increasing ROI by 20%"
  ],
  "Data Scientist": [
    "Developed predictive model that improved forecast accuracy by 35%",
    "Built recommendation engine that increased customer engagement by 25%",
    "Created anomaly detection system that reduced fraud by 40%",
    "Implemented machine learning algorithm that automated manual process, saving 1000+ hours annually",
    "Conducted A/B tests that led to 15% increase in conversion rates",
    "Built data pipeline processing 5TB of data daily",
    "Developed NLP solution that improved customer service response time by 30%",
    "Created customer segmentation model that increased marketing ROI by 45%"
  ],
  "Customer Experience Manager": [
    "Improved customer satisfaction scores by 25% through service redesign",
    "Reduced customer churn by 15% through improved retention strategies",
    "Implemented new CRM system that increased team efficiency by 30%",
    "Created customer journey map that identified and resolved key pain points",
    "Developed training program that improved first-call resolution rate by 20%",
    "Designed Voice of Customer program that provided actionable insights",
    "Reduced average response time by 40% through process improvements",
    "Led initiative that improved Net Promoter Score from 20 to 45"
  ],
  "Product Designer": [
    "Redesigned user interface that increased user engagement by 35%",
    "Created design system that improved design consistency and development efficiency",
    "Led user research initiative that identified key product opportunities",
    "Developed prototypes for product that achieved 95% user satisfaction in testing",
    "Improved conversion funnel through iterative design, increasing conversions by 25%",
    "Created accessible designs that met WCAG 2.1 AA standards",
    "Led design sprint that solved critical user experience challenges",
    "Designed mobile app that received design award recognition"
  ],
  "Operations Manager": [
    "Improved operational efficiency by 20% through process optimization",
    "Reduced inventory costs by 15% while maintaining service levels",
    "Implemented lean management principles that increased productivity by 25%",
    "Developed quality control process that reduced defects by 30%",
    "Managed facility relocation with zero disruption to operations",
    "Created new workforce scheduling system that reduced overtime by 40%",
    "Improved supply chain reliability, reducing stockouts by 35%",
    "Led safety initiative that reduced workplace incidents by 50%"
  ],
  "Sales Executive": [
    "Exceeded annual sales target by 130%, generating $2.5M in new revenue",
    "Expanded client base by 25% in designated territory",
    "Developed sales strategy that penetrated previously untapped market segment",
    "Negotiated enterprise deal valued at $1.2M, largest in company history",
    "Built and trained high-performing sales team that exceeded targets by 40%",
    "Implemented new sales methodology that improved conversion rate by 15%",
    "Developed key account strategy that increased retention rate to 95%",
    "Created sales enablement tools that reduced sales cycle by 20%"
  ]
};

// Job-specific interview quotes
const interviewQuotesByPosition = {
  "Software Developer": [
    "I believe my greatest strength is my ability to break down complex problems methodically. In my previous role, I refactored a mission-critical legacy system while maintaining backward compatibility.",
    "What sets me apart is my commitment to writing maintainable, well-documented code. I've implemented coding standards and review processes that reduced technical debt by 40% on my last project.",
    "I thrive in collaborative environments where we can pair program and share knowledge. My previous team doubled our velocity after I introduced some agile practices and mentoring sessions.",
    "My approach to development combines technical excellence with business understanding. I always make sure I understand why we're building something before determining how to build it.",
    "I'm passionate about continuous learning. I recently taught myself machine learning techniques to implement a recommendation system that increased user engagement by 25%."
  ],
  "Marketing Manager": [
    "I believe marketing should always tie back to measurable business outcomes. In my last role, I restructured our campaigns to focus on ROI, resulting in a 30% increase in marketing-attributed revenue.",
    "My approach combines creative storytelling with data-driven decision making. I developed a content strategy that not only resonated with our audience but increased conversion rates by 25%.",
    "I excel at understanding customer psychology and creating messaging that connects emotionally. My rebranding campaign for our flagship product resulted in a 40% increase in brand recognition metrics.",
    "What drives me is finding the perfect market fit. I led research that identified an underserved segment, and our targeted campaign to this group delivered a 200% ROI within six months.",
    "I believe cross-functional collaboration is essential for marketing success. I partnered closely with product and sales teams to align our messaging, which reduced our sales cycle by 15%."
  ],
  "Financial Analyst": [
    "My analytical approach combines rigorous data analysis with strategic thinking. In my previous role, my financial modeling identified an opportunity that increased profitability by 12%.",
    "What sets me apart is my ability to translate complex financial data into actionable insights. I redesigned our executive reports to highlight key trends, which guided a successful expansion decision.",
    "I believe financial analysis should directly impact business strategy. I developed a pricing model that optimized margins while maintaining market share, resulting in 15% profit growth.",
    "My background in both finance and data science allows me to bring advanced analytical techniques to financial problems. I built a predictive model that improved our cash flow forecasting accuracy by 30%.",
    "I'm particularly strong at identifying inefficiencies in financial processes. I led an initiative that streamlined our month-end close, reducing completion time by 40% while improving accuracy."
  ],
  "Human Resources Director": [
    "I believe human resources should be a strategic partner to the business. In my last role, I aligned our talent acquisition strategy with business objectives, reducing time-to-hire by 35% for critical positions.",
    "My approach to HR combines empathy with data-driven decision making. I redesigned our performance management system based on employee feedback and best practices, increasing engagement scores by 20%.",
    "What drives me is creating an environment where people can do their best work. I developed a wellness program that reduced absenteeism by 15% and improved retention of top performers.",
    "I excel at navigating complex employee relations issues. I successfully mediated a dispute that prevented potential litigation and restored team productivity.",
    "My strength lies in organizational development. I led a change management initiative during a major restructuring that maintained productivity and reduced anticipated turnover by 25%."
  ],
  "Project Manager": [
    "My project management philosophy centers on clear communication and stakeholder alignment. In my last major project, we delivered a complex implementation on time by establishing transparent reporting and escalation paths.",
    "What sets me apart is my ability to adapt methodologies to project needs. I've successfully led projects using agile, waterfall, and hybrid approaches, always focusing on delivering business value.",
    "I excel at risk management and contingency planning. On my last project, we identified potential bottlenecks early and developed mitigation strategies that prevented delays despite vendor issues.",
    "My strength is building high-performing project teams. I focus on creating psychological safety and clear accountability, which led to 30% higher team productivity metrics on my most recent project.",
    "I believe project success goes beyond the triple constraint. In my previous role, I ensured our project not only met scope, schedule, and budget goals but also achieved the expected business outcomes."
  ],
  "Data Scientist": [
    "What distinguishes my approach to data science is my focus on business impact. I developed a churn prediction model that enabled targeted interventions, reducing customer attrition by 20%.",
    "I excel at translating complex analytical results into actionable insights. My analysis of customer behavior patterns led to a product redesign that increased engagement metrics by 35%.",
    "My background combines strong technical skills with domain expertise. I leveraged this combination to build a recommendation engine that increased average order value by 15%.",
    "I believe in iterative improvement through experimentation. I designed an A/B testing framework that allowed us to optimize our algorithms continuously, improving accuracy by 25% over six months.",
    "My strength lies in end-to-end data science solutions. I built a data pipeline and predictive maintenance system that reduced equipment downtime by 40%, saving the company millions annually."
  ],
  "Customer Experience Manager": [
    "My approach to customer experience focuses on understanding the entire customer journey. I conducted in-depth research that identified key pain points, and our targeted improvements increased satisfaction scores by 30%.",
    "What drives me is turning customers into advocates. I developed a service recovery program that not only resolved issues but converted 60% of complainants into repeat customers.",
    "I believe in using both qualitative and quantitative data to drive decisions. My Voice of Customer program combined surveys, interviews, and behavioral data to provide a 360-degree view of customer needs.",
    "My strength is in creating customer-centric culture. I developed training and incentive programs that improved our team's empathy scores by 40% and reduced escalations by 25%.",
    "I excel at identifying moments that matter in the customer journey. I redesigned our onboarding process based on customer feedback, which reduced churn during the first 90 days by 35%."
  ],
  "Product Designer": [
    "My design philosophy centers on deeply understanding user needs. In my previous role, I conducted extensive research that informed a redesign that increased user engagement by 40%.",
    "What sets me apart is my ability to balance aesthetics with functionality. I developed a design system that not only created a cohesive user experience but improved development efficiency by 25%.",
    "I believe in data-informed design decisions. I implemented usability testing and analytics tracking that allowed us to iteratively improve our conversion funnel, increasing completion rates by 30%.",
    "My strength lies in collaborative design processes. I established co-design sessions with users and stakeholders that ensured our solutions addressed real needs and gained organizational support.",
    "I excel at designing for accessibility without compromising experience. I redesigned a critical application to meet WCAG standards while actually improving usability metrics for all users."
  ],
  "Operations Manager": [
    "My approach to operations management focuses on continuous improvement. I implemented a Kaizen program that identified and eliminated inefficiencies, reducing operating costs by 15%.",
    "What distinguishes me is my ability to optimize processes end-to-end. I conducted a value stream mapping exercise that highlighted bottlenecks, and our targeted improvements increased throughput by 25%.",
    "I excel at building operational resilience. I developed contingency plans and cross-training programs that enabled us to maintain 99.8% service levels despite significant supply chain disruptions.",
    "My strength lies in data-driven decision making. I implemented KPI dashboards that provided real-time visibility into operations, allowing for proactive adjustments that improved performance by 20%.",
    "I believe in balancing operational efficiency with quality. I redesigned our quality control process to be more efficient while actually reducing defect rates by 30%."
  ],
  "Sales Executive": [
    "My sales philosophy centers on understanding customer needs deeply. I develop relationships based on trust and value creation, which is why I've maintained a 95% client retention rate throughout my career.",
    "What sets me apart is my consultative approach. I ask probing questions to understand the client's business challenges, which allows me to position our solutions as strategic investments rather than expenses.",
    "I excel at navigating complex sales environments with multiple stakeholders. In my last role, I mapped decision-making processes and developed targeted value propositions for each influencer.",
    "My strength lies in strategic account planning. I developed a methodology for identifying expansion opportunities in existing accounts, which generated 40% growth in customer lifetime value.",
    "I believe in combining relationship selling with data-driven approaches. I analyze sales metrics to continuously refine my process, which has allowed me to exceed quota by at least 20% every year."
  ]
};

// Job-specific follow-up questions and answers
const followupQuestionsByPosition = {
  "Software Developer": [
    {
      question: "How do you stay updated with evolving technologies?",
      answer: "I dedicate time each week to learning through online courses and building small projects with new technologies. I also participate in coding communities, contribute to open source when possible, and attend tech conferences. Recently, I've been exploring machine learning frameworks and cloud-native development patterns."
    },
    {
      question: "How do you approach debugging complex issues?",
      answer: "I follow a systematic process that starts with reproducing the issue consistently. I use logging, monitoring tools, and debugging techniques to gather information about the system's state. I form hypotheses about potential causes, test them methodically, and document my findings. I also believe in collaborative debugging for particularly complex problems."
    },
    {
      question: "How do you balance technical debt with delivery timelines?",
      answer: "I believe in addressing technical debt incrementally rather than letting it accumulate. I advocate for allocating 20% of sprint capacity to refactoring and improvements. For urgent deliveries, I document technical compromises as future work items and ensure we have a plan to address them. I also try to design solutions that minimize future debt."
    },
    {
      question: "How do you collaborate with non-technical team members?",
      answer: "I focus on translating technical concepts into business outcomes and user benefits. I use analogies, visual aids, and demonstrations rather than technical jargon. I also make an effort to understand their domain expertise so I can frame discussions in terms relevant to their roles and priorities."
    },
    {
      question: "What's your approach to testing and quality assurance?",
      answer: "I believe testing should be integrated throughout the development process, not treated as an afterthought. I practice test-driven development where appropriate, maintain a comprehensive test suite with unit, integration, and end-to-end tests, and incorporate automated testing into our CI/CD pipeline. I also value exploratory testing to catch edge cases."
    }
  ],
  "Marketing Manager": [
    {
      question: "How do you measure the success of your marketing campaigns?",
      answer: "I establish clear KPIs aligned with business objectives before launching any campaign. Beyond vanity metrics, I focus on conversion rates, customer acquisition cost, lifetime value, and attribution modeling to understand the full customer journey. I also implement A/B testing throughout campaigns to continuously optimize performance."
    },
    {
      question: "How do you stay current with changing marketing trends?",
      answer: "I follow industry publications, attend marketing conferences, and participate in professional communities. I also set aside time to experiment with new platforms and techniques through small pilot projects. Additionally, I maintain relationships with peers in the industry to exchange insights and best practices."
    },
    {
      question: "How do you approach marketing budget allocation?",
      answer: "I start by aligning budget with strategic priorities and growth opportunities. I use historical performance data to forecast ROI across channels and allocate resources accordingly. I maintain flexibility to shift budget based on real-time performance, typically reassessing allocations monthly. I also reserve 10-15% for testing new channels and approaches."
    },
    {
      question: "How do you ensure brand consistency across different channels?",
      answer: "I develop comprehensive brand guidelines that cover voice, visual identity, and messaging frameworks. I create channel-specific playbooks that adapt these guidelines to each platform's unique characteristics. I also implement approval workflows, conduct regular brand audits, and provide training to ensure everyone understands and applies our brand standards."
    },
    {
      question: "How do you collaborate with sales teams to drive revenue?",
      answer: "I establish regular touchpoints with sales leadership to align on goals and messaging. I develop sales enablement materials based on their feedback and market insights. I implement closed-loop reporting to understand which marketing initiatives drive quality leads. I also occasionally join sales calls to better understand customer questions and objections."
    }
  ],
  "Financial Analyst": [
    {
      question: "How do you approach financial modeling with incomplete data?",
      answer: "I start by identifying key assumptions and creating ranges of potential outcomes rather than single-point estimates. I use sensitivity analysis to understand which variables have the greatest impact on results, then focus on refining those specific inputs. I clearly document all assumptions and limitations, and update models as new information becomes available."
    },
    {
      question: "How do you communicate complex financial insights to non-financial stakeholders?",
      answer: "I focus on translating financial data into business implications and actionable recommendations. I use visual representations like dashboards and graphs rather than complex spreadsheets. I tailor the level of detail to the audience, emphasizing outcomes for executives while providing more detail for operational teams. I also avoid jargon and connect financial metrics to operational KPIs they already understand."
    },
    {
      question: "How do you stay current with financial regulations and accounting standards?",
      answer: "I maintain memberships in professional associations like CFA Institute or AICPA that provide updates on regulatory changes. I participate in continuing education programs, follow regulatory authorities' publications, and attend relevant webinars and conferences. I also collaborate with our legal and compliance teams to ensure our financial practices remain compliant."
    },
    {
      question: "How do you approach variance analysis when actuals differ from forecasts?",
      answer: "I follow a structured approach that separates variances into price, volume, mix, and efficiency components. I investigate root causes through both data analysis and discussions with operational teams. I distinguish between one-time anomalies and systematic issues, and use findings to refine future forecasting methodologies and identify operational improvement opportunities."
    },
    {
      question: "How do you incorporate risk assessment into financial analysis?",
      answer: "I use statistical methods like Monte Carlo simulations to model ranges of potential outcomes. I incorporate both quantitative factors and qualitative assessments of market conditions, competitive landscape, and operational challenges. I develop scenarios that stress-test assumptions and identify potential vulnerabilities. I also advocate for maintaining appropriate reserves based on risk profiles."
    }
  ],
  "Human Resources Director": [
    {
      question: "How do you approach difficult conversations with employees?",
      answer: "I prepare thoroughly with specific examples and clear messaging. I focus on behaviors and impact rather than personalities, and listen actively to understand their perspective. I ensure privacy and emotional safety during these discussions. For performance issues, I collaborate on specific improvement plans with measurable goals and regular check-ins to provide support."
    },
    {
      question: "How do you measure the effectiveness of HR programs?",
      answer: "I establish clear metrics aligned with program objectives, such as improved retention, reduced time-to-hire, or increased engagement scores. I use both quantitative data and qualitative feedback through surveys and focus groups. I conduct pre- and post-implementation measurements to demonstrate impact, and I calculate ROI for major initiatives by quantifying benefits against program costs."
    },
    {
      question: "How do you stay current with employment laws and regulations?",
      answer: "I maintain memberships in professional HR associations that provide regular updates and resources. I participate in continuing education programs and legal briefings. I've established relationships with employment law specialists for complex issues. I also regularly review our policies and practices to ensure ongoing compliance with changing regulations."
    },
    {
      question: "How do you promote diversity, equity, and inclusion in the workplace?",
      answer: "I approach DEI as a strategic priority integrated into all HR functions, not a standalone program. I use data to identify gaps in recruitment, development, and retention. I implement bias mitigation strategies in our hiring and promotion processes. I create safe channels for feedback, develop targeted mentoring programs, and establish employee resource groups. I also ensure leadership accountability through DEI metrics tied to performance objectives."
    },
    {
      question: "How do you manage competing priorities between employee needs and business objectives?",
      answer: "I focus on finding solutions that serve both interests rather than viewing them as inherently opposed. I use data to demonstrate how employee wellbeing drives business outcomes like retention, productivity, and innovation. For difficult tradeoffs, I ensure decisions are made with full understanding of implications, and I work to mitigate negative impacts. I also involve employees in developing solutions to workplace challenges where appropriate."
    }
  ],
  "Project Manager": [
    {
      question: "How do you handle scope creep?",
      answer: "I establish a clear change control process at project initiation that includes impact assessment, approval requirements, and documentation. I ensure stakeholders understand the implications of changes on timeline, budget, and resources. For small enhancements, I maintain a backlog for future phases. I also conduct regular reviews to ensure we're maintaining focus on the core objectives established in our project charter."
    },
    {
      question: "How do you manage team members who are underperforming?",
      answer: "I first try to understand root causes through one-on-one conversations, exploring whether the issue stems from skill gaps, unclear expectations, personal challenges, or motivational factors. I provide specific feedback, additional training or resources if needed, and clear performance improvement goals. I follow up regularly with both support and accountability, while documenting progress to ensure fairness and transparency."
    },
    {
      question: "How do you handle conflicts between team members?",
      answer: "I address conflicts promptly before they escalate, starting with private conversations to understand each perspective. I focus discussions on project objectives rather than personalities, looking for common ground. I establish clear communication protocols and roles when needed. For ongoing issues, I might restructure work assignments or implement team-building activities. I also use conflicts as opportunities to improve team processes."
    },
    {
      question: "How do you communicate project status to different stakeholders?",
      answer: "I tailor communication methods and content to each stakeholder group's needs and preferences. For executives, I provide high-level summaries focused on business impact, risks, and decisions needed. For operational teams, I share more detailed progress updates and upcoming dependencies. I maintain a central project dashboard for real-time visibility, send regular status reports, and hold dedicated review meetings with key stakeholder groups."
    },
    {
      question: "How do you approach risk management throughout the project lifecycle?",
      answer: "I implement a proactive risk management process that begins during project planning with identification of potential risks and development of mitigation strategies. I maintain a risk register that assesses probability and impact, assign risk owners, and review regularly during project meetings. I encourage team members to identify new risks early, and I adjust plans based on changing risk profiles. I also conduct post-project reviews to improve risk management in future projects."
    }
  ],
  "Data Scientist": [
    {
      question: "How do you ensure your models don't reinforce existing biases?",
      answer: "I implement several practices to address algorithmic bias. I carefully examine training data for historical biases and work to diversify data sources. I test model outputs across different demographic groups to identify disparate impacts. I use techniques like adversarial debiasing when appropriate. I also establish ongoing monitoring systems to detect bias in production, and I involve diverse stakeholders in reviewing model design and evaluation metrics."
    },
    {
      question: "How do you explain complex models to non-technical stakeholders?",
      answer: "I focus on business outcomes rather than technical details, using visualizations and real-world examples to illustrate how the model works. I prepare layered explanations that start with high-level concepts and allow for drilling deeper as needed. I relate model features to familiar business factors, and I use tools like SHAP values or partial dependence plots to explain specific predictions. I also demonstrate value through A/B testing results rather than just model metrics."
    },
    {
      question: "How do you approach feature engineering?",
      answer: "I start with a deep understanding of the domain, often consulting subject matter experts to identify potentially relevant variables. I explore data through visualization and correlation analysis to spot patterns. I create features based on business knowledge, looking particularly at interaction effects and temporal patterns. I test features systematically for predictive power and use techniques like principal component analysis for dimensionality reduction when appropriate. I also automate feature generation where possible for efficiency."
    },
    {
      question: "How do you decide when a model is ready for production?",
      answer: "I evaluate models against multiple criteria beyond just predictive accuracy. I assess robustness through cross-validation and testing on out-of-sample data. I conduct sensitivity analysis to understand stability across different inputs. I benchmark against current solutions to ensure meaningful improvement. I also consider operational factors like inference time, resource requirements, and integration complexity. Finally, I implement monitoring systems to track performance post-deployment."
    },
    {
      question: "How do you stay current with advances in data science and machine learning?",
      answer: "I follow research papers through platforms like arXiv and attend conferences like NeurIPS or ICML when possible. I participate in online communities and discussion forums where practitioners share techniques. I regularly experiment with new approaches through small projects and benchmarking exercises. I also contribute to open-source projects occasionally and collaborate with academic researchers when our work overlaps with their research interests."
    }
  ],
  "Customer Experience Manager": [
    {
      question: "How do you identify pain points in the customer journey?",
      answer: "I use a multi-method approach that combines quantitative data like drop-off rates and satisfaction scores with qualitative insights from customer interviews and feedback. I conduct observational research and usability testing to see how customers actually interact with our products or services. I map the end-to-end journey to identify friction points, especially during transitions between channels or departments. I also regularly mystery shop our own experience to maintain a customer perspective."
    },
    {
      question: "How do you balance customer needs with business constraints?",
      answer: "I quantify the business impact of customer pain points through metrics like churn rate, lifetime value reduction, and support costs. This helps prioritize improvements with the highest ROI. I identify quick wins that can be implemented with minimal resources while building business cases for larger investments. I also involve cross-functional teams in solution development to ensure operational feasibility and find creative ways to address customer needs within constraints."
    },
    {
      question: "How do you handle situations where a customer has unreasonable demands?",
      answer: "I first make sure I thoroughly understand their underlying needs, as sometimes seemingly unreasonable requests stem from legitimate concerns. I clearly communicate what we can and cannot do, explaining rationales rather than just saying no. I offer alternative solutions that address their core needs while remaining within our policies. For especially difficult situations, I escalate appropriately and ensure the customer feels heard even if we can't meet every demand."
    },
    {
      question: "How do you measure improvements in customer experience?",
      answer: "I use a combination of outcome metrics like Net Promoter Score, Customer Satisfaction, and Customer Effort Score, along with operational metrics like resolution time and first-contact resolution rate. I establish clear baselines before implementing changes and use control groups where possible to isolate the impact of specific initiatives. I also collect qualitative feedback through surveys and interviews to understand the 'why' behind metric changes."
    },
    {
      question: "How do you foster a customer-centric culture across departments?",
      answer: "I make customer insights accessible to everyone through dashboards and regular sharing of voice-of-customer data, including actual customer stories and verbatim feedback. I implement programs like customer shadowing and service experience workshops for employees across functions. I advocate for customer impact assessment in all major decisions. I also work with leadership to align incentives and recognition programs with customer-centric behaviors."
    }
  ],
  "Product Designer": [
    {
      question: "How do you balance user needs with business objectives?",
      answer: "I approach this by finding the intersection of user needs and business goals rather than viewing them as opposing forces. I identify user needs that, when addressed, drive business metrics like retention or conversion. I quantify the business impact of solving user problems through metrics and case studies. I also involve stakeholders early in the design process to ensure alignment and educate them on the ROI of user-centered design."
    },
    {
      question: "How do you approach usability testing?",
      answer: "I conduct iterative testing throughout the design process, not just at the end. I develop specific tasks aligned with key user journeys and establish clear success metrics. I recruit diverse participants representative of our user base, typically 5-7 users per testing round. I use a combination of moderated and unmoderated tests depending on the complexity, and I involve team members as observers to build empathy. I document findings systematically and prioritize issues based on impact and frequency."
    },
    {
      question: "How do you incorporate accessibility into your design process?",
      answer: "I consider accessibility from the beginning rather than as an afterthought. I follow WCAG guidelines and use tools to check color contrast, text size, and screen reader compatibility. I design with keyboard navigation and alternative inputs in mind. I conduct usability testing with users who have disabilities and use assistive technologies. I also create accessibility documentation to guide implementation and ensure maintenance over time."
    },
    {
      question: "How do you handle situations where research findings contradict stakeholder preferences?",
      answer: "I present research findings objectively with concrete examples and data rather than opinions. I connect user needs to business outcomes to demonstrate the value of addressing them. I suggest compromises or alternative approaches that might satisfy both user needs and stakeholder concerns. For significant disagreements, I might propose limited testing of competing approaches to gather additional data before making final decisions."
    },
    {
      question: "How do you collaborate with developers to ensure design implementation quality?",
      answer: "I start collaboration early, involving developers in the design process to understand technical constraints. I create detailed specifications and interaction documentation, using tools like Figma to provide interactive prototypes. I establish a design system with reusable components to ensure consistency and efficiency. I conduct regular implementation reviews and provide constructive feedback. I also remain flexible and open to technical alternatives that achieve the same user experience goals."
    }
  ],
  "Operations Manager": [
    {
      question: "How do you identify opportunities for process improvement?",
      answer: "I use a combination of data analysis, direct observation, and employee feedback to identify inefficiencies. I look for bottlenecks through value stream mapping and process timing studies. I analyze quality issues and customer complaints to trace root causes. I also conduct cross-company benchmarking to identify best practices. I prioritize improvement opportunities based on impact, effort required, and alignment with strategic objectives."
    },
    {
      question: "How do you manage resistance to process changes?",
      answer: "I involve affected employees early in the improvement process to incorporate their insights and build ownership. I clearly communicate the rationale behind changes, focusing on benefits to both the organization and employees themselves. I implement changes incrementally when possible and provide comprehensive training and support. I recognize and celebrate early successes, and I remain open to feedback and adjustments during implementation."
    },
    {
      question: "How do you balance quality standards with productivity targets?",
      answer: "I believe quality and productivity are complementary rather than competing priorities. I design processes with built-in quality checks rather than relying solely on end-of-line inspection. I use statistical process control to identify variation early. I establish clear standards and provide proper training and tools to meet them efficiently. I analyze quality issues to address root causes rather than implementing workarounds that reduce productivity."
    },
    {
      question: "How do you approach inventory management?",
      answer: "I use data-driven forecasting methods combined with safety stock calculations based on lead time variability and service level requirements. I implement ABC analysis to focus attention on high-value or critical items. I work closely with suppliers to reduce lead times and increase reliability. I balance just-in-time principles with risk management, especially for critical components. I also regularly review slow-moving inventory to prevent obsolescence."
    },
    {
      question: "How do you manage unexpected operational disruptions?",
      answer: "I've developed contingency plans for common scenarios like equipment failures, supply chain disruptions, or staffing shortages. I maintain cross-training programs to ensure workforce flexibility. When disruptions occur, I quickly assess impact, communicate transparently with stakeholders, and implement appropriate response plans. I also conduct post-incident reviews to improve future resilience and update contingency plans based on lessons learned."
    }
  ],
  "Sales Executive": [
    {
      question: "How do you approach a sales conversation with a new prospect?",
      answer: "I invest time in pre-call research to understand their industry, company, and potential pain points. I begin conversations by asking thoughtful questions rather than immediately pitching. I listen actively to identify underlying needs and priorities. I tailor my value proposition to their specific situation, using concrete examples and ROI calculations when possible. I focus on establishing credibility and building relationship foundations rather than pushing for immediate closure."
    },
    {
      question: "How do you handle customer objections?",
      answer: "I view objections as opportunities to better understand customer concerns and provide relevant information. I acknowledge their perspective without becoming defensive. I ask clarifying questions to identify the specific issue behind the objection. I respond with targeted information, success stories, or data that addresses their concern. For complex objections, I sometimes involve subject matter experts from our team to provide deeper technical explanations."
    },
    {
      question: "How do you manage your sales pipeline?",
      answer: "I maintain a disciplined approach to pipeline management with clearly defined stages and qualification criteria. I regularly review opportunities, focusing more time on those with higher probability and larger value. I use CRM analytics to identify conversion rate patterns at each stage. I'm realistic about opportunity assessment and quickly disqualify prospects with low probability rather than maintaining an artificially full pipeline. I also conduct periodic pipeline reviews with my manager to ensure alignment."
    },
    {
      question: "How do you collaborate with marketing and product teams?",
      answer: "I maintain regular communication channels with both departments to share customer feedback and market insights. I provide specific examples of customer pain points to product teams and success stories to marketing. I leverage marketing resources strategically in my sales process and provide feedback on which content and campaigns are most effective. I also participate in product roadmap discussions to represent customer needs and help prioritize features with the highest market value."
    },
    {
      question: "How do you maintain relationships with existing clients to drive expansion?",
      answer: "I establish regular touchpoints beyond just renewal periods, including quarterly business reviews for key accounts. I take time to understand their evolving business objectives and challenges. I track usage metrics and success indicators to identify both expansion opportunities and potential adoption issues. I connect clients with relevant resources beyond my direct offerings, such as educational content or networking opportunities. I also recognize and celebrate their successes."
    }
  ]
};

// Job-specific gold stars
const goldStarsByPosition = {
  "Software Developer": [
    "Developed open source library with 1,000+ stars on GitHub",
    "Winner of hackathon competition for innovative solution",
    "Contributed to major framework or language",
    "Holds multiple patents for software innovations",
    "Reduced critical system downtime by 99.9%",
    "Mentors junior developers and leads coding workshops",
    "Published technical articles on industry-leading platforms",
    "Created developer tool used by thousands of engineers"
  ],
  "Marketing Manager": [
    "Led campaign that won industry marketing award",
    "Grew social media following from 5K to 500K in one year",
    "Reduced customer acquisition cost by 60% while increasing volume",
    "Speaker at major marketing conferences",
    "Published case studies in marketing publications",
    "Certified in multiple advanced marketing specialties",
    "Developed innovative attribution model adopted company-wide",
    "Built marketing team that launched successful IPO"
  ],
  "Financial Analyst": [
    "CFA charterholder with distinction",
    "Identified investment opportunity that yielded 300% return",
    "Published research in respected financial journals",
    "Developed financial model adopted as industry standard",
    "Speaker at financial industry conferences",
    "Led analysis for successful merger/acquisition",
    "Awarded for excellence in financial forecasting",
    "Redesigned financial reporting system used company-wide"
  ],
  "Human Resources Director": [
    "SHRM Senior Certified Professional with specialization",
    "Reduced turnover by 40% through innovative retention strategies",
    "Speaker at major HR conferences",
    "Implemented successful diversity initiative featured as case study",
    "Led HR transformation that significantly improved engagement metrics",
    "Published articles in HR professional publications",
    "Designed recruiting process that became industry benchmark",
    "Certification in advanced organizational development methodologies"
  ],
  "Project Manager": [
    "PMP certification with 15+ years verified experience",
    "Successfully delivered $50M+ cross-functional project",
    "Rescued failing project and delivered on revised timeline",
    "Developed project methodology adopted company-wide",
    "Speaker at PMI conferences",
    "Certified in multiple project management frameworks",
    "Award-winning project that significantly impacted business results",
    "Published case studies on project management best practices"
  ],
  "Data Scientist": [
    "PhD in relevant field from top institution",
    "Published research in peer-reviewed journals",
    "Winner of prestigious data science competition",
    "Led project that created significant business impact through ML",
    "Created patented algorithm or methodology",
    "Contributor to major open-source data science tools",
    "Regular speaker at data science conferences",
    "Advanced certifications in specialized ML areas"
  ],
  "Customer Experience Manager": [
    "Improved NPS from 20 to 70 in one year",
    "Led service transformation featured as industry case study",
    "Certified Customer Experience Professional (CCXP)",
    "Speaker at CX conferences",
    "Reduced customer churn by 50% through experience improvements",
    "Created service recovery program with 90% resolution rate",
    "Award-winning customer experience initiative",
    "Published articles on customer experience best practices"
  ],
  "Product Designer": [
    "Design award winner for innovative product solution",
    "Patents for novel design innovations",
    "Featured work in design publications or exhibits",
    "Design led to 200% increase in user engagement metrics",
    "Founded successful design community or resource",
    "Speaker at design conferences",
    "Created design system adopted across enterprise",
    "Published case studies of successful design projects"
  ],
  "Operations Manager": [
    "Six Sigma Master Black Belt certification",
    "Led operational transformation saving $10M+ annually",
    "Successfully managed complete facility relocation with zero disruption",
    "Implemented supply chain innovation featured as case study",
    "Reduced inventory costs by 40% while maintaining service levels",
    "Speaker at operations management conferences",
    "Multiple patents for operational process innovations",
    "Created operations methodology adopted industry-wide"
  ],
  "Sales Executive": [
    "President's Club winner for 5+ consecutive years",
    "Built territory from zero to multi-million dollar revenue",
    "Closed largest deal in company history",
    "Developed sales methodology adopted company-wide",
    "Maintained 150%+ of quota for 3+ consecutive years",
    "Successfully penetrated previously untapped market segment",
    "Speaker at sales leadership conferences",
    "Published articles or case studies on sales effectiveness"
  ]
};

// Job-specific red flags
const redFlagsByPosition = {
  "Software Developer": [
    "Limited code samples or portfolio work",
    "No experience with version control systems",
    "Poor understanding of testing methodologies",
    "Significant gaps in employment history",
    "Inability to explain technical decisions",
    "No examples of debugging complex issues",
    "Limited collaboration experience",
    "Reluctance to learn new technologies"
  ],
  "Marketing Manager": [
    "Unable to provide metrics from previous campaigns",
    "Limited understanding of digital marketing channels",
    "No experience with marketing analytics",
    "Poor writing samples or communication skills",
    "Lack of adaptability to marketing trends",
    "No examples of data-driven decision making",
    "Significant gaps in employment history",
    "Limited understanding of target audience research"
  ],
  "Financial Analyst": [
    "Inconsistencies in financial knowledge",
    "Limited understanding of financial modeling",
    "Poor attention to detail in financial discussions",
    "Unable to explain analytical methodologies",
    "Limited experience with financial software tools",
    "No examples of data-driven financial insights",
    "Poor understanding of industry-specific metrics",
    "Significant gaps in employment history"
  ],
  "Human Resources Director": [
    "Limited knowledge of employment laws",
    "Poor conflict resolution examples",
    "No experience with HRIS systems",
    "Limited understanding of talent development",
    "No examples of strategic HR initiatives",
    "Poor communication or interpersonal skills",
    "Limited understanding of DEI best practices",
    "Significant gaps in employment history"
  ],
  "Project Manager": [
    "Poor communication during interview process",
    "Limited knowledge of project methodologies",
    "No examples of handling project challenges",
    "Inability to discuss risk management strategies",
    "Limited stakeholder management experience",
    "Poor understanding of project documentation",
    "No experience with project management tools",
    "Significant gaps in employment history"
  ],
  "Data Scientist": [
    "Limited understanding of statistical concepts",
    "No portfolio of data science projects",
    "Poor coding skills in relevant languages",
    "Limited experience with machine learning frameworks",
    "Inability to explain model selection reasoning",
    "No experience with real-world data challenges",
    "Limited understanding of data ethics",
    "Significant gaps in employment history"
  ],
  "Customer Experience Manager": [
    "Limited understanding of customer journey mapping",
    "No examples of service improvement initiatives",
    "Poor communication or empathy skills",
    "Limited experience with CX measurement methods",
    "No examples of cross-functional collaboration",
    "Limited knowledge of CX technology platforms",
    "Inability to provide service recovery examples",
    "Significant gaps in employment history"
  ],
  "Product Designer": [
    "Limited portfolio or case studies",
    "Poor understanding of design processes",
    "Limited knowledge of design tools",
    "No examples of user research or testing",
    "Inability to explain design decisions",
    "Limited collaborative design experience",
    "Poor understanding of accessibility principles",
    "Significant gaps in employment history"
  ],
  "Operations Manager": [
    "Limited understanding of process improvement",
    "No examples of operational problem solving",
    "Poor knowledge of relevant operations metrics",
    "Limited team management experience",
    "No examples of implementing efficiency improvements",
    "Limited understanding of quality management",
    "Poor knowledge of inventory or supply chain concepts",
    "Significant gaps in employment history"
  ],
  "Sales Executive": [
    "Unable to articulate sales methodology",
    "No specific examples of closing difficult deals",
    "Limited understanding of CRM utilization",
    "Poor communication or listening skills",
    "No examples of exceeding sales targets",
    "Limited knowledge of solution selling",
    "Inability to discuss pipeline management",
    "Significant gaps in employment history"
  ]
};

// Job-specific key strengths
const keyStrengthsByPosition = {
  "Software Developer": [
    "Full Stack Development",
    "Backend Architecture",
    "Cloud Infrastructure",
    "Mobile Development",
    "Database Optimization",
    "System Scalability",
    "Security Implementation",
    "DevOps Integration",
    "API Design",
    "Machine Learning Integration"
  ],
  "Marketing Manager": [
    "Digital Campaign Strategy",
    "Content Marketing",
    "Brand Development",
    "Marketing Analytics",
    "SEO/SEM Optimization",
    "Social Media Strategy",
    "Email Marketing",
    "Marketing Automation",
    "Conversion Optimization",
    "Influencer Marketing"
  ],
  "Financial Analyst": [
    "Financial Modeling",
    "Investment Analysis",
    "Risk Assessment",
    "Financial Forecasting",
    "Valuation Expertise",
    "Budget Management",
    "Capital Planning",
    "Financial Reporting",
    "Cost Optimization",
    "Merger & Acquisition Analysis"
  ],
  "Human Resources Director": [
    "Talent Acquisition",
    "Employee Development",
    "Organizational Design",
    "Compensation Strategy",
    "Employee Relations",
    "Change Management",
    "Performance Management",
    "Succession Planning",
    "Cultural Development",
    "Diversity & Inclusion"
  ],
  "Project Manager": [
    "Agile Leadership",
    "Stakeholder Management",
    "Risk Mitigation",
    "Resource Optimization",
    "Change Control",
    "Cross-functional Coordination",
    "Budget Management",
    "Program Management",
    "Vendor Management",
    "Project Recovery"
  ],
  "Data Scientist": [
    "Predictive Modeling",
    "Machine Learning",
    "NLP Implementation",
    "Data Visualization",
    "Statistical Analysis",
    "Big Data Processing",
    "AI Integration",
    "Experimental Design",
    "Feature Engineering",
    "Model Deployment"
  ],
  "Customer Experience Manager": [
    "Journey Mapping",
    "Voice of Customer",
    "Service Design",
    "Customer Insights",
    "Loyalty Program Development",
    "Omnichannel Experience",
    "Customer Retention",
    "Service Recovery",
    "Experience Measurement",
    "Digital Experience Optimization"
  ],
  "Product Designer": [
    "User Research",
    "Interaction Design",
    "Visual Design",
    "Prototyping",
    "Design Systems",
    "User Testing",
    "Information Architecture",
    "Accessibility Design",
    "Mobile Design",
    "Service Design"
  ],
  "Operations Manager": [
    "Process Optimization",
    "Supply Chain Management",
    "Inventory Control",
    "Quality Management",
    "Lean Implementation",
    "Facilities Management",
    "Logistics Optimization",
    "Workforce Planning",
    "Vendor Management",
    "Capacity Planning"
  ],
  "Sales Executive": [
    "Enterprise Relationship Management",
    "Solution Selling",
    "Territory Development",
    "Pipeline Management",
    "Sales Team Leadership",
    "Strategic Account Planning",
    "Negotiation",
    "Channel Development",
    "New Business Development",
    "Customer Retention"
  ]
};

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

/**
 * Generates candidates aligned with the specified job position
 */
export const generateJobSpecificCandidates = async (jobPosition: string, count: number): Promise<Candidate[]> => {
  // Try to use OpenAI API first for most realistic job-specific candidates
  try {
    // Create an array to hold promises for each candidate generation
    const candidatePromises: Promise<Candidate | null>[] = [];
    
    // Start the generation of the required number of candidates
    for (let i = 0; i < count; i++) {
      candidatePromises.push(generateCandidateWithOpenAI(jobPosition));
    }
    
    // Wait for all candidate generation promises to complete
    const apiCandidates = await Promise.all(candidatePromises);
    
    // Filter out any null results (failed generations)
    const validCandidates = apiCandidates.filter(c => c !== null) as Candidate[];
    
    // If we got all the requested candidates, return them
    if (validCandidates.length === count) {
      return validCandidates;
    }
    
    // If we got some but not all candidates, proceed with fallback for the remainder
    console.log(`OpenAI generated ${validCandidates.length} candidates, falling back to local generation for the remaining ${count - validCandidates.length}`);
    
    // Initialize array with API-generated candidates
    const candidates: Candidate[] = [...validCandidates];
    
    // Generate remaining candidates using the fallback method
    const remainingCount = count - validCandidates.length;
    generateFallbackCandidates(jobPosition, remainingCount, candidates);
    
    return candidates;
  } catch (error) {
    console.error("Error generating candidates with OpenAI, falling back to local generation:", error);
    
    // If OpenAI failed completely, use the fallback method for all candidates
    const candidates: Candidate[] = [];
    generateFallbackCandidates(jobPosition, count, candidates);
    return candidates;
  }
};

// Fallback function that generates candidates using predefined datasets
const generateFallbackCandidates = (jobPosition: string, count: number, candidates: Candidate[] = []): Candidate[] => {
  // Default position to fall back to if the given job position doesn't match
  const defaultPosition = "Software Developer";
  
  // Validate if the position exists in our datasets, otherwise fallback to default
  const validPosition = (Object.keys(educationByPosition).includes(jobPosition)) ? 
    jobPosition : defaultPosition;
  
  // Use the job-specific datasets
  const education = educationByPosition[validPosition as keyof typeof educationByPosition];
  const companies = companiesByPosition[validPosition as keyof typeof companiesByPosition];
  const jobTitles = jobTitlesByPosition[validPosition as keyof typeof jobTitlesByPosition];
  const technicalSkills = technicalSkillsByPosition[validPosition as keyof typeof technicalSkillsByPosition];
  const softSkills = softSkillsByPosition[validPosition as keyof typeof softSkillsByPosition];
  const accomplishments = accomplishmentsByPosition[validPosition as keyof typeof accomplishmentsByPosition];
  const interviewQuotes = interviewQuotesByPosition[validPosition as keyof typeof interviewQuotesByPosition];
  const followupQuestions = followupQuestionsByPosition[validPosition as keyof typeof followupQuestionsByPosition];
  const goldStars = goldStarsByPosition[validPosition as keyof typeof goldStarsByPosition];
  const redFlags = redFlagsByPosition[validPosition as keyof typeof redFlagsByPosition];
  const keyStrengths = keyStrengthsByPosition[validPosition as keyof typeof keyStrengthsByPosition];
  const quotes = referenceQuotes[validPosition as keyof typeof referenceQuotes];
  const titles = referenceTitles[validPosition as keyof typeof referenceTitles];

  for (let i = 0; i < count; i++) {
    // Determine gender (for name selection)
    const genderChance = Math.random();
    let gender: string, firstName: string;
    
    if (genderChance < 0.4) {
      gender = "Male";
      firstName = getRandomItem(maleFirstNames);
    } else if (genderChance < 0.8) {
      gender = "Female";
      firstName = getRandomItem(femaleFirstNames);
    } else {
      gender = "Non-binary";
      firstName = getRandomItem(nonBinaryFirstNames);
    }
    
    const lastName = getRandomItem(lastNames);
    const name = `${firstName} ${lastName}`;
    
    // Basic attributes - age should be appropriate for position
    let age: number;
    if (jobPosition === "Human Resources Director" || jobPosition === "Operations Manager") {
      // More senior positions
      age = getRandomInt(35, 55);
    } else if (jobPosition === "Data Scientist" || jobPosition === "Software Developer") {
      // Potentially younger positions
      age = getRandomInt(25, 45);
    } else {
      // Other positions
      age = getRandomInt(27, 50);
    }
    
    // Experience should be appropriate for age and position
    let minExperience = 1;
    
    if (jobPosition === "Human Resources Director" || jobPosition === "Operations Manager") {
      minExperience = 7;
    } else if (jobPosition === "Marketing Manager" || jobPosition === "Project Manager") {
      minExperience = 4;
    } else if (jobPosition === "Data Scientist" || jobPosition === "Software Developer") {
      minExperience = 1;
    }
    
    const maxExperience = Math.max(minExperience, age - 22); // Assuming people start working at 22 on average
    const experience = getRandomInt(minExperience, maxExperience);
    
    // Generate education based on position requirements
    const educationDegree = getRandomItem(education.degrees);
    const educationInstitution = getRandomItem(education.institutions);
    const gradYear = new Date().getFullYear() - getRandomInt(1, experience + 3);
    const startYear = gradYear - getRandomInt(2, 4);
    
    const educationDetails = [{
      institution: educationInstitution,
      degree: educationDegree,
      years: `${startYear} - ${gradYear}`
    }];
    
    // Add additional education for some candidates
    if (getRandomBoolean(0.3)) {
      const secondInstitution = getRandomItem(education.institutions.filter(i => i !== educationInstitution));
      const secondDegree = getRandomItem(education.degrees.filter(d => d !== educationDegree));
      const secondGradYear = startYear - getRandomInt(1, 3);
      const secondStartYear = secondGradYear - getRandomInt(2, 4);
      
      educationDetails.push({
        institution: secondInstitution,
        degree: secondDegree,
        years: `${secondStartYear} - ${secondGradYear}`
      });
    }
    
    // Generate job-specific experience details
    const experienceDetails: ExperienceDetail[] = [];
    const currentCompany = getRandomItem(companies);
    const currentTitle = getRandomItem(jobTitles);
    const currentStartYear = new Date().getFullYear() - getRandomInt(1, Math.min(5, experience));
    
    // Randomly select 2-3 accomplishments from the position-specific list
    const selectedAccomplishments = [];
    const shuffledAccomplishments = [...accomplishments].sort(() => 0.5 - Math.random());
    const numAccomplishments = getRandomInt(2, 3);
    
    for (let j = 0; j < numAccomplishments; j++) {
      selectedAccomplishments.push(shuffledAccomplishments[j]);
    }
    
    experienceDetails.push({
      title: currentTitle,
      company: currentCompany,
      years: `${currentStartYear} - ${new Date().getFullYear()}`,
      details: selectedAccomplishments
    });
    
    // Add previous jobs for more experienced candidates, with relevant titles
    let remainingExperience = experience - (new Date().getFullYear() - currentStartYear);
    
    if (remainingExperience > 2 && getRandomBoolean(0.9)) {
      const previousCompany = getRandomItem(companies.filter(c => c !== currentCompany));
      const previousTitle = getRandomItem(jobTitles);
      const previousDuration = getRandomInt(1, Math.min(5, remainingExperience));
      const previousEndYear = currentStartYear - 1;
      const previousStartYear = previousEndYear - previousDuration;
      
      experienceDetails.push({
        title: previousTitle,
        company: previousCompany,
        years: `${previousStartYear} - ${previousEndYear}`,
        details: shuffledAccomplishments.slice(numAccomplishments, numAccomplishments + 2)
      });
      
      remainingExperience -= previousDuration + 1; // +1 for the gap year
    }
    
    // Add one more previous position if enough experience remains
    if (remainingExperience > 2 && getRandomBoolean(0.7)) {
      const earlierCompany = getRandomItem(companies.filter(c => 
        !experienceDetails.some(e => e.company === c)
      ));
      const earlierTitle = getRandomItem(jobTitles);
      const earlierDuration = getRandomInt(1, remainingExperience);
      const earlierEndYear = parseInt(experienceDetails[experienceDetails.length - 1].years.split(' - ')[0]) - 1;
      const earlierStartYear = earlierEndYear - earlierDuration;
      
      experienceDetails.push({
        title: earlierTitle,
        company: earlierCompany,
        years: `${earlierStartYear} - ${earlierEndYear}`,
        details: shuffledAccomplishments.slice(numAccomplishments + 2, numAccomplishments + 3)
      });
    }
    
    // Generate job-specific skills
    const numTechnicalSkills = getRandomInt(4, 6);
    const shuffledSkills = [...technicalSkills].sort(() => 0.5 - Math.random());
    const technicalSkillSet = shuffledSkills.slice(0, numTechnicalSkills);
    
    const selectedSoftSkill = getRandomItem(softSkills);
    
    // Generate appropriate references with position-specific quotes
    const references = [];
    const numReferences = getRandomInt(1, 2);
    
    for (let j = 0; j < numReferences; j++) {
      const refName = getRandomItem(referenceNames);
      const refTitle = getRandomItem(titles);
      const refCompany = getRandomItem(experienceDetails.map(e => e.company));
      const refQuote = getRandomItem(quotes);
      
      references.push({
        name: refName,
        title: `${refTitle}, ${refCompany}`,
        quote: refQuote
      });
    }
    
    // Position-appropriate interview response and follow-up question
    const interviewQuote = getRandomItem(interviewQuotes);
    const followup = getRandomItem(followupQuestions);
    
    // Randomly assign gold stars or red flags with position-specific content
    let selectedGoldStar = "";
    let selectedRedFlag = "";
    
    if (getRandomBoolean(0.3)) {
      selectedGoldStar = getRandomItem(goldStars);
    } else if (getRandomBoolean(0.3)) {
      selectedRedFlag = getRandomItem(redFlags);
    }
    
    // Create the candidate with job-specific attributes
    candidates.push({
      id: i + 1,
      name,
      gender,
      age,
      experience,
      education: educationDegree.split(' ').slice(-2).join(' '), // Extract the main degree type
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
      goldStar: selectedGoldStar,
      redFlag: selectedRedFlag,
      keyStrength: getRandomItem(keyStrengths)
    });
  }
  
  return candidates;
};