
import { GoogleGenAI, Type } from "@google/genai";
import { Feedback, Sentiment } from "./types";

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Enhanced retry logic with exponential backoff.
 * Targets 429 (Rate Limit) and 500/503 (Server/Transient) errors.
 */
async function withRetry<T>(fn: () => Promise<T>, retries = 2, backoff = 2000): Promise<T> {
  try {
    return await fn();
  } catch (error: any) {
    const status = error.status || error.statusCode;
    const errorMsg = error.message?.toLowerCase() || "";
    
    // Logic to determine if we should retry
    const isRetryable = 
      status === 429 || 
      status === 500 || 
      status === 503 ||
      errorMsg.includes("quota") || 
      errorMsg.includes("xhr error") ||
      errorMsg.includes("rpc failed");

    if (retries > 0 && isRetryable) {
      console.warn(`Retryable error (${status}). Retrying in ${backoff}ms...`);
      await delay(backoff);
      return withRetry(fn, retries - 1, backoff * 2);
    }
    
    // If we're out of retries or it's a fatal error (like 401/403/404), throw the original error
    throw error;
  }
}

export const analyzeSentiment = async (comment: string): Promise<{ sentiment: Sentiment; summary: string }> => {
  try {
    return await withRetry(async () => {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const response = await ai.models.generateContent({
        model: 'gemini-3-flash-preview',
        contents: `Analyze feedback. Sentiment: Positive, Neutral, or Negative. Brief summary. Feedback: "${comment}"`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              sentiment: { type: Type.STRING },
              summary: { type: Type.STRING },
            },
            required: ["sentiment", "summary"],
          },
        },
      });

      const text = response.text || "{}";
      const result = JSON.parse(text.trim());
      return {
        sentiment: result.sentiment as Sentiment,
        summary: result.summary,
      };
    });
  } catch (error: any) {
    console.error("Sentiment analysis fatal error:", error);
    return { sentiment: 'Neutral', summary: 'Analysis unavailable.' };
  }
};

export const generateGlobalInsights = async (feedbacks: Feedback[]) => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataString = feedbacks.slice(0, 20).map(f => `[${f.category}] ${f.rating}*: ${f.comment.substring(0, 150)}`).join('\n');
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Identify top 3 themes and 3 recommendations. Data:\n${dataString}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            topThemes: { type: Type.ARRAY, items: { type: Type.STRING } },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
          },
          required: ["topThemes", "recommendations"],
        },
      },
    });

    const text = response.text || "{}";
    return JSON.parse(text.trim());
  });
};

export const sendChatQuery = async (feedbacks: Feedback[], query: string, history: any[]) => {
  return withRetry(async () => {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const dataString = feedbacks.slice(0, 15).map(f => `${f.userName}: ${f.comment.substring(0, 100)}`).join('\n');

    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: `You are AI Feedback Assistant. Data Context:\n${dataString}\nAnswer questions concisely.`,
      }
    });

    const result = await chat.sendMessage({ message: query });
    return result.text;
  });
};
