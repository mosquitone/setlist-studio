'use client'

import React, { useState } from 'react'
import {
  Box,
  Button,
  Alert,
  CircularProgress,
} from '@mui/material'
import { Image as ImageIcon } from '@mui/icons-material'
import html2canvas from 'html2canvas'
import QRCode from 'qrcode'
import { SetlistData } from './setlist-themes/types'
import { SetlistRenderer } from './setlist-themes/SetlistRenderer'

interface ImageGeneratorProps {
  data: SetlistData
  selectedTheme: 'black' | 'white'
  onDownloadReady?: (downloadFn: () => Promise<void>) => void
  onPreviewReady?: (imageUrl: string) => void
  onPreviewGenerationStart?: () => void
  baseUrl?: string
}

export const ImageGenerator: React.FC<ImageGeneratorProps> = ({
  data,
  selectedTheme,
  onDownloadReady,
  onPreviewReady,
  onPreviewGenerationStart,
  baseUrl = typeof window !== 'undefined' ? window.location.origin : '',
}) => {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [previewImage, setPreviewImage] = useState<string | null>(null)
  const [showDebug, setShowDebug] = useState(false)
  const [qrCodeURL, setQrCodeURL] = useState('')
  const isDev = process.env.NODE_ENV === 'development'

  React.useEffect(() => {
    if (onDownloadReady) {
      onDownloadReady(handleDownloadImage)
    }
  }, [onDownloadReady])

  // Generate QR code for current page
  React.useEffect(() => {
    const generateQRForCurrentPage = async () => {
      if (typeof window !== 'undefined') {
        const currentUrl = window.location.href
        const qrCode = await QRCode.toDataURL(currentUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
        setQrCodeURL(qrCode)
      }
    }
    generateQRForCurrentPage()
  }, [])

  const generateQRCode = async (setlistId: string): Promise<string> => {
    const url = `${baseUrl}/setlists/${setlistId}`
    try {
      const qrCodeDataURL = await QRCode.toDataURL(url, {
        width: 200,
        margin: 2,
        color: {
          dark: '#000000',
          light: '#FFFFFF',
        },
      })
      return qrCodeDataURL
    } catch (err) {
      console.error('Error generating QR code:', err)
      return ''
    }
  }

  const generateImage = async (theme: string): Promise<string | null> => {
    setIsGenerating(true)
    setError(null)

    try {
      // Generate QR code
      const qrCodeURL = await generateQRCode(data.id)

      // Create data with QR code
      const dataWithQR = { ...data, theme: theme as any, qrCodeURL }

      // Create a temporary container
      const container = document.createElement('div')
      container.style.position = 'absolute'
      container.style.left = '-9999px'
      container.style.top = '-9999px'
      container.style.width = 'auto'
      container.style.height = 'auto'
      document.body.appendChild(container)

      // Create React root and render component
      const { createRoot } = await import('react-dom/client')
      const root = createRoot(container)

      // Render the component
      await new Promise<void>(resolve => {
        root.render(<SetlistRenderer data={dataWithQR} className="setlist-image-generation" />)
        // Wait for rendering to complete
        setTimeout(resolve, 1000)
      })

      // Find the rendered element
      const element = container.querySelector('.setlist-image-generation') as HTMLElement
      if (!element) {
        throw new Error('Rendered element not found')
      }

      // Generate image with html2canvas
      const canvas = await html2canvas(element, {
        backgroundColor: null,
        scale: 2,
        useCORS: true,
        allowTaint: true,
        logging: false,
        width: element.scrollWidth,
        height: element.scrollHeight,
      })

      // Convert to blob URL
      const blob = await new Promise<Blob>(resolve => {
        canvas.toBlob(
          blob => {
            if (blob) resolve(blob)
          },
          'image/png',
          1,
        )
      })

      const imageURL = URL.createObjectURL(blob)

      // Cleanup
      root.unmount()
      document.body.removeChild(container)

      return imageURL
    } catch (err) {
      console.error('Error generating image:', err)
      setError(`画像生成エラー: ${err instanceof Error ? err.message : 'Unknown error'}`)
      return null
    } finally {
      setIsGenerating(false)
    }
  }

  const handleGeneratePreview = async () => {
    if (onPreviewGenerationStart) {
      onPreviewGenerationStart()
    }
    const imageURL = await generateImage(selectedTheme)
    if (imageURL) {
      setPreviewImage(imageURL)
      if (onPreviewReady) {
        onPreviewReady(imageURL)
      }
    }
  }

  const handleDownloadImage = async () => {
    const imageURL = await generateImage(selectedTheme)
    if (imageURL) {
      const link = document.createElement('a')
      link.href = imageURL
      link.download = `setlist-${data.bandName}-${selectedTheme}.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(imageURL)
    }
  }


  // Auto-generate preview when theme changes (only if not in debug mode)
  React.useEffect(() => {
    if (!showDebug) {
      handleGeneratePreview()
    }
  }, [selectedTheme, data.id])


  return (
    <Box>
      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}
      
      <Box sx={{ display: 'inline-flex', gap: 1, mb: 2 }}>
        <Button
          variant="contained"
          startIcon={isGenerating ? <CircularProgress size={20} /> : <ImageIcon />}
          onClick={handleDownloadImage}
          disabled={isGenerating}
          size="small"
        >
          {isGenerating ? '生成中...' : '画像生成'}
        </Button>
        
      </Box>

      {/* Preview Section */}
      <Box sx={{ mt: 2, textAlign: 'center' }}>
        {showDebug ? (
          /* DOM Preview */
          <Box
            sx={{
              border: '2px solid red',
              margin: '1rem 0',
              transform: 'scale(0.8)',
              transformOrigin: 'top center',
            }}
          >
            <SetlistRenderer data={{ ...data, qrCodeURL }} />
          </Box>
        ) : (
          /* Image Preview */
          previewImage && (
            <img
              src={previewImage}
              alt="Setlist Preview"
              style={{
                maxWidth: '100%',
                height: 'auto',
                border: '1px solid #e0e0e0',
                borderRadius: '4px',
              }}
            />
          )
        )}
      </Box>
    </Box>
  )
}
