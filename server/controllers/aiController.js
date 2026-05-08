const aiService = require('../services/aiService');
const apiResponse = require('../utils/apiResponse');
const asyncHandler = require('../utils/asyncHandler');

/**
 * AI Controller
 */
const translateText = asyncHandler(async (req, res) => {
  const { text, targetLang } = req.body;
  
  if (!text || !targetLang) {
    return apiResponse.error(res, 'Text and targetLang are required', 400);
  }

  const translatedText = await aiService.translate(text, targetLang);
  return apiResponse.success(res, { translatedText }, 'Translation successful');
});

const analyzeConversation = asyncHandler(async (req, res) => {
  const { transcript } = req.body;

  if (!transcript || !Array.isArray(transcript)) {
    return apiResponse.error(res, 'Transcript array is required', 400);
  }

  const [entities, soap] = await Promise.all([
    aiService.extractEntities(transcript.map(t => t.text).join(' ')),
    aiService.generateSOAP(transcript)
  ]);

  return apiResponse.success(res, { entities, soap }, 'Analysis successful');
});

const chat = asyncHandler(async (req, res) => {
  const { message, history } = req.body;

  if (!message) {
    return apiResponse.error(res, 'Message is required', 400);
  }

  const response = await aiService.chat(message, history || []);
  return apiResponse.success(res, { response }, 'AI response generated');
});

module.exports = {
  translateText,
  analyzeConversation,
  chat
};
