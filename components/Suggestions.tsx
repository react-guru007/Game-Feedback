import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'

interface SuggestionsProps {
  openNewFeedback: boolean
  setOpenNewFeedback: any
  openFeedbackPage: boolean
  setOpenFeedbackPage: any
  pageId: string
  setPageId: any
  data: any
  session: any
  isVoting: boolean
  setIsVoting: any
}

export default function Suggestions({
  openNewFeedback,
  setOpenNewFeedback,
  openFeedbackPage,
  setOpenFeedbackPage,
  pageId,
  setPageId,
  data,
  session,
  isVoting,
  setIsVoting,
}: SuggestionsProps) {
  const router = useRouter()

  const user = session?.data?.user?.name

  const [suggestionsData, setSuggestionData] = useState(data)

  const [isOpen, setIsOpen] = useState(false)

  const [dropValue, setDropValue] = useState('Most Upvotes')

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (value: string) => {
    setDropValue(value)
    setIsOpen(false)
  }

  const handleOpenFeedbackPage = (id: string) => {
    setPageId(id)
    setOpenFeedbackPage(true)
  }

  const upvoteFeedback = async (currentId: any) => {
    const currentPost = data.find((item: any) => item._id === currentId)

    const currentUpvotes = currentPost.upvotes

    const hasUserUpvoted = currentPost.upvotedBy.some(
      (item: any) => item === user
    )

    const feedbackId = currentId

    const changeType = 'UPVOTE'
    console.log('1')

    if (true) {
      console.log('2')
      
        fetch('http://localhost:3000/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedbackId,
            user,
            changeType,
            currentUpvotes,
          }),
        })
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP error: ${response.status}`);
          }
          console.log("API response:", response);
          console.log('3')
          const updatedData = suggestionsData.map((item: any) => {
            if (item._id === currentId) {
              return {
                ...item,
                upvotes: item.upvotes + 1,
                upvotedBy: [...item.upvotedBy, user]
              }
            }
            return item
          })

          setSuggestionData(updatedData)
          console.log(suggestionsData)

        })
        .catch((error) => {
          console.error('Error adding comment:', error);
        })

        
        
      
    }
  }

  console.log(suggestionsData)

  return (
    <div className="suggestionsContainer">
      {/* header bar */}
      <div className="suggestionsBar">
        <img src="/suggestions/icon-suggestions.svg" />
        <p>6 Suggestions</p>
        <div className="dropdownContainer">
          <label>Sort by :</label>
          <button onClick={toggleDropdown} className="dropdownButton">
            {dropValue}{' '}
            <img
              src={
                isOpen
                  ? '/shared/icon-arrow-up.svg'
                  : '/shared/icon-arrow-down.svg'
              }
            />
          </button>
          {isOpen && (
            <ul className="sortDropdown">
              <li onClick={() => handleMenuItemClick('Most Upvotes')}>
                <span>Most Upvotes</span>
                {dropValue === 'Most Upvotes' ? (
                  <img src="/shared/icon-check.svg" className="check" />
                ) : null}
              </li>
              <li onClick={() => handleMenuItemClick('Least Upvotes')}>
                <span>Least Upvotes</span>
                {dropValue === 'Least Upvotes' ? (
                  <img src="/shared/icon-check.svg" className="check" />
                ) : null}
              </li>
              <li onClick={() => handleMenuItemClick('Most Comments')}>
                <span>Most Comments</span>
                {dropValue === 'Most Comments' ? (
                  <img src="/shared/icon-check.svg" className="check" />
                ) : null}
              </li>
              <li onClick={() => handleMenuItemClick('Least Comments')}>
                <span>Least Comments</span>
                {dropValue === 'Least Comments' ? (
                  <img src="/shared/icon-check.svg" className="check" />
                ) : null}
              </li>
            </ul>
          )}
        </div>
        <button
          className="feedbackButton"
          onClick={() => setOpenNewFeedback(true)}
        >
          <img src="/shared/icon-plus.svg" />
          Add Feedback
        </button>
      </div>

      {/* list of suggestions */}

      {suggestionsData.map((item: any) => (
        <div className="suggestionItem" key={item._id}>
          <button className="upvotes" onClick={() => upvoteFeedback(item._id)}>
            <img src="/shared/icon-arrow-up.svg" />
            <p>{item.upvotes}</p>
          </button>
          <div className="suggestionDescriptionWrapper">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div>{item.category}</div>
          </div>
          <div
            className="commentsWrapper"
            onClick={() => handleOpenFeedbackPage(item._id)}
          >
            <p>{item.comments.length}</p>
            <img src="/shared/icon-comments.svg" />
          </div>
        </div>
      ))}
    </div>
  )
}
