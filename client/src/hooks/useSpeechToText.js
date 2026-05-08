import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * useSpeechToText Hook
 * Uses the native Web Speech API for real-time transcription.
 * 100% Free - No API key required.
 */
export const useSpeechToText = (options = {}) => {
  const { 
    lang = 'en-IN', 
    continuous = true, 
    interimResults = true,
    onTranscriptChange
  } = options;

  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [interimTranscript, setInterimTranscript] = useState('');
  const [error, setError] = useState(null);
  
  const recognitionRef = useRef(null);

  useEffect(() => {
    // Check for browser support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      setError('Speech Recognition is not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = lang;
    recognition.continuous = continuous;
    recognition.interimResults = interimResults;

    recognition.onstart = () => {
      setIsListening(true);
      setError(null);
    };

    recognition.onresult = (event) => {
      let finalTranscript = '';
      let currentInterim = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcriptChunk = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcriptChunk;
        } else {
          currentInterim += transcriptChunk;
        }
      }

      if (finalTranscript) {
        setTranscript(prev => prev + ' ' + finalTranscript);
        if (onTranscriptChange) onTranscriptChange(finalTranscript);
      }
      setInterimTranscript(currentInterim);
    };

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      setError(`Error: ${event.error}`);
      setIsListening(false);
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, [lang, continuous, interimResults, onTranscriptChange]);

  const startListening = useCallback(() => {
    if (recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (err) {
        console.error('Start recognition error:', err);
      }
    }
  }, [isListening]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [isListening]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    setInterimTranscript('');
  }, []);

  return {
    isListening,
    transcript,
    interimTranscript,
    error,
    startListening,
    stopListening,
    resetTranscript,
    setLanguage: (newLang) => {
      if (recognitionRef.current) recognitionRef.current.lang = newLang;
    }
  };
};
