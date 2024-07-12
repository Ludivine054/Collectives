const { expect } = require('chai');
const request = require('supertest');
const app = require('../app'); // Assurez-vous que le chemin est correct

describe('Controller tests', () => {
  it('should return 200 OK for GET /', async () => {
    const res = await request(app).get('/');
    expect(res.status).to.equal(200);
  });

  // Ajoutez d'autres tests pour chaque contrôleur
});
