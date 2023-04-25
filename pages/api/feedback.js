import clientPromise from '../../lib/mongodb'

export default async (req, res) => {
  try {
    const client = await clientPromise
    const db = client.db('game-feedback-db')

    if (req.method === 'GET') {
      const feedbackList = await db
        .collection('feedback')
        .find({})
        .limit(10)
        .toArray()

      res.json(feedbackList)
    } else if (req.method === 'POST') {

      const newFeedback = JSON.parse(req.body)
      const result = await db.collection('feedback').insertOne(newFeedback)
      res.status(200).json({ message: 'Feedback added', result })
      
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Error processing request', error: e })
  }
}
