import React, { useState } from 'react'
import { useSession } from 'next-auth/react'
import { Post } from '../types/data'

interface FeedbackPageProps {
  setOpenFeedbackPage: React.Dispatch<React.SetStateAction<boolean>>
  openEditFeedbackPage: boolean
  setOpenEditFeedbackPage: React.Dispatch<React.SetStateAction<boolean>>
  suggestionsData: Post[]
  setSuggestionsData: React.Dispatch<React.SetStateAction<Post[]>>
  pageId: string
  data: Post[]
}

export default function FeedbackPage({
  setOpenFeedbackPage,
  setOpenEditFeedbackPage,
  suggestionsData,
  setSuggestionsData,
  pageId,
  data,
}: FeedbackPageProps) {
  const { data: session } = useSession()

  const [activeReplyBox, setActiveReplyBox] = useState(-1)

  const [dataType, setDataType] = useState('Comment')

  const [textLength, setTextLength] = useState(255)

  const currentPost: any = suggestionsData.find(
    (item: any) => item._id === pageId
  )

  const authUser = session?.user?.name === currentPost?.name

  const [postComment, setPostComment] = useState<any>({
    id: '',
    content: '',
    user: {
      image: session ? session?.user?.image : '/user-images/image-guest.webp',
      name: session ? session?.user?.name : 'Guest',
    },
    replies: [],
  })

  const [postReply, setPostReply] = useState({
    content: '',
    replyingTo: '',
    user: {
      image: session ? session?.user?.image : '/user-images/image-guest.webp',
      name: session ? session?.user?.name : 'Guest',
    },
  })

  const filterId = currentPost?._id

  const handleCommentChange = (e: any) => {
    let copyObj = postComment
    copyObj.content = e.target.value
    setTextLength(255 - e.target.value.length)

    setPostComment(copyObj)
  }

  const handleReplyChange = (e: any, replyToName: string) => {
    let copyObj = postReply
    copyObj.content = e.target.value
    copyObj.replyingTo = replyToName
    setPostReply(copyObj)
  }

  const addComment = async (newComment: any) => {
    try {
      const response = await fetch('https://game-feedback.netlify.app/api.comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newComment, filterId, dataType }),
      })

      if (response.ok) {
        let copyData = [...suggestionsData]
        copyData.map((item: any) => {
          item._id == pageId && item.comments.push(newComment)
        })

        setSuggestionsData(copyData)
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const addReply = async (newReply: any, currentId: any) => {
    const commentId = currentId

    try {
      const response = await fetch('https://game-feedback.netlify.app/api.comment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ newReply, filterId, dataType, commentId }),
      })

      if (response.ok) {
        let copyData = [...suggestionsData]

        copyData.map(
          (item: any) =>
            item._id === pageId &&
            item.comments.map((item2: any) => {
              item2.id == currentId && item2.replies.push(newReply)
            })
        )

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
  

  return (
    <div className="feedbackPageContainer">
      {/* header buttons */}
      <div className="navContainer">
        <div className="backWrapper">
          <img src="/shared/icon-arrow-left.svg" />
          <button onClick={() => setOpenFeedbackPage(false)}>Go Back</button>
        </div>
        <button
          className="editButton"
          onClick={handleEditButton}
          disabled={!authUser}
        >
          Edit Feedback
        </button>
      </div>

      {/* post details */}
      <div className="suggestionItem" key={currentPost._id}>
        <div className="upvotes">
          <img src="/shared/icon-arrow-up.svg" />
          <p>{currentPost.upvotes}</p>
        </div>
        <div className="suggestionDescriptionWrapper">
          <h2 className="">{currentPost.title}</h2>
          <p>{currentPost.description}</p>
          <div>{currentPost.category}</div>
        </div>
        <div className="commentsWrapper">
          <p>{currentPost.comments.length}</p>
          <img src="/shared/icon-comments.svg" />
        </div>
      </div>

      {/* comments */}
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
        <textarea onChange={handleCommentChange} maxLength={255}></textarea>
        <div className="postCommentWrapper">
          <p>{textLength} Characters Left</p>
          <button onClick={() => addComment(postComment)}>Post Comment</button>
        </div>
      </div>
    </div>
  )
}
