import { useState, useCallback } from 'react';
import api from '../services/api';

/**
 * useTranslation Hook
 * Interfaces with the backend AI service to translate text.
 */
export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLang) => {
    if (!text || !targetLang) return text;
    
    setIsTranslating(true);
    setError(null);

    try {
      const response = await api.post('/ai/translate', { text, targetLang });
      return response.data.translatedText;
    } catch (err) {
      console.error('Translation error:', err);
      setError(err.response?.data?.message || 'Translation failed');
      return text; // Fallback to original text
    } finally {
      setIsTranslating(false);
    }
  }, []);

  return {
    translate,
    isTranslating,
    error
  };
};
