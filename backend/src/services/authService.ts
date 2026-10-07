import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { db } from '../database/db';
import { AuthTokenPayload, UserResponse } from '../types/user';
import { validateEmail, validatePassword } from '../utils/validation';

const JWT_SECRET = process.env.JWT_SECRET || 'fakeshield_super_secret_jwt_key_hackathon_2025_cs6';
const TOKEN_EXPIRY = '7d';

export class AuthService {
  static register(fullName: string, email: string, password: string, confirmPassword?: string): { user: UserResponse; token: string } {
    if (!fullName || fullName.trim().length < 2) {
      throw new Error('Full name is required (minimum 2 characters).');
    }

    if (!validateEmail(email)) {
      throw new Error('A valid email address is required.');
    }

    const passCheck = validatePassword(password);
    if (!passCheck.isValid) {
      throw new Error(passCheck.error || 'Invalid password.');
    }

    if (confirmPassword !== undefined && password !== confirmPassword) {
      throw new Error('Passwords do not match.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = fullName.trim();

    // Check if email already exists
    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(cleanEmail);
    if (existing) {
      throw new Error('An account with this email address already exists.');
    }

    // Hash password
    const passwordHash = bcrypt.hashSync(password, 10);

    // Insert new user
    const stmt = db.prepare(`
      INSERT INTO users (full_name, email, password_hash, created_at)
      VALUES (?, ?, ?, datetime('now'))
    `);
    const result = stmt.run(cleanName, cleanEmail, passwordHash);
    const userId = Number(result.lastInsertRowid);

    const userRow = db.prepare('SELECT id, full_name, email, created_at FROM users WHERE id = ?').get(userId) as any;

    const user: UserResponse = {
      id: userRow.id,
      fullName: userRow.full_name,
      email: userRow.email,
      createdAt: userRow.created_at
    };

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName
    });

    return { user, token };
  }

  static login(email: string, password: string): { user: UserResponse; token: string } {
    if (!email || !password) {
      throw new Error('Email and password are required.');
    }

    const cleanEmail = email.trim().toLowerCase();
    const userRow = db.prepare('SELECT id, full_name, email, password_hash, created_at FROM users WHERE email = ?').get(cleanEmail) as any;

    if (!userRow) {
      throw new Error('Invalid email or password.');
    }

    const passwordMatch = bcrypt.compareSync(password, userRow.password_hash);
    if (!passwordMatch) {
      throw new Error('Invalid email or password.');
    }

    const user: UserResponse = {
      id: userRow.id,
      fullName: userRow.full_name,
      email: userRow.email,
      createdAt: userRow.created_at
    };

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      fullName: user.fullName
    });

    return { user, token };
  }

  static getUserById(userId: number): UserResponse | null {
    const userRow = db.prepare('SELECT id, full_name, email, created_at FROM users WHERE id = ?').get(userId) as any;
    if (!userRow) return null;

    return {
      id: userRow.id,
      fullName: userRow.full_name,
      email: userRow.email,
      createdAt: userRow.created_at
    };
  }

  static generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn: TOKEN_EXPIRY });
  }

  static verifyToken(token: string): AuthTokenPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
    } catch {
      return null;
    }
  }
}
