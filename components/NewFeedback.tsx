import React, { useState } from 'react'

interface NewFeedbackProps {
    openNewFeedback: boolean
    setOpenNewFeedback: any
}

export default function NewFeedback({ openNewFeedback, setOpenNewFeedback }: NewFeedbackProps) {
    const [isOpen, setIsOpen] = useState(false)

    const [dropValue, setDropValue] = useState('')

    const toggleDropdown = () => {
        setIsOpen(!isOpen)
      }

      const handleMenuItemClick = (value: string) => {
        setDropValue(value)
        setIsOpen(false)
      }

  return (
    <div className='newFeedbackContainer'>
        <div>
            <img src='/shared/icon-arrow-left.svg'/>
            <button>Go Back</button>
        </div>
        <div className='formContainer'>
            <h1>Create New Feedback</h1>
            <div className='formItemWrapper'>
                <h2>Feedback Title</h2>
                <p>Add a short, descriptive headline</p>
                <input></input>
            </div>

            <div className='formItemWrapper'>
                <h2>Category</h2>
                <p>Choose a category for your feedback</p>
                <button className='categoryDropdownButton' onClick={toggleDropdown}><img src='/shared/icon-arrow-down.svg'/></button>
                {isOpen && (
                    <ul className='categoryDropdown'>

                    </ul>
                )}
            </div>

            <div className='formItemWrapper'>
                <h2>Feedback Detail</h2>
                <p>Include any specific comments on what should be improved, added, etc.</p>
                <input></input>
            </div>

            <div className='buttonWrapper'>
                <button>Cancel</button>
                <button>Add Feedback</button>
            </div>
        </div>
        
    </div>
  )
}
