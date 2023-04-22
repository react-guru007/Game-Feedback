import React from 'react'

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
  const currentPost = data.find((item: any) => item._id === pageId)

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

        <div>
          <div className="commentSidebar">
            <img />
            <div>line</div>
          </div>

          <div className="commentWrapper">
            <div className="commentHeader"></div>
            <p>comment</p>
          </div>

        </div>
      </div>
      <div>add comments</div>
    </div>
  )
}
