import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import IconArrowUp from './IconArrowUp'

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
  suggestionsData: any
  setSuggestionsData: any
  tag: string
  setTag: any
  tagData: any
  setTagData: any
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
  suggestionsData,
  setSuggestionsData,
  tag,
  setTag,
  tagData,
  setTagData,
}: SuggestionsProps) {
  const router = useRouter()

  const [strokeColor, setStrokeColor] = useState('#4661E6');
  




  const user = session?.data?.user?.name

  const arrayToRender = tag !== 'All' ? tagData : suggestionsData

  const [isOpen, setIsOpen] = useState(false)

  const [dropValue, setDropValue] = useState('Most Upvotes')

  const [hasUserUpvoted, setHasUserUpvoted] = useState(false)

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (value: string) => {
    if (value === 'Most Upvotes') {
      setSuggestionsData(
        suggestionsData.sort((a: any, b: any) => b.upvotes - a.upvotes)
      )
    }

    if (value === 'Least Upvotes') {
      setSuggestionsData(
        suggestionsData.sort((a: any, b: any) => a.upvotes - b.upvotes)
      )
    }

    if (value === 'Most Comments') {
      setSuggestionsData(
        suggestionsData.sort(
          (a: any, b: any) => b.comments.length - a.comments.length
        )
      )
    }

    if (value === 'Least Comments') {
      setSuggestionsData(
        suggestionsData.sort(
          (a: any, b: any) => a.comments.length - b.comments.length
        )
      )
    }

    setDropValue(value)
    setIsOpen(false)
  }

  const handleOpenFeedbackPage = (id: string) => {
    setPageId(id)
    setOpenFeedbackPage(true)
  }

  const upvoteFeedback = async (currentId: any) => {
    const currentPost = suggestionsData.find(
      (item: any) => item._id === currentId
    )

    const currentUpvotes = currentPost.upvotes

    setHasUserUpvoted(
      currentPost?.upvotedBy?.some((item: any) => item === user)
    )

    const feedbackId = currentId

    const changeType = 'UPVOTE'

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
        hasUserUpvoted: currentPost?.upvotedBy?.some(
          (item: any) => item === user
        ),
      }),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error: ${response.status}`)
        }

        const updatedData = suggestionsData.map((item: any) => {
          if (item._id === currentId) {
            const userExists = item.upvotedBy.includes(user)
            const updatedUpvotedBy = userExists
              ? item.upvotedBy.filter((u: any) => u !== user)
              : [...item.upvotedBy, user]

            return {
              ...item,
              upvotes: !hasUserUpvoted ? item.upvotes - 1 : item.upvotes + 1,
              upvotedBy: updatedUpvotedBy,
            }
          }
          return item
        })

        setSuggestionsData(updatedData)
      })
      .catch((error) => {
        console.error('Error adding comment:', error)
      })
  }

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

      {arrayToRender.map((item: any, index: number) => (
        <div className="suggestionItem" key={index}>
          <button
            className={`${
              item?.upvotedBy?.some((item2: any) => item2 === item.name) &&
              'upvoted'
            } upvotes`}
            onClick={() => upvoteFeedback(item._id)}
            data-upvoted={item?.upvotedBy?.some((item2: any) => item2 === item.name) ? 'upvoted' : 'notUpvoted'}

            
          >
            <IconArrowUp
              className={`${item?.upvotedBy?.some((item2: any) => item2 === item.name) ? '' : 'downvotedArrow'} iconArrowUp`}
              strokeColor={`${
                item?.upvotedBy?.some((item2: any) => item2 === item.name) ?
                'white' : '#4661E6'
              }`}
            />
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
            <p>{item.comments?.length}</p>
            <img src="/shared/icon-comments.svg" />
          </div>
        </div>
      ))}
    </div>
  )
}
