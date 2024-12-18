"use server";
import { Console } from "console";
import { readSync } from "fs";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

const defaultConfig = {
  model: "gpt-3.5-turbo",
  temperature: 1,
  top_p: 0.95,
  max_tokens: 4096,
  response_format: { type: "json_object" } as const  // Type assertion to make it a literal type
};

async function askGPT(prompt: string) {
  const completion = await openai.chat.completions.create({
    ...defaultConfig,
    messages: [{ role: "user" as const, content: prompt }],  // Type assertion for role
  });
  
  return completion.choices[0].message.content;
}

interface ExperienceLevel {
  experience_level: string;
  summary: string;
}

interface Activity {
  activity_level: string;
  description: string;
}

export async function generateSummary(jobTitle: string) {
  const prompt = jobTitle && jobTitle !== ""
    ? `Given the job title '${jobTitle}', provide a summary for three experience levels: Senior, Mid Level, and Fresher. Each summary should be detailed and 4-5 lines long and include the experience level and the corresponding summary in JSON format. The output should be an array of objects, each containing 'experience_level' and 'summary' fields. Ensure the summaries are tailored to each experience level.`
    : `Create a 3-4 line summary about myself for my resume, emphasizing my personality, social skills, and interests outside of work. The output should be an array of JSON object with exact this template [{"experience_level": "Senior", "summary": "Text goes here"}, {"experience_level": "Mid Level", "summary": "Text goes here"}, {"experience_level": "Fresher", "summary": "Text goes here"}, each containing 'experience_level' and 'summary' fields representing Active, Average, and Lazy personality traits. Use example hobbies if needed but do not insert placeholders for me to fill in.`;

  try {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");
    
    const experienceLevels = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];

    return experienceLevels.every(item => item.experience_level && item.summary) 
      ? experienceLevels 
      : [];

  } 
  catch (error) 
  {
    console.error('Error in generateSummary:', error);
    return [];
  }
}

export async function generateEducationDescription(educationInfo: string) {
  const prompt = `Based on my education at ${educationInfo}, provide personal descriptions for three levels of curriculum activities: High Activity, Medium Activity, and Low Activity. Each description should be detailed and 4-5 lines long and written from my perspective, reflecting on past experiences. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Please include a subtle hint about my good (but not the best) results.`;

  try 
  {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");
    
    const activities = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];

    return activities.every(item => item.activity_level && item.description) 
      ? activities 
      : [];

  } 
  catch (error) 
  {
    console.error('Error in generateEducationDescription:', error);
    return [];
  }
}

export async function generateExperienceDescription(experienceInfo: string) {
  const prompt = `Given that I have experience working as ${experienceInfo}, provide a summary of three levels of activities I performed in that position, preferably as a list: High Activity, Medium Activity, and Low Activity. Each summary should be detailed and 4-5 lines long and written from my perspective, reflecting on my past experiences in that workplace. The output should be an array of JSON objects, each containing 'activity_level' and 'description' fields. Use example work samples if needed, but do not insert placeholders for me to fill in.`;

  try 
  {
    const result = await askGPT(prompt);
    const parsedResult = JSON.parse(result || "[]");
    const activities = Array.isArray(parsedResult) 
      ? parsedResult 
      : Object.values(parsedResult).find(Array.isArray) || [];
    
    return activities.every(item => item.activity_level && item.description) 
      ? activities 
      : [];

  } 
  catch (error) 
  {
    console.error('Error in generateExperienceDescription:', error);
    return [];
  }
}