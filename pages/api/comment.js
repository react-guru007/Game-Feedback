import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async (req, res) => {
  console.log('Incoming request:', req.method, req.url, req.body, req.body.dataType)

  try {
    const client = await clientPromise
    const db = client.db('game-feedback-db')

    let result 

    if (req.method === 'POST') {
      // add comment
      if (req.body.dataType === 'Comment') {
        const newComment = req.body.newComment
        const filterId = req.body.filterId
        let objectId

        try {
          objectId = new ObjectId(filterId)
          console.log(objectId)
        } catch (error) {
          console.error('Invalid ObjectId:', filterId)
          res.status(400).json({ message: 'Invalid ObjectId', error })
          return
        }

        const filter = { _id: objectId }

        const update = { $push: { comments: newComment } }

        result = await db.collection('feedback').updateOne(filter, update)
      }
      // reply comment
      if (req.body.dataType === 'Reply') {
        const newReply = req.body.newReply
        const filterId = req.body.filterId
        const objectId = new ObjectId(filterId)
        const commentId = req.body.commentId

        const filter = { _id: objectId, 'comments.id': commentId }

        const update = { $push: { "comments.$.replies": newReply } }

        result = await db.collection('feedback').updateOne(filter, update)

        
      }
      //delete 

      res.status(200).json({ message: 'Feedback added', result })
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (e) {
    console.error('Error in API route:', e)
    res.status(500).json({ message: 'Error processing request', error: e })
  }
}
