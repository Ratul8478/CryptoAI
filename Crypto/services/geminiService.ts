
import { GoogleGenAI, Type } from "@google/genai";
import type { PortfolioHolding, NewsArticle, OtpResponse } from '../types';

// Ensure API_KEY is available in the environment variables
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const systemInstruction = `You are "AIChainX Assistant," a sophisticated and helpful crypto trading expert integrated into the AIChainX platform. Your goal is to provide users with insightful, data-driven, and clear analysis of the cryptocurrency market.

Your primary functions are:
1.  **Market Analysis:** Provide real-time analysis of crypto trends, price movements, and market sentiment.
2.  **Predictive Insights:** Offer potential future scenarios for specific cryptocurrencies based on available data.
3.  **Educational Content:** Explain complex trading concepts, technical indicators, and blockchain technology in simple terms.
4.  **Strategy Suggestions:** Suggest trading strategies (e.g., dollar-cost averaging, swing trading) based on user queries, but always include a disclaimer.

**CRITICAL RULES:**
- **NEVER GIVE FINANCIAL ADVICE.** Always end your responses with a disclaimer: "This is not financial advice. Please conduct your own research and consult with a qualified professional before making any investment decisions."
- **BE OBJECTIVE AND DATA-DRIVEN.** Base your analysis on market data, trends, and established indicators. Avoid hype or speculation.
- **USE CLEAR FORMATTING.** Use markdown (bold, italics, lists) to structure your answers for maximum readability.
- **KEEP IT CONCISE.** Provide direct and to-the-point answers.`;

export const getAIAssistantResponse = async (prompt: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
            temperature: 0.7,
            topP: 1,
            topK: 1,
            systemInstruction: systemInstruction,
        },
    });
    return response.text;
  } catch (error) {
    console.error("Gemini API error:", error);
    return "Sorry, I'm having trouble connecting to the AI service. Please try again later.";
  }
};

