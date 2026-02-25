const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const Project = require('./models/Project');

async function verify() {
  let mongoServer;
  try {
    console.log('Starting MongoDB Memory Server...');
    mongoServer = await MongoMemoryServer.create();
    const uri = mongoServer.getUri();

    console.log('Connecting to in-memory database...');
    await mongoose.connect(uri);
    console.log('Connected!');

    console.log('Testing Project model...');
    const testProject = new Project({
      title: 'Neural Interface',
      description: 'A direct brain-to-computer communication link.',
      author: 'ZeroCool'
    });

    await testProject.save();
    console.log('Project saved successfully.');

    const foundProject = await Project.findOne({ title: 'Neural Interface' });
    if (foundProject && foundProject.author === 'ZeroCool') {
      console.log('Project retrieved successfully.');
      console.log('Database Verification: SUCCESS');
    } else {
      throw new Error('Project retrieval failed or data mismatch.');
    }

  } catch (err) {
    console.error('Database Verification: FAILED');
    console.error(err);
    process.exit(1);
  } finally {
    if (mongoose.connection.readyState !== 0) {
      await mongoose.disconnect();
    }
    if (mongoServer) {
      await mongoServer.stop();
    }
  }
}

verify();
