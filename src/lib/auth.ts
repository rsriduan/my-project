import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import prisma from './prisma';

const JWT_SECRET = process.env.JWT_SECRET || 'delied_fashion_jwt_super_secret_key_2026';
const COOKIE_NAME = 'delied_session';

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
  role: string;
  status: string;
}

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(plainText, salt);
}

export async function verifyPassword(plainText: string, hashed: string): Promise<boolean> {
  return bcrypt.compare(plainText, hashed);
}

export function signToken(payload: UserSessionPayload): string {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token: string): UserSessionPayload | null {
  try {
    return jwt.verify(token, JWT_SECRET) as UserSessionPayload;
  } catch (error) {
    return null;
  }
}

export async function getCurrentUser(): Promise<UserSessionPayload | null> {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;
    return verifyToken(token);
  } catch (err) {
    return null;
  }
}

export async function getFullUserProfile(userId: string) {
  return prisma.user.findUnique({
    where: { id: userId },
    include: {
      resellerProfile: true,
      wholesaleProfile: true,
      shareholderProfile: true,
      staffProfile: true,
      moderatorProfile: true,
      marketerProfile: true,
    },
  });
}

export function isAuthorizedRole(userRole: string, allowedRoles: string[]): boolean {
  if (userRole === 'ADMIN') return true; // Super admin has universal access
  return allowedRoles.includes(userRole);
}