export const getMarketSentiment = async (cryptoName: string): Promise<string> => {
    const prompt = `Analyze the current market sentiment for ${cryptoName}. Is it generally considered bullish, bearish, or neutral right now? Provide a brief one-paragraph explanation summarizing the key factors influencing this sentiment, such as recent news, technical indicators, or market trends.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a market sentiment analyst. Provide a concise, one-paragraph analysis. Do not include a disclaimer.",
                temperature: 0.5
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error on sentiment analysis:", error);
        return `Could not fetch sentiment for ${cryptoName}.`;
    }
};

export const getNewsFeed = async (): Promise<NewsArticle[]> => {
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: "Generate 5 recent, realistic-sounding crypto news headlines. For each, provide a 'headline' and a 'category' from ['DeFi', 'Regulation', 'Market', 'Technology'].",
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            headline: { type: Type.STRING },
                            category: { type: Type.STRING }
                        },
                        required: ["headline", "category"]
                    }
                }
            }
        });
        const jsonText = response.text.trim();
        const json = JSON.parse(jsonText);
        return json;
    } catch (error) {
        console.error("Gemini API error on news feed:", error);
        return [{ headline: "Could not fetch news. AI service may be down.", category: "Error" }];
    }
};

export const getNewsSummary = async (headline: string): Promise<string> => {
    const prompt = `Given the news headline: "${headline}", please write a concise, one-paragraph summary of the imagined news article. Make it sound professional and informative.`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: { temperature: 0.6 }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error on news summary:", error);
        return "Could not generate summary.";
    }
};

export const getPortfolioAnalysis = async (portfolio: PortfolioHolding[]): Promise<string> => {
    const portfolioString = portfolio.map(p => `${p.amount} ${p.symbol} (valued at $${p.value.toFixed(2)})`).join(', ');
    const prompt = `Analyze this crypto portfolio: ${portfolioString}. Provide a brief, two-sentence analysis of its diversification and risk profile, followed by one key suggestion as a bullet point. Example: "Your portfolio shows a heavy concentration in Bitcoin... This indicates a high-risk, high-reward strategy...\\n\\n* Suggestion: Consider diversifying into an L2 or DeFi token to balance your exposure."`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                systemInstruction: "You are a helpful but cautious portfolio analyst. Do not give financial advice. Use markdown for formatting.",
                temperature: 0.5
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error on portfolio analysis:", error);
        return "Could not analyze portfolio.";
    }
};

export const getShortTermPrediction = async (cryptoName: string): Promise<string> => {
    const prompt = `Provide a very brief, speculative short-term price outlook (next 24-48 hours) for ${cryptoName}. Start the response with one word: "Bullish", "Bearish", or "Neutral", followed by a colon and a short 10-15 word reasoning. Example: "Bullish: Positive market sentiment and recent tech upgrades could push prices higher."`;
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.8
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error on prediction:", error);
        return "Prediction: Unavailable.";
    }
};

export const getTraderTradingPlan = async (traderName: string, tradingStyle: string): Promise<string> => {
    const prompt = `You are a quantitative trading plan generator.
    Based on the following trader profile, create a detailed and professional-sounding trading plan.
    The output should be in markdown format.

    **Trader Name:** ${traderName}
    **Trading Style:** ${tradingStyle}

    Generate a plan that includes these sections:
    1.  **Objective:** A clear, one-sentence goal.
    2.  **Core Strategy:** A brief paragraph explaining the primary approach.
    3.  **Key Indicators:** A bulleted list of 3-4 technical indicators they would use.
    4.  **Risk Management:** A bulleted list of 2-3 rules for managing risk.
    5.  **Example Trade Setup:** A brief, hypothetical trade scenario (entry, take profit, stop loss).

    Make the plan sound sophisticated and specific to their stated trading style.`;
    
    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.6,
            }
        });
        return response.text;
    } catch (error) {
        console.error("Gemini API error on trading plan generation:", error);
        return "Could not generate trading plan at this time.";
    }
};

export const generateImage = async (prompt: string, aspectRatio: string, numberOfImages: number): Promise<string[]> => {
    try {
        const response = await ai.models.generateImages({
            model: 'imagen-3.0-generate-002',
            prompt: prompt,
            config: {
                numberOfImages: numberOfImages,
                outputMimeType: 'image/jpeg',
                aspectRatio: aspectRatio,
            },
        });

        if (response.generatedImages && response.generatedImages.length > 0) {
            return response.generatedImages.map(img => img.image.imageBytes);
        }
        return [];
    } catch (error) {
        console.error("Gemini API error on image generation:", error);
        throw new Error("Failed to generate image. The AI service may be unavailable or the prompt may have been rejected.");
    }
};

export const generateOtpSms = async (mobile: string): Promise<OtpResponse> => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const prompt = `You are a security system for a platform called AIChainX. 
    A user with the mobile number "${mobile}" has requested a login code.
    Your one job is to generate a standard-looking SMS verification message body.
    The verification code MUST be: ${otp}
    
    The response must be just the SMS body text.
    It should be short and direct. For example: "Your AIChainX verification code is: ${otp}. It is valid for 10 minutes."
    Do not include salutations like "Hi there".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2,
            }
        });
        return {
            otp: otp,
            body: response.text,
        };
    } catch (error) {
        console.error("Gemini API error on OTP SMS generation:", error);
        // Fallback
        return {
            otp: otp,
            body: `Your AIChainX verification code is: ${otp}. It is valid for 10 minutes.`,
        };
    }
};


export const generateOtpEmail = async (email: string): Promise<OtpResponse> => {
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const prompt = `You are a security system for a platform called AIChainX. 
    A user with the email "${email}" has requested a login code.
    Your one job is to generate a standard-looking verification email body.
    The verification code MUST be: ${otp}
    
    The response must be just the email body text, starting with "Hi there,".
    Include the code clearly. Mention that the code is valid for 10 minutes.
    End with "Thanks, The AIChainX Team".`;

    try {
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash",
            contents: prompt,
            config: {
                temperature: 0.2,
            }
        });
        return {
            otp: otp,
            body: response.text,
        };
    } catch (error) {
        console.error("Gemini API error on OTP generation:", error);
        // Fallback in case AI fails
        return {
            otp: otp,
            body: `Hi there,

Your AIChainX verification code is: ${otp}

This code is valid for 10 minutes.

Thanks,
The AIChainX Team`,
        };
    }
};