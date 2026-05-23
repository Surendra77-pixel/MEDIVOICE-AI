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

  // Check if there are symptoms to trigger a full clinical analysis
  const symptomKeywords = ['pain', 'fever', 'cough', 'headache', 'fatigue', 'nausea', 'vomit', 'dizzy', 'chest', 'breath', 'weak', 'swell', 'rash', 'itch', 'cold', 'throat', 'stomach', 'back', 'joint', 'muscle', 'tired', 'sleep', 'appetite'];
  const hasSymptoms = symptomKeywords.some(s => message.toLowerCase().includes(s));

  let response, risk, predictions;

  if (hasSymptoms) {
    [response, risk, predictions] = await Promise.all([
      aiService.chat(message, history || []),
      aiService.assessRisk(message),
      aiService.getPredictions(message)
    ]);
  } else {
    response = await aiService.chat(message, history || []);
  }

  return apiResponse.success(res, { 
    response,
    analysis: hasSymptoms ? { risk, predictions } : null
  }, 'AI response generated');
});

const axios = require('axios');

const transcribeAudio = asyncHandler(async (req, res) => {
  try {
    const audioBuffer = req.body;
    const langCode = req.query.lang || 'en';
    
    if (!audioBuffer || audioBuffer.length === 0) {
      return apiResponse.error(res, 'No audio data received', 400);
    }

    // Call HuggingFace Serverless Inference API directly with the binary audio
    const response = await fetch('https://router.huggingface.co/hf-inference/models/openai/whisper-large-v3-turbo', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
        'Content-Type': 'audio/webm'
      },
      body: audioBuffer
    });

    const data = await response.json();
    
    if (data.text) {
      return apiResponse.success(res, { text: data.text }, 'Transcription successful');
    } else {
      console.error("HF STT Error:", data);
      return apiResponse.error(res, data.error?.message || 'Transcription failed', 500);
    }
  } catch (error) {
    console.error("Proxy STT Error:", error.message);
    return apiResponse.error(res, 'Error communicating with AI transcription server', 500);
  }
});

const textToSpeech = asyncHandler(async (req, res) => {
  const { text, lang } = req.query;

  if (!text || !lang) {
    return apiResponse.error(res, 'Text and lang query parameters are required', 400);
  }

  try {
    const ttsLang = lang.split('-')[0];
    const url = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(text)}&tl=${ttsLang}&client=tw-ob`;

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });

    res.set({
      'Content-Type': 'audio/mpeg',
      'Content-Length': response.data.length,
      'Cache-Control': 'no-cache'
    });

    return res.send(response.data);
  } catch (error) {
    console.error("Backend TTS Error:", error.message);
    return apiResponse.error(res, 'Failed to generate speech audio', 500);
  }
});

const fs = require('fs');
const path = require('path');

const saveReport = asyncHandler(async (req, res) => {
  const { patientInfo, transcript } = req.body;

  if (!patientInfo || !transcript || !Array.isArray(transcript)) {
    return apiResponse.error(res, 'Patient info and transcript array are required', 400);
  }

  try {
    const { name, age, gender, notes } = patientInfo;
    const now = new Date();
    const formattedDate = now.toLocaleString();
    
    let reportContent = `============================================================\n`;
    reportContent += `MEDIVOICE AI - CONSULTATION REPORT\n`;
    reportContent += `============================================================\n`;
    reportContent += `Date: ${formattedDate}\n`;
    reportContent += `Patient Name: ${name || 'N/A'}\n`;
    reportContent += `Age: ${age || 'N/A'}\n`;
    reportContent += `Gender: ${gender || 'N/A'}\n`;
    reportContent += `Notes: ${notes || 'N/A'}\n`;
    reportContent += `============================================================\n\n`;
    
    reportContent += `CONVERSATION TRANSCRIPT:\n`;
    reportContent += `------------------------------------------------------------\n`;
    
    transcript.forEach((msg, idx) => {
      const roleName = msg.speaker === 'person1' ? 'Patient' : 'Doctor';
      reportContent += `[#${idx + 1}] ${roleName} (${msg.sourceLang}):\n`;
      reportContent += `  Original:    ${msg.original}\n`;
      reportContent += `  Translation: ${msg.translated} (${msg.targetLang})\n\n`;
    });
    
    reportContent += `============================================================\n`;
    
    const reportsDir = path.join(__dirname, '../reports');
    if (!fs.existsSync(reportsDir)) {
      fs.mkdirSync(reportsDir, { recursive: true });
    }
    
    const safeName = (name || 'Anonymous').replace(/[^a-zA-Z0-9]/g, '_');
    const timestamp = now.toISOString().replace(/[:.]/g, '-');
    const filename = `Report_${safeName}_${timestamp}.txt`;
    const filePath = path.join(reportsDir, filename);
    
    fs.writeFileSync(filePath, reportContent, 'utf8');
    
    return apiResponse.success(res, { filename, filePath }, 'Report saved successfully locally.');
  } catch (error) {
    console.error("Save Report Error:", error.message);
    return apiResponse.error(res, 'Failed to save report locally: ' + error.message, 500);
  }
});

const listReports = asyncHandler(async (req, res) => {
  const reportsDir = path.join(__dirname, '../reports');
  
  try {
    if (!fs.existsSync(reportsDir)) {
      return apiResponse.success(res, [], 'No reports exist yet.');
    }
    
    const files = fs.readdirSync(reportsDir);
    const reports = files
      .filter(file => file.startsWith('Report_') && file.endsWith('.txt'))
      .map(file => {
        const filePath = path.join(reportsDir, file);
        const stats = fs.statSync(filePath);
        return {
          filename: file,
          createdAt: stats.birthtime,
          size: stats.size
        };
      })
      .sort((a, b) => b.createdAt - a.createdAt);
      
    return apiResponse.success(res, reports, 'Reports fetched successfully.');
  } catch (error) {
    console.error("List Reports Error:", error.message);
    return apiResponse.error(res, 'Failed to list reports: ' + error.message, 500);
  }
});

const getReportContent = asyncHandler(async (req, res) => {
  const { filename } = req.params;
  const reportsDir = path.join(__dirname, '../reports');
  const filePath = path.join(reportsDir, filename);
  
  if (!filename.startsWith('Report_') || !filename.endsWith('.txt') || filename.includes('..')) {
    return apiResponse.error(res, 'Invalid report filename', 400);
  }

  try {
    if (!fs.existsSync(filePath)) {
      return apiResponse.error(res, 'Report file not found', 404);
    }
    
    const content = fs.readFileSync(filePath, 'utf8');
    return apiResponse.success(res, { content }, 'Report content fetched successfully.');
  } catch (error) {
    console.error("Get Report Error:", error.message);
    return apiResponse.error(res, 'Failed to fetch report: ' + error.message, 500);
  }
});

module.exports = {
  translateText,
  analyzeConversation,
  chat,
  transcribeAudio,
  textToSpeech,
  saveReport,
  listReports,
  getReportContent
};

