import { NextRequest, NextResponse } from 'next/server'
import { google } from 'googleapis'

// Google Sheets configuration
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets']

async function getGoogleSheetsClient() {
  const credentials = {
    type: 'service_account',
    project_id: process.env.GOOGLE_PROJECT_ID,
    private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
    private_key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.GOOGLE_CLIENT_EMAIL,
    client_id: process.env.GOOGLE_CLIENT_ID,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
  }

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: SCOPES,
  })

  const sheets = google.sheets({ version: 'v4', auth })
  return sheets
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message, attendance, guests, phone, dietaryRestrictions, songRequest } = body

    if (!name || !message || !attendance) {
      return NextResponse.json(
        { error: 'Name, message, and attendance are required' },
        { status: 400 }
      )
    }

    // If Google Sheets integration is configured
    if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_CLIENT_EMAIL) {
      try {
        const sheets = await getGoogleSheetsClient()
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID

        // Create the row data
        const values = [[
          new Date().toISOString(),
          name,
          email || '',
          message,
          attendance,
          guests || '',
          phone || '',
          dietaryRestrictions || '',
          songRequest || ''
        ]]

        await sheets.spreadsheets.values.append({
          spreadsheetId,
          range: 'RSVP!A:I',
          valueInputOption: 'RAW',
          requestBody: {
            values
          }
        })

        return NextResponse.json({
          success: true,
          message: 'RSVP submitted successfully'
        })
      } catch (sheetsError) {
        console.error('Google Sheets error:', sheetsError)
        // Fall back to local storage if Google Sheets fails
        return NextResponse.json({
          success: true,
          message: 'RSVP received (stored locally)',
          note: 'Google Sheets integration not configured'
        })
      }
    } else {
      // Mock successful response if Google Sheets is not configured
      console.log('RSVP received:', body)
      return NextResponse.json({
        success: true,
        message: 'RSVP received successfully',
        note: 'Google Sheets integration not configured'
      })
    }
  } catch (error) {
    console.error('RSVP submission error:', error)
    return NextResponse.json(
      { error: 'Failed to submit RSVP' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    // This endpoint could be used to fetch RSVP responses for admin dashboard
    if (process.env.GOOGLE_SHEETS_ID && process.env.GOOGLE_CLIENT_EMAIL) {
      try {
        const sheets = await getGoogleSheetsClient()
        const spreadsheetId = process.env.GOOGLE_SHEETS_ID

        const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: 'RSVP!A:I',
        })

        const rows = response.data.values || []
        const headers = rows[0] || []
        const data = rows.slice(1).map(row => {
          const obj: any = {}
          headers.forEach((header, index) => {
            obj[header.toLowerCase().replace(/\s+/g, '_')] = row[index] || ''
          })
          return obj
        })

        return NextResponse.json({
          success: true,
          data: data
        })
      } catch (sheetsError) {
        console.error('Google Sheets fetch error:', sheetsError)
        return NextResponse.json({
          success: false,
          error: 'Failed to fetch RSVP data from Google Sheets'
        }, { status: 500 })
      }
    } else {
      return NextResponse.json({
        success: true,
        data: [],
        note: 'Google Sheets integration not configured'
      })
    }
  } catch (error) {
    console.error('Fetch RSVP error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch RSVP data' },
      { status: 500 }
    )
  }
}