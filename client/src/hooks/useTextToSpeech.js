import { useState, useCallback, useRef } from 'react';

/**
 * useTextToSpeech Hook
 * Uses native SpeechSynthesis API for voice output.
 * Supports multiple languages and voices.
 */
export const useTextToSpeech = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [error, setError] = useState(null);
  const synthRef = useRef(window.speechSynthesis);

  const speak = useCallback((text, options = {}) => {
    if (!synthRef.current) {
      setError('Speech synthesis not supported');
      return;
    }

    // Cancel any ongoing speech
    synthRef.current.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = options.lang || 'en-IN';
    utterance.pitch = options.pitch || 1;
    utterance.rate = options.rate || 1;
    utterance.volume = options.volume || 1;

    // Optional voice selection
    if (options.voiceName) {
      const voices = synthRef.current.getVoices();
      const selectedVoice = voices.find(v => v.name === options.voiceName);
      if (selectedVoice) utterance.voice = selectedVoice;
    }

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = (e) => {
      setError(e.error);
      setIsSpeaking(false);
    };

    synthRef.current.speak(utterance);
  }, []);

  const stop = useCallback(() => {
    if (synthRef.current) {
      synthRef.current.cancel();
      setIsSpeaking(false);
    }
  }, []);

  const getVoices = useCallback(() => {
    if (!synthRef.current) return [];
    return synthRef.current.getVoices();
  }, []);

  return {
    speak,
    stop,
    isSpeaking,
    error,
    getVoices
  };
};
