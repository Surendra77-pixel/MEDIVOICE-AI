const axios = require('axios');

/**
 * AIService
 * Handles all AI logic: Translation, NER, and SOAP generation.
 * Uses free HuggingFace Inference API.
 */
class AIService {
  constructor() {
    this.apiKey = process.env.HUGGINGFACE_API_KEY;
    this.baseUrl = 'https://api-inference.huggingface.co/models';
  }

  /**
   * Translates text to target language using mBART model
   */
  async translate(text, targetLang) {
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

    try {
      const response = await axios.post(
        `${this.baseUrl}/facebook/mbart-large-50-many-to-many-mmt`,
        { 
          inputs: text,
          parameters: { src_lang: 'en_XX', tgt_lang: target }
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

    const fullTranscript = transcript.map(t => `${t.speaker}: ${t.text}`).join('\n');
    const prompt = `Convert the following medical conversation into a professional SOAP note (Subjective, Objective, Assessment, Plan):\n\n${fullTranscript}`;

    try {
      const response = await axios.post(
        `${this.baseUrl}/google/flan-t5-base`,
        { inputs: prompt },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );

      const generatedText = response.data[0].generated_text || '';
      
      // Advanced parsing for multi-line SOAP responses
      const sections = ['Subjective', 'Objective', 'Assessment', 'Plan'];
      const result = {};
      
      sections.forEach((section, i) => {
        const nextSection = sections[i + 1];
        const start = generatedText.indexOf(`${section}:`);
        const end = nextSection ? generatedText.indexOf(`${nextSection}:`) : generatedText.length;
        
        if (start !== -1) {
          result[section.toLowerCase()] = generatedText.substring(start + section.length + 1, end).trim();
        } else {
          result[section.toLowerCase()] = '';
        }
      });

      return result;
    } catch (err) {
      console.error('AI SOAP generation error:', err.message);
      return null;
    }
  }

  /**
   * Simple chat for patient symptom checker
   */
  async chat(message, history) {
    const getMockResponse = (msg) => {
      const lowerMsg = msg.toLowerCase();
      if (lowerMsg.includes('headache')) return "I understand you have a headache. Does it feel like a dull ache or sharp pain? Any sensitivity to light?";
      if (lowerMsg.includes('chest pain')) return "Chest pain can be serious. Is it accompanied by shortness of breath or radiating to your left arm?";
      if (lowerMsg.includes('fever')) return "I see you have a fever. How high is your temperature, and are you experiencing chills or body aches?";
      if (lowerMsg.includes('cough')) return "A cough can be uncomfortable. Is it dry or are you coughing up mucus?";
      return "I've noted your concern. Could you tell me more about when these symptoms started and if you have any other symptoms?";
    };

    if (!this.apiKey) {
      return getMockResponse(message);
    }

    try {
      const prompt = `System: You are a clinical assistant. Be helpful but cautious.\nUser: ${message}`;
      const response = await axios.post(
        `${this.baseUrl}/google/flan-t5-base`,
        { inputs: prompt },
        { headers: { Authorization: `Bearer ${this.apiKey}` } }
      );
      
      // If HF returns an HTML error string, it will be caught below
      if (typeof response.data === 'string') {
        throw new Error('Invalid API response');
      }
      
      return response.data[0].generated_text || getMockResponse(message);
    } catch (err) {
      console.error('AI Chat Error (Falling back to mock):', err.message);
      return getMockResponse(message);
    }
  }
}

module.exports = new AIService();
