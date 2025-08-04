import type { IncomingMessage, ServerResponse } from 'http'
import { Client } from 'pg'

export default async function handler(
  req: IncomingMessage,
  res: ServerResponse
) {
  if (req.method !== 'POST') {
    res.statusCode = 405
    res.setHeader('Content-Type', 'application/json')
    res.end(JSON.stringify({ error: 'Only POST requests are allowed' }))
    return
  }

  let body = ''
  req.on('data', (chunk) => {
    body += chunk
  })

  req.on('end', async () => {
    try {
      const course = JSON.parse(body)

      if (!course?.place_id || !course?.name || !course?.lat || !course?.lng) {
        res.statusCode = 400
        res.setHeader('Content-Type', 'application/json')
        res.end(JSON.stringify({ error: 'Missing required fields' }))
        return
      }

      const client = new Client({ connectionString: process.env.DATABASE_URL })
      await client.connect()

      await client.query(
        `INSERT INTO courses (place_id, name, lat, lng, rating, reviews, city, country)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
         ON CONFLICT (place_id) DO NOTHING`,
        [
          course.place_id,
          course.name,
          course.lat,
          course.lng,
          course.rating ?? null,
          course.reviews ?? null,
          course.city ?? null,
          course.country ?? 'Norway',
        ]
      )

      await client.end()

      res.statusCode = 201
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ message: 'Course saved (or already exists)' }))
    } catch (err) {
      console.error('Database error:', err)
      res.statusCode = 500
      res.setHeader('Content-Type', 'application/json')
      res.end(JSON.stringify({ error: 'Failed to save course' }))
    }
  })
}
