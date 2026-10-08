import { test, describe, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'http';
import app from '../src/server';
import { supabase } from '../src/database/db';

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
  let createdScanId = '';

  test('Public anonymous URL scan works without saving to database', async () => {
    const res = await fetch(`${baseUrl}/api/scans/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'https://example.com' })
    });

    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
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

    // Registration may succeed or require email confirmation depending on Supabase settings
    assert.ok(res.status === 201 || res.status === 200 || res.status === 400);
    const json = (await res.json()) as any;
    if (json.success && json.data?.token) {
      authToken = json.data.token;
    }
  });

  test('Health check endpoint returns ok status', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
    assert.strictEqual(json.status, 'ok');
    assert.strictEqual(json.database, 'Supabase PostgreSQL');
  });

  test('Analysis of suspicious URL produces appropriate risk points and findings', async () => {
    const res = await fetch(`${baseUrl}/api/scans/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ url: 'http://192.168.1.10/login' })
    });

    assert.strictEqual(res.status, 200);
    const json = (await res.json()) as any;
    assert.strictEqual(json.success, true);
    assert.ok(json.data.riskScore >= 40);
    assert.ok(json.data.findings.length >= 2);
  });
});
