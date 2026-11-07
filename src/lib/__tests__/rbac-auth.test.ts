import { describe, it, expect } from 'vitest';
import { isAuthorizedRole, signToken, verifyToken } from '../auth';
import { getDeliveryCharge, BANGLADESH_DISTRICTS } from '../bangladesh';

describe('DELIED RBAC & Location Authorization Tests', () => {
  it('enforces Role-Based Access Control (RBAC) rules correctly', () => {
    // Admin has universal access
    expect(isAuthorizedRole('ADMIN', ['STAFF', 'MODERATOR'])).toBe(true);
    expect(isAuthorizedRole('ADMIN', ['CUSTOMER'])).toBe(true);

    // Specific role matches
    expect(isAuthorizedRole('RESELLER', ['RESELLER', 'ADMIN'])).toBe(true);
    expect(isAuthorizedRole('WHOLESALE', ['WHOLESALE', 'ADMIN'])).toBe(true);
    expect(isAuthorizedRole('STAFF', ['STAFF'])).toBe(true);
    expect(isAuthorizedRole('SHAREHOLDER', ['SHAREHOLDER'])).toBe(true);
    expect(isAuthorizedRole('MODERATOR', ['MODERATOR'])).toBe(true);
    expect(isAuthorizedRole('MARKETER', ['MARKETER'])).toBe(true);

    // Disallowed role access
    expect(isAuthorizedRole('CUSTOMER', ['STAFF', 'ADMIN'])).toBe(false);
    expect(isAuthorizedRole('RESELLER', ['WHOLESALE'])).toBe(false);
    expect(isAuthorizedRole('SHAREHOLDER', ['ADMIN', 'MODERATOR'])).toBe(false);
  });

  it('signs and verifies user session tokens with role payload', () => {
    const payload = {
      userId: 'usr-12345',
      email: 'reseller@delied.com',
      name: 'Sumaiya Akter',
      role: 'RESELLER',
      status: 'ACTIVE',
    };

    const token = signToken(payload);
    expect(token).toBeDefined();

    const decoded = verifyToken(token);
    expect(decoded).not.toBeNull();
    expect(decoded?.userId).toBe('usr-12345');
    expect(decoded?.role).toBe('RESELLER');
  });

  it('correctly calculates Bangladesh delivery charges (Dhaka ৳60 vs Outside Dhaka ৳120)', () => {
    expect(getDeliveryCharge('Dhaka')).toBe(60);
    expect(getDeliveryCharge('dhaka')).toBe(60);
    expect(getDeliveryCharge('Chittagong')).toBe(120);
    expect(getDeliveryCharge('Sylhet')).toBe(120);
    expect(getDeliveryCharge('Narayanganj')).toBe(120);
    expect(getDeliveryCharge('Rajshahi')).toBe(120);
    expect(getDeliveryCharge('Unknown District')).toBe(120);

    expect(BANGLADESH_DISTRICTS.length).toBeGreaterThanOrEqual(10);
  });
});
