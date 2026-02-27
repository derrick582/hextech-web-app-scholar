const request = require('supertest');
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const app = require('../index');
const Project = require('../models/Project');
const User = require('../models/User');

let mongoServer;
let token;

jest.setTimeout(30000);

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  await mongoose.disconnect();
  await mongoose.connect(uri);

  // Create a user and get token
  await request(app)
    .post('/api/auth/register')
    .send({
      username: 'testuser',
      password: 'password123'
    });

  const loginRes = await request(app)
    .post('/api/auth/login')
    .send({
      username: 'testuser',
      password: 'password123'
    });

  token = loginRes.body.token;
});

afterAll(async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.disconnect();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
});

beforeEach(async () => {
  await Project.deleteMany({});
});

describe('Projects API', () => {
  it('should get all projects', async () => {
    const res = await request(app).get('/api/projects');
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body)).toBeTruthy();
  });

  it('should create a new project when authenticated', async () => {
    const res = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Test Project',
        description: 'Testing description',
        author: 'Tester'
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.title).toEqual('Test Project');
  });

  it('should fail to create a project when unauthenticated', async () => {
    const res = await request(app)
      .post('/api/projects')
      .send({
        title: 'Fail Project',
        description: 'Testing description',
        author: 'Tester'
      });

    expect(res.statusCode).toEqual(401);
  });

  it('should delete a project when authenticated', async () => {
    const projectRes = await request(app)
      .post('/api/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({
        title: 'Delete Me',
        description: 'To be deleted',
        author: 'Tester'
      });

    const projectId = projectRes.body._id;

    const res = await request(app)
      .delete(`/api/projects/${projectId}`)
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toEqual(200);
    expect(res.body.msg).toEqual('Project removed');
  });
});
