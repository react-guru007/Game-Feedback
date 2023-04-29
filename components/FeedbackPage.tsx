import React, { useState } from 'react'
import { useSession } from 'next-auth/react'

interface FeedbackPageProps {
  openFeedbackPage: boolean
  setOpenFeedbackPage: any
  openEditFeedbackPage: boolean
  setOpenEditFeedbackPage: any
  pageId: string
  setPageId: any
  data: any
}

export default function FeedbackPage({
  openFeedbackPage,
  setOpenFeedbackPage,
  setOpenEditFeedbackPage,
  pageId,
  setPageId,
  data,
}: FeedbackPageProps) {
  const { data: session } = useSession()

  const [activeReplyBox, setActiveReplyBox] = useState(-1)

  const [dataType, setDataType] = useState('')

  const currentPost = data.find((item: any) => item._id === pageId)

  const authUser = session?.user?.name === currentPost.name

  const [postComment, setPostComment] = useState({
    id: '',
    content: '',
    user: {
      image: '/user-images/image-zena.jpg',
      name: session ? session?.user?.name : 'Guest',
    },
    replies: [],
  })

  const [postReply, setPostReply] = useState({
    content: '',
    replyingTo: '',
    user: {
      image: '/user-images/image-zena.jpg',
      name: session ? session?.user?.name : 'Guest',
    },
  })

  const filterId = currentPost._id

  const handleCommentChange = (e: any) => {
    let copyObj = postComment
    copyObj.content = e.target.value
    setPostComment(copyObj)
  }

  const handleReplyChange = (e: any, replyToName: string) => {
    let copyObj = postReply
    copyObj.content = e.target.value
    copyObj.replyingTo = replyToName
    setPostReply(copyObj)
    console.log(postReply)
  }

  const addComment = async (newComment: any) => {

    try {
      const response = await fetch('http://localhost:3000/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newComment, filterId, dataType }),
      })
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const addReply = async (newReply: any, currentId: any) => {
    const commentId = currentId

    try {
      const response = await fetch('http://localhost:3000/api/comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newReply, filterId, dataType, commentId }),
      })

      if (response.ok) {
        setActiveReplyBox(-1)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleReplyButton = (index: number) => {
    if (activeReplyBox === index) {
      setActiveReplyBox(-1)
      setDataType('Comment')
    } else {
      setDataType('Reply')
      setActiveReplyBox(index)
    }
  }

  const handleEditButton = () => {
    setOpenFeedbackPage(false)
    setOpenEditFeedbackPage(true)
  }


  console.log(authUser)
  return (
    <div className="feedbackPageContainer">
      <div className="navContainer">
        <div className="backWrapper">
          <img src="/shared/icon-arrow-left.svg" />
          <button onClick={() => setOpenFeedbackPage(false)}>Go Back</button>
        </div>
        <button className="editButton" onClick={handleEditButton} disabled={!authUser}>Edit Feedback</button>
      </div>

      <div className="suggestionItem" key={currentPost._id}>
        <div className="upvotes">
          <img src="/shared/icon-arrow-up.svg" />
          <p>{currentPost.upvotes}</p>
        </div>
        <div className="suggestionDescriptionWrapper">
          <h2>{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <div>{currentPost.category}</div>
        </div>
        <div className="commentsWrapper">
          <p>{currentPost.comments.length}</p>
          <img src="/shared/icon-comments.svg" />
        </div>
      </div>

      <div className="commentsContainer">
        <h2>{currentPost.comments.length} Comments</h2>

        {currentPost.comments.map((item: any, index: number) => (
          <div className="itemWrapper" key={index}>
            <div className="commentItem">
              <div className="commentSidebar">
                <img src={item.user.image} />
                <div
                  className={`${
                    !item.replies.length ? 'hidden' : 'testReplyLine'
                  }`}
                ></div>
              </div>

              <div className="commentWrapper">
                <div className="commentHeader">
                  <p>{item.user.name}</p>
                  <button onClick={() => handleReplyButton(index)}>
                    {activeReplyBox === index ? 'Cancel' : 'Reply'}
                  </button>
                </div>
                <p>{item.content}</p>
                {/* reply box */}
                {activeReplyBox === index && (
                  <div className="replyToCommentWrapper">
                    <textarea
                      onChange={(event) =>
                        handleReplyChange(event, item.user.name)
                      }
                    ></textarea>
                    <button onClick={() => addReply(postReply, item.id)}>
                      Post Reply
                    </button>
                  </div>
                )}
              </div>
            </div>
            {/* replies */}

            <div className="replyContainer">
              <div className="replyLine"></div>

              <div className="replyWrapper">
                {item.replies.map((item: any, index: number) => (
                  <div className="commentItem replyItem" key={index}>
                    {/* <div className='replyLine'></div> */}
                    <div className="commentSidebar">
                      <img src={item.user.image} className="replyImage" />
                      <div
                        className={`${!item?.replies?.length && 'hidden'}`}
                      ></div>
                    </div>

                    <div className="commentWrapper">
                      <div className="commentHeader">
                        <p>{item?.user?.name}</p>
                        {/* <button>Reply</button> */}
                      </div>
                      <p>
                        <span>@{item.replyingTo}</span>
                        {item.content}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="addCommentContainer">
        <h2>Add Comment</h2>
        <input onChange={handleCommentChange}></input>
        <div className="postCommentWrapper">
          <p>255 Characters Left</p>
          <button onClick={() => addComment(postComment)}>Post Comment</button>
        </div>
      </div>
    </div>
  )
}
