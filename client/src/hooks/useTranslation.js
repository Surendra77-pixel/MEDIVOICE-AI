import { useState, useCallback } from 'react';
import { translateText } from '../services/translateService';

/**
 * useTranslation Hook
 * Interfaces with the new translate service (LibreTranslate with Backend fallback).
 */
export const useTranslation = () => {
  const [isTranslating, setIsTranslating] = useState(false);
  const [error, setError] = useState(null);

  const translate = useCallback(async (text, targetLang, sourceLang = 'en') => {
    if (!text || !targetLang) return text;
    
    setIsTranslating(true);
    setError(null);

    try {
      const translated = await translateText(text, sourceLang, targetLang);
      return translated;
    } catch (err) {
      console.error('Translation Hook Error:', err);
      setError(err.message);
      return text;
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
