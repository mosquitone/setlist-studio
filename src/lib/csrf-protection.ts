import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'

export interface CSRFTokens {
  token: string
  cookieToken: string
}

export function generateCSRFTokens(): CSRFTokens {
  const token = randomBytes(32).toString('hex')
  const cookieToken = randomBytes(32).toString('hex')
  return { token, cookieToken }
}

export function verifyCSRFToken(request: NextRequest): boolean {
  const headerToken = request.headers.get('x-csrf-token')
  const cookieToken = request.cookies.get('csrf_token')?.value
  
  if (!headerToken || !cookieToken) {
    return false
  }
  
  // Simple token comparison (in production, consider using HMAC)
  return headerToken === cookieToken
}

export function setCSRFCookie(response: NextResponse, token: string): void {
  response.cookies.set('csrf_token', token, {
    httpOnly: false, // Needs to be accessible by client-side JS
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    path: '/',
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function csrfProtection(request: NextRequest): Promise<NextResponse | null> {
  // Skip CSRF protection for GET requests (GraphQL introspection, etc.)
  if (request.method === 'GET') {
    return null
  }

  // Check for state-changing operations in GraphQL
  const requestClone = request.clone()
  const body = await requestClone.text()
  
  // Skip CSRF for non-state-changing queries
  if (body.includes('query') && !body.includes('mutation')) {
    return null
  }

  // Verify CSRF token for mutations
  if (!verifyCSRFToken(request)) {
    return NextResponse.json(
      { 
        error: 'CSRF token validation failed',
        code: 'CSRF_TOKEN_INVALID'
      },
      { status: 403 }
    )
  }

  return null // Allow request to proceed
}

// Utility function to generate CSRF token endpoint
export function createCSRFTokenResponse(): NextResponse {
  const { token } = generateCSRFTokens()
  const response = NextResponse.json({ csrfToken: token })
  
  setCSRFCookie(response, token)
  
  return response
}