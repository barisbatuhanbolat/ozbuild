"use server";

import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const defaultConfig = {
  model: "gpt-3.5-turbo",
  temperature: 1,
  top_p: 0.95,
  max_tokens: 4096,
  response_format: { type: "json_object" } as const
};

async function askGPT(prompt: string) {
  const completion = await openai.chat.completions.create({
    ...defaultConfig,
    messages: [{ role: "user" as const, content: prompt }], 
  });
  
  return completion.choices[0].message.content;
}


interface FormData {
  firstName?: string;
  lastName?: string;
  jobTitle?: string;
  address?: string;
  phone?: string;
  email?: string;
  experience?: {
    title: string;
    companyName: string;
    city: string;
    state: string;
    startDate: string;
    endDate: string;
    workSummary: string;
  }[];
  education?: {
    universityName: string;
    degree: string;
    major: string;
    startDate: string;
    endDate: string;
    description: string;
  }[];
  skills?: {
    name: string;
    rating: number;
  }[];
  summary?: string;
}

export async function generateSummary(formData: FormData, existingSummary?: string) {
  const prompt = formData?.jobTitle
    ? existingSummary
      ? `Enhance and refine the following existing professional summary for ${formData.firstName} ${formData.lastName}, ensuring it stays authentic and reflects their unique voice as a ${formData.jobTitle}:

${existingSummary}

Candidate's Profile:
- Name: ${formData.firstName} ${formData.lastName}
- Current Role: ${formData.jobTitle}
- Education: ${formData.education?.map(edu => `${edu.degree} in ${edu.major} from ${edu.universityName}`).join(', ')}
- Key Skills: ${formData.skills?.map(skill => skill.name).join(', ')}
- Experience: ${formData.experience?.map(exp => `${exp.title} at ${exp.companyName}`).join(', ')}

Create three distinct summaries for the following experience levels while keeping the candidate's authentic tone and perspective:

1. Senior Level (8+ years): Reflects advanced expertise, leadership, and significant achievements.
2. Mid Level (3-7 years): Focuses on growing technical proficiency, contributions, educational background, and emerging leadership skills.
3. Fresher Level (0-2 years): Highlights educational background, technical foundations, and enthusiasm to learn.

Each summary should be 5-6 lines long with detailed and specifically tailored to the ${formData.jobTitle} role. Return the summaries in JSON format as an array of objects, each containing 'experience_level' and 'summary' fields.`
      : `Create professional summaries for ${formData.firstName} ${formData.lastName}'s profile as a ${formData.jobTitle}, reflecting their unique voice and personality.

Candidate's Profile:
- Name: ${formData.firstName} ${formData.lastName}
- Current Role: ${formData.jobTitle}
- Education: ${formData.education?.map(edu => `${edu.degree} in ${edu.major} from ${edu.universityName}`).join(', ')}
- Key Skills: ${formData.skills?.map(skill => skill.name).join(', ')}
- Experience: ${formData.experience?.map(exp => `${exp.title} at ${exp.companyName}`).join(', ')}

Generate three professional summaries for these experience levels:

1. Senior Level (8+ years): Reflects advanced expertise, leadership, and significant achievements.
2. Mid Level (3-7 years): Focuses on growing technical proficiency, contributions, educational background, and emerging leadership skills.
3. Fresher Level (0-2 years): Highlights educational background, technical foundations, and enthusiasm to learn.

Each summary should be 5-6 lines long with detailed, written in the candidate's own words. Return the summaries in JSON format as an array of objects with 'experience_level' and 'summary' fields.`
    : `Craft three distinct professional summaries showcasing diverse personal styles and experience levels (Senior, Mid Level, Fresher). Ensure each summary aligns with the candidate’s natural voice and highlights achievements, skills, and potential.

Format the response as a JSON array with objects containing 'experience_level' and 'summary' fields. Each summary should be 5-6 lines long with detailed and reflect the candidate’s personality authentically.`;

  try {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");

    const experienceLevels = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];

    if (experienceLevels.length === 3 &&
        experienceLevels.every(item => item.experience_level && item.summary)) {
      return experienceLevels;
    } else {
      console.error('Unexpected format or missing summaries:', parsedResult);
      return [];
    }
  } 
  catch (error) {
    console.error('Error in generateSummary:', error);
    return [];
  }
}

