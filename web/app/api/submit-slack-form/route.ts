import { NextResponse } from "next/server"

async function getAccessToken() {
  const serviceAccountEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL
  const privateKey = process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n")

  if (!serviceAccountEmail || !privateKey) {
    return null
  }

  // Create JWT for Google OAuth
  const header = {
    alg: "RS256",
    typ: "JWT",
  }

  const now = Math.floor(Date.now() / 1000)
  const claim = {
    iss: serviceAccountEmail,
    scope: "https://www.googleapis.com/auth/spreadsheets",
    aud: "https://oauth2.googleapis.com/token",
    exp: now + 3600,
    iat: now,
  }

  function base64urlEncode(input: string | ArrayBuffer): string {
    let base64: string

    if (typeof input === "string") {
      // For strings, use btoa with proper encoding
      base64 = btoa(input)
    } else {
      // For ArrayBuffer/binary data, convert to base64 properly
      const bytes = new Uint8Array(input)
      let binary = ""
      for (let i = 0; i < bytes.length; i++) {
        binary += String.fromCharCode(bytes[i])
      }
      base64 = btoa(binary)
    }

    // Convert to base64url format
    return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=/g, "")
  }

  const encodedHeader = base64urlEncode(JSON.stringify(header))
  const encodedClaim = base64urlEncode(JSON.stringify(claim))
  const signatureInput = `${encodedHeader}.${encodedClaim}`

  // Import private key for Web Crypto API
  const pemHeader = "-----BEGIN PRIVATE KEY-----"
  const pemFooter = "-----END PRIVATE KEY-----"
  const pemContents = privateKey.replace(pemHeader, "").replace(pemFooter, "").replace(/\s/g, "")

  const binaryString = atob(pemContents)
  const bytes = new Uint8Array(binaryString.length)
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i)
  }

  const cryptoKey = await crypto.subtle.importKey(
    "pkcs8",
    bytes.buffer,
    {
      name: "RSASSA-PKCS1-v1_5",
      hash: "SHA-256",
    },
    false,
    ["sign"],
  )

  // Sign the JWT
  const encoder = new TextEncoder()
  const data = encoder.encode(signatureInput)
  const signatureBuffer = await crypto.subtle.sign("RSASSA-PKCS1-v1_5", cryptoKey, data)

  const signature = base64urlEncode(signatureBuffer)

  const jwt = `${signatureInput}.${signature}`

  // Exchange JWT for access token
  const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "urn:ietf:params:oauth:grant-type:jwt-bearer",
      assertion: jwt,
    }),
  })

  if (!tokenResponse.ok) {
    const errorBody = await tokenResponse.text()
    console.error(`fetch to ${tokenResponse.url} failed with status ${tokenResponse.status} and body: ${errorBody}`)
    return null
  }

  const tokenData = await tokenResponse.json()
  return tokenData.access_token
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, name, company, jobTitle, familiarity, buildPlan, timestamp } = body

    // Validate required fields
    if (!email || !name || !company || !jobTitle || !familiarity || !buildPlan) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 })
    }

    const hasCredentials =
      process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL && process.env.GOOGLE_PRIVATE_KEY && process.env.GOOGLE_SHEET_ID

    if (!hasCredentials) {
      console.warn("Google Sheets credentials not configured. Form submission will succeed but data won't be saved.")
      // Return success anyway so the form works in preview/development
      return NextResponse.json({ success: true, warning: "Credentials not configured" })
    }

    // Get access token
    const accessToken = await getAccessToken()

    if (!accessToken) {
      console.error("Failed to get access token")
      return NextResponse.json({ success: true, warning: "Authentication failed" })
    }

    const spreadsheetId = process.env.GOOGLE_SHEET_ID

    // Append data to Google Sheet using REST API
    const appendResponse = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/Sheet1!A:G:append?valueInputOption=USER_ENTERED`,
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          values: [[timestamp, email, name, company, jobTitle, familiarity, buildPlan]],
        }),
      },
    )

    if (!appendResponse.ok) {
      console.error("Failed to append to sheet:", await appendResponse.text())
      return NextResponse.json({ success: true, warning: "Failed to save to sheet" })
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error submitting form:", error)
    return NextResponse.json({ error: "Failed to submit form" }, { status: 500 })
  }
}
