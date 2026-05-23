const axios = require('axios');

/**
 * AIService
 * Handles all AI logic: Translation, NER, and SOAP generation.
 * Uses free HuggingFace Inference API.
 */
class AIService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.baseUrl = 'https://router.huggingface.co/hf-inference/models';
  }

  /**
   * Helper to call OpenAI-compatible Hugging Face Router Chat Completions
   */
  async callLLM(messages, temperature = 0.1) {
    try {
      const response = await axios.post(
        'https://router.huggingface.co/v1/chat/completions',
        {
          model: 'Qwen/Qwen2.5-72B-Instruct',
          messages: messages,
          temperature: temperature,
          max_tokens: 600
        },
        {
          headers: {
            'Authorization': `Bearer ${this.apiKey}`,
            'Content-Type': 'application/json'
          }
        }
      );
      return response.data.choices[0].message.content || '';
    } catch (err) {
      console.error('LLM API Call Error:', err.response?.data || err.message);
      throw err;
    }
  }

  /**
   * Translates text from sourceLang to targetLang using mBART model
   */
  async translate(text, targetLang, sourceLang = 'en') {
    if (!this.apiKey) return text;

    // Language mapping for mBART
    const langMap = {
      'ta': 'ta_IN', // Tamil
      'hi': 'hi_IN', // Hindi
      'te': 'te_IN', // Telugu
      'ml': 'ml_IN', // Malayalam
      'kn': 'kn_IN', // Kannada
      'bn': 'bn_IN', // Bengali
      'en': 'en_XX'  // English
    };

    const target = langMap[targetLang] || 'en_XX';
    const source = langMap[sourceLang] || 'en_XX';

    try {
      const response = await axios.post(
        `${this.baseUrl}/facebook/mbart-large-50-many-to-many-mmt`,
        { 
          inputs: text,
          parameters: { src_lang: source, tgt_lang: target }
        },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );

      return response.data[0].generated_text || text;
    } catch (err) {
      console.error('AI Translation error:', err.message);
      return text;
    }
  }

  /**
   * Extracts Medical Entities (Symptoms, Meds) using NER
   */
  async extractEntities(text) {
    if (!this.apiKey) return { symptoms: [], medications: [] };

    try {
      // Using a specialized medical NER model
      const response = await axios.post(
        `${this.baseUrl}/d4data/biomedical-ner-all`,
        { inputs: text },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );

      const entities = response.data || [];
      return {
        // Filter for symptoms and medications based on medical NER tags
        symptoms: [...new Set(entities.filter(e => ['Sign_symptom', 'Disease_disorder'].includes(e.entity_group)).map(e => e.word.replace(/##/g, '')))] || [],
        medications: [...new Set(entities.filter(e => ['Medication', 'Therapeutic_procedure'].includes(e.entity_group)).map(e => e.word.replace(/##/g, '')))] || []
      };
    } catch (err) {
      console.error('AI NER error:', err.message);
      return { symptoms: [], medications: [] };
    }
  }

  /**
   * Generates SOAP Notes from transcript
   */
  async generateSOAP(transcript) {
    if (!this.apiKey) return null;

    const fullTranscript = transcript.map(t => `${t.speaker}: ${t.originalText || t.text || ''}`).join('\n');
    const systemPrompt = `You are a medical scribe. Convert the conversation into a SOAP note.
Respond in this EXACT JSON format ONLY:
{
  "subjective": "text",
  "objective": "text",
  "assessment": "text",
  "plan": "text"
}`;

    try {
      const generatedText = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Conversation:\n${fullTranscript}` }
      ], 0.1);

      const jsonMatch = generatedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
      return null;
    } catch (err) {
      console.error('AI SOAP generation error:', err.message);
      return null;
    }
  }

  /**
   * Clinical Chat for patient symptom checker
   */
  async chat(message, history) {
    if (!this.apiKey) return "API Key missing. Please configure HUGGINGFACE_API_KEY.";

    const systemPrompt = `You are MediVoice Clinical AI Assistant.
You ONLY answer medical and health questions.
You give accurate, simple, empathetic responses.
Always end with: "Please consult your doctor for a formal diagnosis."`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...history.slice(-4).map(m => ({
        role: m.role === 'user' ? 'user' : 'assistant',
        content: m.content
      })),
      { role: 'user', content: message }
    ];

    try {
      const response = await this.callLLM(messages, 0.3);
      return response.trim() || "I'm sorry, I couldn't process that.";
    } catch (err) {
      console.error('AI Chat Error:', err.message);
      return "I encountered an error connecting to the clinical network. Please consult a doctor.";
    }
  }

  /**
   * Risk Assessment from symptoms
   */
  async assessRisk(symptoms) {
    if (!this.apiKey) return null;

    const systemPrompt = `You are a clinical triage AI.
Analyze these patient symptoms and classify risk level.
Respond in this EXACT JSON format only:
{
  "riskLevel": "RED" or "YELLOW" or "GREEN",
  "riskReason": "one sentence explanation",
  "urgency": "Immediate ER" or "See doctor today" or "Monitor at home",
  "recommendations": ["tip 1", "tip 2", "tip 3"]
}`;

    try {
      const result = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Symptoms: ${symptoms}` }
      ], 0.1);
      
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error('Risk Assessment Error:', err.message);
      return null;
    }
  }

  /**
   * Clinical predictions
   */
  async getPredictions(symptoms, history = '') {
    if (!this.apiKey) return null;

    const systemPrompt = `You are a clinical prediction AI.
Based on the symptoms and history provided, give likely conditions.
Respond in this EXACT JSON format only:
{
  "likelyConditions": [
    {"condition": "name", "probability": "High", "reason": "brief reason"},
    {"condition": "name", "probability": "Medium", "reason": "brief reason"}
  ],
  "recommendedTests": ["test 1", "test 2"],
  "specialistReferral": "specialist type or None"
}`;

    try {
      const result = await this.callLLM([
        { role: 'system', content: systemPrompt },
        { role: 'user', content: `Symptoms: ${symptoms}\nMedical History: ${history || 'Not provided'}` }
      ], 0.1);
      
      const jsonMatch = result.match(/\{[\s\S]*\}/);
      return jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch (err) {
      console.error('Predictions Error:', err.message);
      return null;
    }
  }

  /**
   * Transcribe Audio using HuggingFace Whisper API
   */
  async transcribe(audioBuffer) {
    if (!this.apiKey) return '';
    
    const maxRetries = 3;
    let attempt = 0;

    while (attempt < maxRetries) {
      try {
        const response = await axios.post(
          `${this.baseUrl}/openai/whisper-tiny`,
          audioBuffer,
          {
            headers: {
              Authorization: `Bearer ${this.apiKey}`,
              'Content-Type': 'audio/webm' 
            }
          }
        );
        
        if (response.data && response.data.text) {
          return response.data.text;
        }
        return '';
      } catch (err) {
        if (err.response && err.response.data && err.response.data.error && err.response.data.error.includes('loading')) {
          const waitTime = err.response.data.estimated_time || 5;
          console.log(`Whisper model is loading. Waiting ${waitTime} seconds...`);
          await new Promise(resolve => setTimeout(resolve, Math.min(waitTime * 1000, 5000)));
          attempt++;
        } else {
          console.error('AI Transcription Error:', err.response?.data || err.message);
          throw new Error(err.response?.data?.error || err.message || 'Transcription failed');
        }
      }
    }
    throw new Error('Model took too long to load.');
  }
}

module.exports = new AIService();