export async function generateEducationDescription(educationInfo: string, existingDescription?: string) {
  const prompt = existingDescription
    ? `As an academic advisor, enhance and expand upon the following existing educational description for ${educationInfo}:

${existingDescription}

Please improve these descriptions by:
- Adding more specific academic achievements and projects
- Including relevant coursework and specialized skills gained
- Expanding on leadership roles and extracurricular activities
- Adding specific examples of research or practical work
- Incorporating more details about team projects and collaborations
- Highlighting academic awards, certifications, or recognition
- Maintaining the existing activity levels while enriching the content

Keep the same three activity levels (High, Medium, Low) and provide enhanced versions that build upon the existing content while adding more depth and academic context. Each description should be 4-5 lines long.

Return the enhanced descriptions in the same JSON format as an array of objects with 'activity_level' and 'description' fields.`
    : `As an academic advisor, create detailed educational narratives based on my studies at ${educationInfo}. Consider three levels of academic engagement:

High Activity:
- Leadership roles in student organizations and academic clubs
- Research projects or thesis work
- Academic competitions or honors programs
- Extracurricular activities showing initiative
- Notable academic achievements with specific examples

Medium Activity:
- Regular participation in student groups
- Collaborative project work
- Balanced academic and extracurricular involvement
- Consistent academic performance
- Relevant coursework and practical applications

Low Activity:
- Focus on core academic requirements
- Individual project work
- Basic course participation
- Personal development activities
- Academic milestones and achievements

Create an array of JSON objects with 'activity_level' and 'description' fields. Each description should be 4-5 lines, written in first person, and include subtle references to above-average academic performance without being boastful. Use specific examples relevant to ${educationInfo} while maintaining authenticity.`;

  try {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");
    
    const activities = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];

    return activities.every(item => item.activity_level && item.description) 
      ? activities 
      : [];
  } 
  catch (error) {
    console.error('Error in generateEducationDescription:', error);
    return [];
  }
}


export async function generateExperienceDescription(experienceInfo: string, existingWorkSummary?: string) {
  const prompt = existingWorkSummary
    ? `As a career counselor, enhance and expand upon the following existing work experience for the role of ${experienceInfo}:

${existingWorkSummary}

Please improve these descriptions by:
- Adding more specific technical achievements and project outcomes
- Including quantifiable metrics and KPIs
- Expanding on leadership initiatives and team management
- Adding specific examples of problem-solving
- Incorporating more details about tools and technologies used
- Highlighting awards, promotions, or recognition
- Adding impact on business objectives and company growth
- Maintaining the existing activity levels while enriching the content

Keep the same three activity levels (High, Medium, Low) and provide enhanced versions that build upon the existing content while adding more depth and professional context. 
Each description should be 4-5 sentences long.

Return the enhanced descriptions in the same JSON format as an array of objects with 'activity_level' and 'description' fields.`
    : `As a career counselor, create detailed professional narratives for my role as ${experienceInfo}. Consider three levels of job engagement and responsibility:

High Activity:
- Leadership and strategic initiatives
- Project management and team coordination
- Innovation and process improvements
- Client or stakeholder relationships
- Measurable achievements and impacts

Medium Activity:
- Project execution and team collaboration
- Process optimization and problem-solving
- Regular client or stakeholder interaction
- Skill development and mentoring
- Consistent performance metrics

Low Activity:
- Core job responsibilities
- Individual contributions
- Team support activities
- Professional development
- Basic achievements

Create an array of JSON objects with 'activity_level' and 'description' fields. Each description should be 4-5 sentences long, written in first person, highlighting specific accomplishments and skills relevant to ${experienceInfo}. Include concrete examples and quantifiable results where possible, avoiding placeholder text. Focus on how each activity level contributed to the organization's goals.`;

  try {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");
    
    const activities = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];

    return activities.every(item => item.activity_level && item.description) 
      ? activities 
      : [];
  } 
  catch (error) {
    console.error('Error in generateExperienceDescription:', error);
    return [];
  }
}