// OpenRouter API service
const OPENROUTER_API_KEY = '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';

export interface EmotionAnalysis {
  emotion: string;
  confidence: number;
  description: string;
  intensity: 'low' | 'medium' | 'high';
}

export interface MessageRewrite {
  calm: string;
  constructive: string;
  empathetic: string;
}

export class AIService {
  private async callOpenRouter(messages: any[], model = 'openai/gpt-4o-mini') {
    try {
      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.7,
          max_tokens: 1000,
        }),
      });

      if (!response.ok) {
        throw new Error(`OpenRouter API error: ${response.status}`);
      }

      const data = await response.json();
      return data.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenRouter API error:', error);
      throw error;
    }
  }

  async analyzeEmotion(text: string): Promise<EmotionAnalysis> {
    const prompt = `Analyze the emotional content of this text and respond with a JSON object containing:
    - emotion: primary emotion (angry, sad, happy, anxious, frustrated, calm, excited, neutral, etc.)
    - confidence: confidence score from 0-100
    - description: brief description of the emotional state
    - intensity: low, medium, or high

    Text to analyze: "${text}"

    Respond only with valid JSON, no other text.`;

    try {
      const response = await this.callOpenRouter([
        { role: 'user', content: prompt }
      ]);

      // Strip markdown code blocks if present
      const cleanResponse = response.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      const result = JSON.parse(cleanResponse);
      return {
        emotion: result.emotion || 'neutral',
        confidence: result.confidence || 50,
        description: result.description || 'Neutral emotional state',
        intensity: result.intensity || 'medium'
      };
    } catch (error) {
      console.error('Emotion analysis error:', error);
      return {
        emotion: 'neutral',
        confidence: 50,
        description: 'Unable to analyze emotion',
        intensity: 'medium'
      };
    }
  }

  async rewriteMessage(text: string, emotion: string): Promise<MessageRewrite> {
    const prompt = `Given this message with detected emotion "${emotion}", rewrite it in three different ways:

    Original: "${text}"

    Please provide three versions:
    1. Calm: A calmer, more peaceful version
    2. Constructive: A more constructive and solution-focused version  
    3. Empathetic: A more empathetic and understanding version

    Respond with JSON format:
    {
      "calm": "calm version here",
      "constructive": "constructive version here", 
      "empathetic": "empathetic version here"
    }

    Keep the core message intent but improve the tone. Respond only with valid JSON.`;

    try {
      const response = await this.callOpenRouter([
        { role: 'user', content: prompt }
      ]);

      // Strip markdown code blocks if present
      const cleanResponse = response.replace(/```json\s*/, '').replace(/```\s*$/, '').trim();
      return JSON.parse(cleanResponse);
    } catch (error) {
      console.error('Message rewrite error:', error);
      return {
        calm: text,
        constructive: text,
        empathetic: text
      };
    }
  }
}

export const aiService = new AIService();