import clientPromise from '../../lib/mongodb'
import { ObjectId } from 'mongodb'

export default async (req, res) => {
  console.log(
    'Incoming request:',
    req.method,
    req.url,
    req.body,
    req.body.changeType
  )

  try {
    const client = await clientPromise
    const db = client.db('game-feedback-db')

    // gets first 10 posts
    if (req.method === 'GET') {
      const feedbackList = await db
        .collection('feedback')
        .find({})
        .limit(10)
        .toArray()

      res.json(feedbackList)
    } else if (req.method === 'POST') {
      // delete post
      if (req.body.changeType === 'Delete') {
        const objectId = new ObjectId(req.body.deleteId)
        const filter = { _id: objectId }

        const result = await db.collection('feedback').deleteOne(filter)

        res.status(200).json({ message: 'feedback deleted' })
      }
      //edit post
      if (req.body.changeType === 'Edit') {
        const objectId = new ObjectId(req.body.editId)
        const filter = { _id: objectId }

        const updatedDocument = { ...req.body.feedback, _id: objectId }

        const result = await db
          .collection('feedback')
          .replaceOne(filter, updatedDocument)

        res.status(200).json({ message: 'feedback edited' })
      }
      //upvote post
      if (req.body.changeType === 'UPVOTE') {
        const objectId = new ObjectId(req.body.feedbackId)
        const filter = { _id: objectId }
        const userUpdateOperator = req.body.hasUserUpvoted
          ? '$pull'
          : '$addToSet'
        const upvotedByUpdate = {
          [userUpdateOperator]: { upvotedBy: req.body.user },
        }

        const upvotesUpdate = {
          $set: {
            upvotes: req.body.hasUserUpvoted
              ? req.body.currentUpvotes - 1
              : req.body.currentUpvotes + 1,
          },
        }

        const result = await db
          .collection('feedback')
          .updateOne(filter, upvotedByUpdate)

        const result2 = await db
          .collection('feedback')
          .updateOne(filter, upvotesUpdate)

        //important to include
        res
          .status(200)
          .json({ message: ('Modified document count:', result.modifiedCount) })
      }
      //add new post
      if (req.body.changeType === 'Add') {
        const result = await db
          .collection('feedback')
          .insertOne(req.body.feedback)

          const newId = result.insertedId
          console.log(JSON.stringify(result, null, 2))
        res.status(200).json({ message: 'Feedback added', newId })
      }
    } else {
      res.status(405).json({ message: 'Method not allowed' })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json({ message: 'Error processing request', error: e })
  }
}
