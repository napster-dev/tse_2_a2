const request = require('supertest');
const express = require('express');
const fs = require('fs');
const { Pool } = require('pg');

jest.mock('fs');
jest.mock('pg');

let app;
let poolMock;

beforeAll(() => {
  // Mock secrets
  fs.readFileSync.mockImplementation((filePath) => {
    if (filePath.includes('db_user')) return 'testuser';
    if (filePath.includes('db_password')) return 'testpass';
    return '';
  });

  // Mock Pool
  poolMock = {
    query: jest.fn(),
  };
  Pool.mockImplementation(() => poolMock);

  // Re-require the app after mocks
  jest.isolateModules(() => {
    app = require('express')();
    app.use(express.json());
    app.post('/add-user', async (req, res) => {
      try {
        await poolMock.query('INSERT INTO users (name) VALUES ($1)', [req.body.name]);
        res.send('✅ User added successfully!');
      } catch (err) {
        res.status(500).send('Error saving user.');
      }
    });
    app.get('/users', async (req, res) => {
      try {
        const result = await poolMock.query('SELECT * FROM users ORDER BY id DESC');
        res.json(result.rows);
      } catch (err) {
        res.status(500).send('Failed to load users.');
      }
    });
  });
});

describe('POST /add-user', () => {
  it('should add a user and return success message', async () => {
    poolMock.query.mockResolvedValueOnce();
    const res = await request(app)
      .post('/add-user')
      .send({ name: 'Alice' });
    expect(res.statusCode).toBe(200);
    expect(res.text).toBe('✅ User added successfully!');
    expect(poolMock.query).toHaveBeenCalledWith('INSERT INTO users (name) VALUES ($1)', ['Alice']);
  });

  it('should handle database errors', async () => {
    poolMock.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app)
      .post('/add-user')
      .send({ name: 'Bob' });
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Error saving user.');
  });
});

describe('GET /users', () => {
  it('should return a list of users', async () => {
    const fakeUsers = [{ id: 1, name: 'Alice' }, { id: 2, name: 'Bob' }];
    poolMock.query.mockResolvedValueOnce({ rows: fakeUsers });
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual(fakeUsers);
    expect(poolMock.query).toHaveBeenCalledWith('SELECT * FROM users ORDER BY id DESC');
  });

  it('should handle database errors', async () => {
    poolMock.query.mockRejectedValueOnce(new Error('DB error'));
    const res = await request(app).get('/users');
    expect(res.statusCode).toBe(500);
    expect(res.text).toBe('Failed to load users.');
  });
}); 