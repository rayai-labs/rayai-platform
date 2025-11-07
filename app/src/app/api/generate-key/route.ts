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

    const timestamp = Date.now()
    const randomId = crypto.randomUUID()
    const randomBytes = crypto.getRandomValues(new Uint8Array(16))
    const randomHex = Array.from(randomBytes)
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const baseString = `rayai_${keyName.trim()}_${timestamp}_${randomId}_${randomHex}`

    const encoder = new TextEncoder()
    const data = encoder.encode(baseString)
    const hashBuffer = await crypto.subtle.digest('SHA-256', data)
    
    const hashArray = Array.from(new Uint8Array(hashBuffer))
    const hashHex = hashArray
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')

    const apiKey = `ray_ai_sk_${hashHex.substring(0, 48)}`

    return NextResponse.json({
      success: true,
      apiKey,
      keyName: keyName.trim(),
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