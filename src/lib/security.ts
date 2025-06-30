import DOMPurify from 'dompurify'

export const sanitizeText = (text: string): string => {
  if (typeof window === 'undefined') {
    return text
  }

  return DOMPurify.sanitize(text, {
    ALLOWED_TAGS: [],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true,
  })
}

export const sanitizeHtml = (html: string): string => {
  if (typeof window === 'undefined') {
    return html
  }

  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
  })
}

export const isValidUrl = (url: string): boolean => {
  try {
    const parsedUrl = new URL(url)
    return (
      parsedUrl.protocol === 'https:' ||
      parsedUrl.protocol === 'http:' ||
      url.startsWith('data:image/')
    )
  } catch {
    return false
  }
}

export const validateAndSanitizeInput = (input: string, maxLength: number = 1000): string => {
  if (!input || typeof input !== 'string') {
    return ''
  }

  const trimmed = input.trim()
  if (trimmed.length > maxLength) {
    throw new Error(`入力が長すぎます。${maxLength}文字以下にしてください。`)
  }

  return sanitizeText(trimmed)
}
