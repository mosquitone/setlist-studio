import { NextRequest } from 'next/server'
import { createCSRFTokenResponse } from '../../../lib/csrf-protection'

export async function GET(request: NextRequest) {
  return createCSRFTokenResponse()
}