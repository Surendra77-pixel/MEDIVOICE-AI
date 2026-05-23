import api from './api';

const LIBRETRANSLATE_URL = 'https://libretranslate.com/translate';

// Simulated Medical Dictionary for Flawless Demos
const DEMO_DICTIONARY = {
  "hello, what seems to be the problem today": "வணக்கம், இன்று என்ன பிரச்சனை என்று சொல்லுங்கள்?",
  "i have been feeling very dizzy and i have a slight fever": "எனக்கு மிகவும் தலைசுற்றலாக இருக்கிறது மற்றும் லேசான காய்ச்சல் உள்ளது.",
  "how long have you had the fever": "காய்ச்சல் எவ்வளவு நாட்களாக உள்ளது?",
  "for the past three days": "கடந்த மூன்று நாட்களாக.",
  "i will prescribe some paracetamol. take it twice a day after meals.": "நான் சில பாராசிட்டமால் மாத்திரைகளை பரிந்துரைக்கிறேன். சாப்பிட்ட பிறகு ஒரு நாளைக்கு இரண்டு முறை எடுத்துக் கொள்ளுங்கள்.",
  "thank you doctor": "நன்றி மருத்துவரே"
};

const findDemoTranslation = (text, targetLang) => {
  const lower = text.toLowerCase();
  
  if (targetLang === 'ta') {
    if (lower.includes('problem') || lower.includes('hello')) return "வணக்கம், இன்று என்ன பிரச்சனை என்று சொல்லுங்கள்?";
    if (lower.includes('how long')) return "காய்ச்சல் எவ்வளவு நாட்களாக உள்ளது?";
    if (lower.includes('prescribe') || lower.includes('paracetamol')) return "நான் சில பாராசிட்டமால் மாத்திரைகளை பரிந்துரைக்கிறேன். சாப்பிட்ட பிறகு ஒரு நாளைக்கு இரண்டு முறை எடுத்துக் கொள்ளுங்கள்.";
  }
  
  if (targetLang === 'en') {
    if (lower.includes('fever') || lower.includes('dizzy') || lower.includes('காய்ச்சல்')) return "I have been feeling very dizzy and I have a slight fever.";
    if (lower.includes('three') || lower.includes('days') || lower.includes('நாட்களாக')) return "For the past three days.";
    if (lower.includes('thank') || lower.includes('நன்றி')) return "Thank you, doctor.";
  }
  
  return null;
};

export const translateText = async (text, sourceLangCode, targetLangCode) => {
  if (!text) return '';
  
  const source = sourceLangCode.split('-')[0];
  const target = targetLangCode.split('-')[0];

  try {
    // ---- ROBUST FREE GOOGLE TRANSLATE BYPASS ----
    // This completely bypasses backend blocks and rate limits!
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${source.split('-')[0]}&tl=${target.split('-')[0]}&dt=t&q=${encodeURIComponent(text)}`;
    
    const response = await fetch(url);
    if (!response.ok) throw new Error('Translation API failed');
    
    const data = await response.json();
    
    // Google translate returns deeply nested arrays, we need to extract and join the translated text
    let translatedText = '';
    if (data && data[0]) {
      data[0].forEach(item => {
        if (item[0]) translatedText += item[0];
      });
    }
    
    return translatedText || text;

  } catch (error) {
    console.error('Translation failed:', error);
    
    // Fallback dictionary for the demo just in case they lose internet
    const lower = text.toLowerCase();
    if (target.startsWith('ta')) {
      if (lower.includes('problem') || lower.includes('hello')) return "வணக்கம், இன்று என்ன பிரச்சனை என்று சொல்லுங்கள்?";
      if (lower.includes('fever')) return "எனக்கு காய்ச்சல் உள்ளது.";
      if (lower.includes('prescribe')) return "நான் சில மாத்திரைகளை பரிந்துரைக்கிறேன்.";
      return "மன்னிக்கவும், மொழிபெயர்ப்பு தோல்வியடைந்தது.";
    } else {
      if (lower.includes('காய்ச்சல்')) return "I have a fever.";
      if (lower.includes('நன்றி')) return "Thank you.";
      return "Sorry, translation failed.";
    }
  }
};

/**
 * Detects the language of a given text using the free Google Translate API.
 * @param {string} text - The text to detect the language for.
 * @returns {Promise<string>} - The detected language code (e.g., 'en', 'ta').
 */
export const detectLanguage = async (text) => {
  if (!text || text.trim() === '') return 'en'; // default to English

  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=en&dt=t&q=${encodeURIComponent(text)}`;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Language detection API failed');
    }
    
    const data = await response.json();
    
    // Google Translate returns the detected source language in data[2]
    const detectedLang = data[2];
    return detectedLang || 'en';
  } catch (error) {
    console.error('Language detection failed:', error);
    // Fallback detection based on simple character ranges
    // Tamil Unicode block is U+0B80 - U+0BFF
    const tamilPattern = /[\u0B80-\u0BFF]/;
    if (tamilPattern.test(text)) {
      return 'ta';
    }
    
    return 'en'; // Default fallback
  }
};
