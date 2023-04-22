import React, { useState } from 'react'

interface SuggestionsProps {
  openNewFeedback: boolean
  setOpenNewFeedback: any
  openFeedbackPage: boolean
  setOpenFeedbackPage: any
  pageId: string
  setPageId: any
  data: any
}

export default function Suggestions({
  openNewFeedback,
  setOpenNewFeedback,
  openFeedbackPage,
  setOpenFeedbackPage,
  pageId,
  setPageId,
  data,
}: SuggestionsProps) {

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

      {data.map((item: any) => (
        <div className="suggestionItem" key={item._id}>
          <div className="upvotes">
            <img src="/shared/icon-arrow-up.svg" />
            <p>{item.upvotes}</p>
          </div>
          <div className="suggestionDescriptionWrapper">
            <h2>{item.title}</h2>
            <p>{item.description}</p>
            <div>{item.category}</div>
          </div>
          <div className="commentsWrapper" onClick={() => handleOpenFeedbackPage(item._id)}>
            <p>{item.comments.length}</p>
            <img src="/shared/icon-comments.svg" />
          </div>
        </div>
      ))}
    </div>
  )
}
