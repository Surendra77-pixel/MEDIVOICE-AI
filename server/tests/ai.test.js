const request = require('supertest');
const express = require('express');
const aiRoutes = require('../routes/aiRoutes');
const { verifyToken } = require('../middleware/authMiddleware');

// Mock auth middleware to bypass token check
jest.mock('../middleware/authMiddleware', () => ({
  verifyToken: (req, res, next) => {
    req.user = { id: 'test-user-id', role: 'doctor' };
    next();
  }
}));

// Mock AIService
jest.mock('../services/aiService', () => ({
  translate: jest.fn().mockResolvedValue('Translated text from AI'),
  extractEntities: jest.fn().mockResolvedValue({ 
    symptoms: ['headache', 'fever'], 
    medications: ['paracetamol'] 
  }),
  generateSOAP: jest.fn().mockResolvedValue({
    subjective: 'Patient reports headache.',
    objective: 'Normal vitals.',
    assessment: 'Viral fever.',
    plan: 'Prescribed rest.'
  })
}));

const app = express();
app.use(express.json());
app.use('/api/v1/ai', aiRoutes);

describe('AI API Endpoints', () => {
  it('POST /api/v1/ai/translate should return translated text', async () => {
    const res = await request(app)
      .post('/api/v1/ai/translate')
      .send({ text: 'Hello', targetLang: 'hi' });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.translatedText).toBe('Translated text from AI');
  });

  it('POST /api/v1/ai/analyze should return entities and soap', async () => {
    const res = await request(app)
      .post('/api/v1/ai/analyze')
      .send({ 
        transcript: [
          { speaker: 'Patient', text: 'I have a headache' },
          { speaker: 'Doctor', text: 'Take paracetamol' }
        ] 
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data.entities.symptoms).toContain('headache');
    expect(res.body.data.soap.assessment).toBe('Viral fever.');
  });

  it('POST /api/v1/ai/analyze should return 400 if transcript is missing', async () => {
    const res = await request(app).post('/api/v1/ai/analyze').send({});
    expect(res.statusCode).toEqual(400);
  });
});
