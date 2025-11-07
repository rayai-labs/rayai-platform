import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { keyName } = await request.json()

    if (!keyName || typeof keyName !== 'string' || keyName.trim().length === 0) {
      return NextResponse.json(
        { error: 'Key name is required and must be a non-empty string' },
        { status: 400 }
      )
    }

    const randomBytes = crypto.getRandomValues(new Uint8Array(32))
    const randomHex = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const apiKey = `ray_ai_sk_${randomHex}`
    
    // Generate hash for storage (when database is implemented)
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    const keyHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const displayPrefix = apiKey.substring(0, 22)

    return NextResponse.json({
      success: true,
      apiKey,
      keyName: keyName.trim(),
      keyHash,
      displayPrefix,
      createdAt: new Date().toISOString()
    })

  } catch (error) {
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}