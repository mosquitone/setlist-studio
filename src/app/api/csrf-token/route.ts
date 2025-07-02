import { NextRequest } from 'next/server';
import { createCSRFTokenResponse } from '../../../lib/security/csrf-protection';

export async function GET(request: NextRequest) {
  return createCSRFTokenResponse();
}

export async function POST(request: NextRequest) {
  return createCSRFTokenResponse();
}
