const mongoose = require('mongoose');
const Project = require('../models/Project');

describe('Project Model', () => {
  it('should be valid if all required fields are present', async () => {
    const project = new Project({
      title: 'Neural Link',
      description: 'Cybernetic interface',
      author: 'Case'
    });
    const err = project.validateSync();
    expect(err).toBeUndefined();
  });

  it('should be invalid if title is missing', async () => {
    const project = new Project({
      description: 'Cybernetic interface',
      author: 'Case'
    });
    const err = project.validateSync();
    expect(err.errors.title).toBeDefined();
  });

  it('should be invalid if description is missing', async () => {
    const project = new Project({
      title: 'Neural Link',
      author: 'Case'
    });
    const err = project.validateSync();
    expect(err.errors.description).toBeDefined();
  });

  it('should be invalid if author is missing', async () => {
    const project = new Project({
      title: 'Neural Link',
      description: 'Cybernetic interface'
    });
    const err = project.validateSync();
    expect(err.errors.author).toBeDefined();
  });
});
