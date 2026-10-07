import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/server';
import { db } from '../src/database/db';

let server: http.Server;
let baseUrl = '';

before(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const address = server.address() as any;
      baseUrl = `http://localhost:${address.port}`;
      resolve();
    });
  });
});

after(async () => {
  await new Promise<void>((resolve) => {
    server.close(() => resolve());
  });
});

describe('Backend API End-to-End Integration Tests', () => {
  const testEmail = `agent_${Date.now()}@example.com`;
  const testPassword = 'Password123!';
  let authToken = '';
  let createdScanId = 0;

  test('Public anonymous URL scan works without saving to database', async () => {
    const res = await fetch(`${baseUrl}/api/scans/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.url, 'https://example.com/');
    assert.strictEqual(json.data.riskLevel, 'LOW');
    assert.strictEqual(json.data.id, null); // Anonymous: not saved
  });

  test('User Registration creates new user and returns JWT token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Agent Test User',
        email: testEmail,
        password: testPassword,
        confirmPassword: testPassword
      })
    });

    assert.strictEqual(res.status, 201);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.user.email, testEmail);
    assert.ok(json.data.token);
    authToken = json.data.token;
  });

  test('User Registration rejects duplicate email', async () => {
    const res = await fetch(`${baseUrl}/api/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: 'Duplicate User',
        email: testEmail,
        password: testPassword
      })
    });

    assert.strictEqual(res.status, 400);
    const json = await res.json() as any;
    assert.strictEqual(json.success, false);
    assert.match(json.message, /already exists/);
  });

  test('User Login validates credentials and returns token', async () => {
    const res = await fetch(`${baseUrl}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data.token);
  });

  test('GET /api/auth/me returns authenticated profile', async () => {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.email, testEmail);
  });

  test('Authenticated URL scan saves scan and findings to SQLite', async () => {
    const res = await fetch(`${baseUrl}/api/scans/analyze`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`
      },
      body: JSON.stringify({ url: 'http://192.168.1.10/login' })
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data.id > 0);
    createdScanId = json.data.id;

    // Verify findings were inserted into SQLite
    const findings = db.prepare('SELECT * FROM scan_findings WHERE scan_id = ?').all(createdScanId);
    assert.ok(findings.length > 0);
  });

  test('GET /api/scans returns user scan history', async () => {
    const res = await fetch(`${baseUrl}/api/scans`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data.length >= 1);
    assert.strictEqual(json.data[0].id, createdScanId);
  });

  test('GET /api/scans/:id retrieves specific scan details', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${createdScanId}`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.strictEqual(json.data.id, createdScanId);
    assert.ok(json.data.findings.length > 0);
  });

  test('GET /api/dashboard/stats computes correct statistics', async () => {
    const res = await fetch(`${baseUrl}/api/dashboard/stats`, {
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data.totalScans >= 1);
  });

  test('DELETE /api/scans/:id deletes scan and cascades findings', async () => {
    const res = await fetch(`${baseUrl}/api/scans/${createdScanId}`, {
      method: 'DELETE',
      headers: { 'Authorization': `Bearer ${authToken}` }
    });

    assert.strictEqual(res.status, 200);
    const json = await res.json() as any;
    assert.strictEqual(json.success, true);

    // Verify cascade deletion from SQLite
    const scanRow = db.prepare('SELECT id FROM scans WHERE id = ?').get(createdScanId);
    assert.strictEqual(scanRow, undefined);

    const findings = db.prepare('SELECT id FROM scan_findings WHERE scan_id = ?').all(createdScanId);
    assert.strictEqual(findings.length, 0);
  });
});
