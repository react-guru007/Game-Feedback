import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async (req, res) => {
  console.log('Incoming request:', req.method, req.url, req.body, req.body.dataType)


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
      if (req.body.changeType === 'Delete') {
        const objectId = new ObjectId(req.body.deleteId)
        const filter = { _id: objectId }

        const result = await db.collection('feedback').deleteOne(filter)
      } 

      if (req.body.changeType === 'UPVOTE') {
        const objectId = new ObjectId(req.body.feedbackId)
        const filter = { _id: objectId }
        const update = { $push: { upvotedBy: req.body.user } }

        const update2 = { $set: { upvotes: req.body.currentUpvotes + 1}}

        const result = await db.collection('feedback').updateOne(filter, update)

        const result2 = await db.collection('feedback').updateOne(filter, update2)
      } 
      
      else {
        const newFeedback = JSON.parse(req.body)
        const result = await db.collection('feedback').insertOne(newFeedback)
        res.status(200).json({ message: 'Feedback added', result })
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Error processing request', error: e })
  }
}
