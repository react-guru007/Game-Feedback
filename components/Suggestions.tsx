import React, { useState } from 'react'

export default function Suggestions() {
  const [isOpen, setIsOpen] = useState(false)

  const [dropValue, setDropValue] = useState('Most Upvotes')

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
  }

  const handleMenuItemClick = (value: string) => {
    setDropValue(value)
    setIsOpen(false)
  }

  return (
    <div className="suggestionsContainer">
      {/* header bar */}
      <div className="suggestionsBar">
        <img src="/suggestions/icon-suggestions.svg" />
        <p>6 Suggestions</p>
        <div className='dropdownContainer'>
          <label>Sort by :</label>
          <button onClick={toggleDropdown} className="dropdownButton">
            {dropValue} <img src={isOpen ? '/shared/icon-arrow-up.svg' : '/shared/icon-arrow-down.svg'}/>
          </button>
          {isOpen && (
            <ul className="sortDropdown">
                <li onClick={() => handleMenuItemClick('Most Upvotes')}><span>Most Upvotes</span>{dropValue === 'Most Upvotes' ? (<img src='/shared/icon-check.svg' className='check'/>) : null}</li>
                <li onClick={() => handleMenuItemClick('Least Upvotes')}><span>Least Upvotes</span>{dropValue === 'Least Upvotes' ? (<img src='/shared/icon-check.svg' className='check'/>) : null}</li>
                <li onClick={() => handleMenuItemClick('Most Comments')}><span>Most Comments</span>{dropValue === 'Most Comments' ? (<img src='/shared/icon-check.svg' className='check'/>) : null}</li>
                <li onClick={() => handleMenuItemClick('Least Comments')}><span>Least Comments</span>{dropValue === 'Least Comments' ? (<img src='/shared/icon-check.svg' className='check'/>) : null}</li>
           </ul>
          )}
          
        </div>
        <button className='feedbackButton'><img src='/shared/icon-plus.svg'/>Add Feedback</button>
      </div>

      {/* list of suggestions */}
      <div className='suggestionItem'>
        <div className='upvotes'>
          <img src='/shared/icon-arrow-up.svg'/>
          <p>112</p>
        </div>
        <div className='suggestionDescriptionWrapper'>
          <h2>Add tags for solutions</h2>
          <p>Easier to search for solutions based on a specific stack.</p>
          <div>Enhancement</div>
        </div>
        <div className='commentsWrapper'>
          <p>2</p>
          <img src='/shared/icon-comments.svg'/>
          
        </div>
      </div>
    </div>
  )
}
