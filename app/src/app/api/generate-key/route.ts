import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (!user || authError) {
      if (authError?.code === 'user_not_found') {
        return NextResponse.json(
          { 
            error: 'Session expired. Please sign in again.',
            shouldSignOut: true
          },
          { status: 401 }
        )
      }
      
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

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
    
    const encoder = new TextEncoder()
    const keyData = encoder.encode(apiKey)
    const hashBuffer = await crypto.subtle.digest('SHA-256', keyData)
    const keyHash = Array.from(new Uint8Array(hashBuffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('')
    
    const { data, error } = await supabase
      .from('api_key')
      .insert({
        user_id: user.id,
        name: keyName.trim(),
        key_hash: keyHash
      })
      .select()

    if (error) {
      console.error('Database error:', error)
      return NextResponse.json(
        { error: 'Failed to save API key' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      apiKey,
      keyName: keyName.trim(),
      createdAt: data[0].created_at
    })

  } catch (error) {
    console.error('Error generating API key:', error)
    return NextResponse.json(
      { error: 'Failed to generate API key' },
      { status: 500 }
    )
  }
}