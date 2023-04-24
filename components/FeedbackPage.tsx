import React from 'react'
import { useSession } from 'next-auth/react'

interface FeedbackPageProps {
  openFeedbackPage: boolean
  setOpenFeedbackPage: any
  pageId: string
  setPageId: any
  data: any
}

export default function FeedbackPage({
  openFeedbackPage,
  setOpenFeedbackPage,
  pageId,
  setPageId,
  data,
}: FeedbackPageProps) {
  const session = useSession()

  const currentPost = data.find((item: any) => item._id === pageId)

  console.log(currentPost)

  return (
    <div className="feedbackPageContainer">
      <div className="navContainer">
        <div className="backWrapper">
          <img src="/shared/icon-arrow-left.svg" />
          <button onClick={() => setOpenFeedbackPage(false)}>Go Back</button>
        </div>
        <button className="editButton">Edit Feedback</button>
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

        {currentPost.comments.map((item: any) => (
          <div className="itemWrapper">
            <div className="commentItem">
              <div className="commentSidebar">
                <img src={item.user.image} />
                <div className={`${!item.replies.length ? 'hidden' : 'testReplyLine'}`}></div>
              </div>

              <div className="commentWrapper">
                <div className="commentHeader">
                  <p>{item.user.name}</p>
                  <button>Reply</button>
                </div>
                <p>{item.content}</p>
              </div>
            </div>
            {/* replies */}
            {item.replies.map((item: any) => (
              <div className="commentItem replyItem">
                <div className='replyLine'></div>
                <div className="commentSidebar">
                  <img src={item.user.image} className='replyImage'/>
                  <div className={`${!item?.replies?.length && 'hidden'}`}></div>
                </div>

                <div className="commentWrapper">
                  <div className="commentHeader">
                    <p>{item?.user?.name}</p>
                    <button>Reply</button>
                  </div>
                  <p><span>@{item.replyingTo}</span>{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
      <div className='addCommentContainer'>
        <h2>Add Comment</h2>
        <input></input>
        <div>
          <p></p>
          <button></button>
        </div>
      </div>
    </div>
  )
}
