import type { IncomingMessage, ServerResponse } from 'http'
import { Client } from 'pg'

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== 'GET') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Only GET requests allowed' }))
    return
  }

  try {
    const client = new Client({ connectionString: process.env.DATABASE_URL })
    await client.connect()

    const result = await client.query('SELECT * FROM courses ORDER BY created_at DESC LIMIT 500')
    await client.end()

    res.statusCode = 200
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify(result.rows))
  } catch (err) {
    console.error('Fetch error:', err)
    res.statusCode = 500
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Failed to fetch courses' }))
  }
}
