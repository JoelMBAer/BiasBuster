import { Candidate, BiasInsight } from "@/types/game";

// Generate a random integer between min and max (inclusive)
function getRandomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Add some randomness to percentages to avoid repetitive insights
function randomizePercentage(basePercentage: number, variance: number = 10): number {
  const min = Math.max(basePercentage - variance, 1);
  const max = Math.min(basePercentage + variance, 99);
  return getRandomInt(min, max);
}

/**
 * Generates dynamic bias insights based on the candidates selected by the user.
 * This function analyzes patterns in selected candidates to identify potential unconscious biases.
 */
export function generateBiasInsights(selectedCandidates: Candidate[]): BiasInsight[] {
  // Return empty array if no candidates
  if (selectedCandidates.length === 0) return [];

  const insights: BiasInsight[] = [];
  const usedTypes: Set<string> = new Set();
  
  // Analyze gender distribution
  const genderCount: Record<string, number> = {};
  selectedCandidates.forEach(candidate => {
    const gender = candidate.gender.toLowerCase();
    genderCount[gender] = (genderCount[gender] || 0) + 1;
  });
  
  const totalCandidates = selectedCandidates.length;
  
  // Gender bias
  const genderKeys = Object.keys(genderCount);
  if (genderKeys.length > 0) {
    const dominantGender = genderKeys.reduce((a, b) => genderCount[a] > genderCount[b] ? a : b);
    const percentage = Math.round((genderCount[dominantGender] / totalCandidates) * 100);
    
    if (percentage >= 60) {
      const randomizedPercentage = randomizePercentage(percentage);
      insights.push({
        type: 'gender',
        title: 'Gender Preference',
        description: `You selected ${dominantGender === 'male' ? 'male' : dominantGender === 'female' ? 'female' : 'non-binary'} candidates ${randomizedPercentage}% of the time, which may indicate an unconscious gender preference.`,
        percentage: randomizedPercentage
      });
      usedTypes.add('gender');
    }
  }
  
  // Age bias
  const ageGroups = {
    'younger': 0,
    'mid-career': 0,
    'experienced': 0
  };
  
  selectedCandidates.forEach(candidate => {
    if (candidate.age < 35) ageGroups.younger++;
    else if (candidate.age < 50) ageGroups['mid-career']++;
    else ageGroups.experienced++;
  });
  
  const dominantAgeGroup = Object.keys(ageGroups).reduce((a, b) => 
    ageGroups[a as keyof typeof ageGroups] > ageGroups[b as keyof typeof ageGroups] ? a : b
  );
  const agePercentage = Math.round((ageGroups[dominantAgeGroup as keyof typeof ageGroups] / totalCandidates) * 100);
  
  if (agePercentage >= 55 && !usedTypes.has('age')) {
    const randomizedPercentage = randomizePercentage(agePercentage);
    const ageGroupDescriptions = {
      younger: 'candidates under 35',
      'mid-career': 'mid-career candidates (35-50)',
      experienced: 'candidates over 50'
    };
    insights.push({
      type: 'age',
      title: 'Age-Related Pattern',
      description: `You selected ${ageGroupDescriptions[dominantAgeGroup as keyof typeof ageGroupDescriptions]} ${randomizedPercentage}% of the time, suggesting a potential age-related preference.`,
      percentage: randomizedPercentage
    });
    usedTypes.add('age');
  }
  
  // Education bias
  const educationPreference: Record<string, number> = {};
  selectedCandidates.forEach(candidate => {
    const educationType = candidate.education.toLowerCase();
    if (educationType.includes('phd') || educationType.includes('doctorate')) {
      educationPreference['doctorate'] = (educationPreference['doctorate'] || 0) + 1;
    } else if (educationType.includes('master')) {
      educationPreference['masters'] = (educationPreference['masters'] || 0) + 1;
    } else if (educationType.includes('bachelor')) {
      educationPreference['bachelors'] = (educationPreference['bachelors'] || 0) + 1;
    } else {
      educationPreference['other'] = (educationPreference['other'] || 0) + 1;
    }
  });
  
  const educationKeys = Object.keys(educationPreference);
  if (educationKeys.length > 0 && !usedTypes.has('education')) {
    const dominantEducation = educationKeys.reduce((a, b) => educationPreference[a] > educationPreference[b] ? a : b);
    const educationPercentage = Math.round((educationPreference[dominantEducation] / totalCandidates) * 100);
    
    if (educationPercentage >= 50) {
      const randomizedPercentage = randomizePercentage(educationPercentage);
      insights.push({
        type: 'education',
        title: 'Education Preference',
        description: `${randomizedPercentage}% of your selections have ${dominantEducation === 'doctorate' ? 'PhD degrees' : dominantEducation === 'masters' ? 'Master\'s degrees' : dominantEducation === 'bachelors' ? 'Bachelor\'s degrees' : 'non-traditional education backgrounds'}, indicating a possible education-based bias.`,
        percentage: randomizedPercentage
      });
      usedTypes.add('education');
    }
  }
  
  // Experience bias
  const experienceSum = selectedCandidates.reduce((sum, candidate) => sum + candidate.experience, 0);
  const averageExperience = Math.round(experienceSum / totalCandidates);
  const experienceHighCount = selectedCandidates.filter(c => c.experience > averageExperience + 2).length;
  const experienceLowCount = selectedCandidates.filter(c => c.experience < averageExperience - 2).length;
  
  if ((experienceHighCount > totalCandidates * 0.5 || experienceLowCount > totalCandidates * 0.5) && !usedTypes.has('experience')) {
    const isHighExperience = experienceHighCount > experienceLowCount;
    const randomizedPercentage = randomizePercentage(
      Math.round(((isHighExperience ? experienceHighCount : experienceLowCount) / totalCandidates) * 100)
    );
    
    insights.push({
      type: 'experience',
      title: 'Experience Preference',
      description: isHighExperience
        ? `You tend to select candidates with above-average experience levels (${randomizedPercentage}% of selections), which may overlook talented individuals with less experience but high potential.`
        : `You tend to select candidates with below-average experience levels (${randomizedPercentage}% of selections), which might indicate a preference for fresh perspectives over proven track records.`,
      percentage: randomizedPercentage
    });
    usedTypes.add('experience');
  }
  
  // Communication style bias
  if (insights.length < 3 && !usedTypes.has('communication')) {
    const randomizedPercentage = randomizePercentage(55, 15);
    const communicationVariants = [
      `Your selections appear to favor candidates with an assertive communication style (${randomizedPercentage}% of choices), potentially overlooking thoughtful communicators who may be equally qualified.`,
      `${randomizedPercentage}% of your selected candidates demonstrated structured, detail-oriented communication, suggesting a potential bias toward formal presentation styles.`,
      `You selected candidates with confident, concise communication ${randomizedPercentage}% of the time, which may reflect an unconscious preference for extroverted personalities.`
    ];
    
    insights.push({
      type: 'communication',
      title: 'Communication Style',
      description: communicationVariants[Math.floor(Math.random() * communicationVariants.length)],
      percentage: randomizedPercentage
    });
    usedTypes.add('communication');
  }
  
  // Interview performance bias
  if (insights.length < 3 && !usedTypes.has('interview')) {
    const randomizedPercentage = randomizePercentage(60, 15);
    const interviewVariants = [
      `${randomizedPercentage}% of your hiring decisions appear influenced by rehearsed interview answers rather than job-relevant experience.`,
      `Your selections show a ${randomizedPercentage}% tendency to favor candidates who present well in interviews, potentially missing those whose skills may not translate to interview performance.`,
      `The data suggests a ${randomizedPercentage}% preference for candidates who display confidence in interviews, which may not always correlate with on-the-job performance.`
    ];
    
    insights.push({
      type: 'interview',
      title: 'Interview Performance',
      description: interviewVariants[Math.floor(Math.random() * interviewVariants.length)],
      percentage: randomizedPercentage
    });
    usedTypes.add('interview');
  }
  
  // Skills-based bias
  if (insights.length < 3 && !usedTypes.has('skills')) {
    const randomizedPercentage = randomizePercentage(65, 15);
    const skillsVariants = [
      `You selected candidates with strong technical backgrounds ${randomizedPercentage}% of the time, potentially undervaluing soft skills like collaboration and adaptability.`,
      `${randomizedPercentage}% of your selections emphasized specialized technical skills over leadership potential and team dynamics.`,
      `The data indicates a ${randomizedPercentage}% preference for candidates with quantifiable skills over those with qualitative strengths like creativity or emotional intelligence.`
    ];
    
    insights.push({
      type: 'skills',
      title: 'Skill Set Preference',
      description: skillsVariants[Math.floor(Math.random() * skillsVariants.length)],
      percentage: randomizedPercentage
    });
    usedTypes.add('skills');
  }
  
  // Personal background bias
  if (insights.length < 3 && !usedTypes.has('personal')) {
    const randomizedPercentage = randomizePercentage(55, 15);
    insights.push({
      type: 'personal',
      title: 'Personal Background Influence',
      description: `${randomizedPercentage}% of selected candidates share similar background elements, suggesting potential affinity bias where we unconsciously favor those who remind us of ourselves.`,
      percentage: randomizedPercentage
    });
    usedTypes.add('personal');
  }
  
  // Return the top 3 insights with randomized order for additional variety
  return insights.slice(0, 3).sort(() => Math.random() - 0.5);
}