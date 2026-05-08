const request = require('supertest');
const express = require('express');
const authRoutes = require('../routes/authRoutes');
const User = require('../models/User');

// Mock Dependencies
jest.mock('../models/User');
jest.mock('../services/emailService', () => ({
  sendOTP: jest.fn().mockResolvedValue(true),
  sendWelcomeEmail: jest.fn().mockResolvedValue(true)
}));

const app = express();
app.use(express.json());
app.use('/api/v1/auth', authRoutes);

describe('Authentication API (Mocked DB)', () => {
  const testUser = {
    email: 'test@medivoice.ai',
    password: 'Password123!',
    firstName: 'Test',
    lastName: 'User',
    role: 'patient'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('POST /api/v1/auth/signup should create a new user', async () => {
    User.findOne.mockResolvedValue(null);
    User.prototype.save = jest.fn().mockResolvedValue({
      ...testUser,
      _id: 'mock-id'
    });

    const res = await request(app)
      .post('/api/v1/auth/signup')
      .send(testUser);

    expect(res.statusCode).toEqual(201);
    expect(res.body.data.user.email).toBe(testUser.email);
  });

  it('POST /api/v1/auth/login should return tokens', async () => {
    User.findOne.mockResolvedValue({
      ...testUser,
      _id: 'mock-id',
      isEmailVerified: true,
      comparePassword: jest.fn().mockResolvedValue(true)
    });

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: testUser.email,
        password: testUser.password
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.data).toHaveProperty('accessToken');
  });

  it('POST /api/v1/auth/login should fail if user not found', async () => {
    User.findOne.mockResolvedValue(null);

    const res = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'wrong@user.com',
        password: 'any'
      });

    expect(res.statusCode).toEqual(401);
  });
});
