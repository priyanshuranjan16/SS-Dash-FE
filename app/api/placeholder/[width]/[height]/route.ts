import { NextRequest, NextResponse } from 'next/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { width: string; height: string } }
) {
  const { width, height } = params
  
  // Create a simple SVG placeholder
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="#f3f4f6"/>
      <circle cx="${Number(width) / 2}" cy="${Number(height) / 3}" r="${Math.min(Number(width), Number(height)) / 6}" fill="#9ca3af"/>
      <rect x="${Number(width) / 4}" y="${Number(height) * 0.6}" width="${Number(width) / 2}" height="${Number(height) / 8}" rx="4" fill="#9ca3af"/>
      <rect x="${Number(width) / 3}" y="${Number(height) * 0.75}" width="${Number(width) / 3}" height="${Number(height) / 8}" rx="4" fill="#9ca3af"/>
    </svg>
  `

  return new NextResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  })
}
