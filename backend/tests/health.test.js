const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../index');

describe('GET /API/health', () => {
  it('should return 200 and status active', async () => {
    const res = await request(app).get('/API/health');
    expect(res.statusCode).toEqual(200);
    expect(res.body.status).toBe('active');
    expect(res.body.node).toBe('HEX-CORE-01');
  });

  it('should report database status', async () => {
    const res = await request(app).get('/API/health');
    expect(res.body).toHaveProperty('database');
    expect(res.body).toHaveProperty('db_state');
  });
});
