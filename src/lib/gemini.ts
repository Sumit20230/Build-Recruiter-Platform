import { GoogleGenerativeAI } from "@google/generative-ai";
import { ERROR_MESSAGES, GEMINI_MODELS } from "./constants";

const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
// Initialize with the stable v1 API
const genAI = new GoogleGenerativeAI(apiKey || "");

export async function askAboutRecruiter(
  recruiterContext: string,
  chatHistory: { role: "user" | "model"; parts: string }[],
  userMessage: string,
) {
  if (!apiKey) {
    throw new Error(ERROR_MESSAGES.GEMINI_API_KEY_MISSING);
  }

  // Model names and instructions
  const systemInstruction = `You are a helpful assistant on a hiring platform.
Answer questions about the following recruiter ONLY based on the information provided below.
Do not fabricate any information. If something isn't mentioned in the profile, say so politely.
Keep answers concise and helpful for a jobseeker evaluating whether to engage with this recruiter.

Recruiter Profile Data:
${recruiterContext}`;

  const model = genAI.getGenerativeModel({
    model: GEMINI_MODELS.DEFAULT,
  });

  try {
    const history = chatHistory.slice(-10).map((message) => ({
      role: message.role,
      parts: [{ text: message.parts }],
    }));

    // Prepend the system context to the user message to ensure the model 
    // stays focused on the recruiter's profile data without using the 
    // problematic 'systemInstruction' field.
    const prompt = `Context for this conversation:
${systemInstruction}

User Question: ${userMessage}`;

    const chat = model.startChat({ history });
    const result = await chat.sendMessage(prompt);
    return result.response.text();
  } catch (error) {
    console.error("[gemini] Error sending message:", error);
    if (error instanceof Error) {
      if (error.message.includes("API key")) {
        throw new Error("Invalid or missing Gemini API key. Please check your environment variables.");
      }
      if (error.message.includes("quota") || error.message.includes("429")) {
        throw new Error(ERROR_MESSAGES.GEMINI_QUOTA_EXCEEDED);
      }
      throw new Error(`AI Error: ${error.message}`);
    }
    throw new Error(ERROR_MESSAGES.GEMINI_GENERIC_ERROR);
  }
}

export async function analyzeResume(
  recruiterContext: string,
  resumeText: string
) {
  if (!apiKey) throw new Error(ERROR_MESSAGES.GEMINI_API_KEY_MISSING);

  const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.DEFAULT });
  const prompt = `You are an expert career advisor. Analyze the candidate's resume text against the recruiter's profile and job context.
  
Recruiter/Job Context:
${recruiterContext}

Candidate Resume:
${resumeText}

Provide a response in the following format:
1. Match Score: (0-100%)
2. Brief Summary: (Why it's a match or why not)
3. Key Skills Gap: (What is missing that this recruiter looks for)
4. Recommended Improvements: (Top 2-3 suggestions)`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("[gemini] Resume analysis error:", error);
    throw new Error("Failed to analyze resume.");
  }
}

export async function generateInterviewStrategy(
  recruiterContext: string
) {
  if (!apiKey) throw new Error(ERROR_MESSAGES.GEMINI_API_KEY_MISSING);

  const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.DEFAULT });
  const prompt = `Analyze this recruiter's profile and provide a candidate "Cheat Sheet":
  
Recruiter Context:
${recruiterContext}

Provide:
1. Top 5 Questions to Ask: (Tailored to this recruiter's background and roles)
2. Pitch Strategy: (What aspect of a candidate's background would impress them most?)
3. Niche Insights: (What are they likely looking for based on their current activity?)`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("[gemini] Interview strategy error:", error);
    throw new Error("Failed to generate strategy.");
  }
}

export async function generateOutreach(
  recruiterContext: string,
  candidateBio: string
) {
  if (!apiKey) throw new Error(ERROR_MESSAGES.GEMINI_API_KEY_MISSING);

  const model = genAI.getGenerativeModel({ model: GEMINI_MODELS.DEFAULT });
  const prompt = `Generate a high-conversion, professional LinkedIn connection request or email for this recruiter.
  
Recruiter Context:
${recruiterContext}

Candidate Context/Bio:
${candidateBio}

The message should:
1. Be concise (under 300 characters for LinkedIn or slightly longer for email).
2. Reference something specific from the recruiter's profile.
3. Clearly state the value proposition.
4. Provide a professional LinkedIn request option AND a professional Email option.`;

  try {
    const result = await model.generateContent(prompt);
    return result.response.text();
  } catch (error) {
    console.error("[gemini] Outreach generation error:", error);
    throw new Error("Failed to generate outreach script.");
  }
}


