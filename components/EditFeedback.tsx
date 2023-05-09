import React, { useState } from 'react'
import { useRouter } from 'next/router'
import { Post } from '../types/data'

interface EditFeedbackProps {
  setOpenEditFeedbackPage: React.Dispatch<React.SetStateAction<boolean>>
  pageId: string
  setPageId: React.Dispatch<React.SetStateAction<string>>
  data: Post[]
  suggestionsData: Post[]
  setSuggestionsData: React.Dispatch<React.SetStateAction<Post[]>>
}

export default function EditFeedback({
  setOpenEditFeedbackPage,
  pageId,
  setPageId,
  data,
  suggestionsData,
  setSuggestionsData,
}: EditFeedbackProps) {
  const currentPost: any = data.find((item: any) => item._id === pageId)

  const router = useRouter()

  const [isOpen, setIsOpen] = useState(false)

  const [isEmpty, setIsEmpty] = useState(true)

  const [textError, setTextError] = useState(false)

  const [statusIsOpen, setStatusIsOpen] = useState(false)

  const [dropValue, setDropValue] = useState('')

  const [statusDropValue, setStatusDropValue] = useState('')

  const [newFeedback, setNewFeedback] = useState<any | undefined>(currentPost)

  const [changeType, setChangeType] = useState('Edit')

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    setStatusIsOpen(false)
  }

  const toggleStatusDropdown = () => {
    setStatusIsOpen(!statusIsOpen)
    setIsOpen(false)
  }

  const handleMenuItemClick = (value: string) => {
    setDropValue(value)
    let copyObj = newFeedback
    copyObj.category = value
    setNewFeedback(copyObj)
    setIsOpen(false)
  }

  const handleStatusMenuItemClick = (value: string) => {
    setStatusDropValue(value)
    let copyObj = newFeedback
    copyObj.status = value
    setNewFeedback(copyObj)
    setStatusIsOpen(false)
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let copyObj = newFeedback
    copyObj.title = e.target.value
    setNewFeedback(copyObj)
  }

  const handleDescriptionChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    if (e.target.value === '') {
      setIsEmpty(true)
    } else {
      setIsEmpty(false)
      setTextError(false)
    }

    let copyObj = newFeedback
    copyObj.description = e.target.value
    setNewFeedback(copyObj)
  }

  const editFeedback = async (feedback: any) => {
    const editId = currentPost._id

    if (isEmpty) {
      setTextError(true)
    } else {
      try {
        const response = await fetch('https://game-feedback.netlify.app/api/feedback', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            feedback: newFeedback,
            editId: currentPost._id,
            changeType: 'Edit',
          }),
        })

        if (response.ok) {
          setSuggestionsData((suggestionData: any) =>
            suggestionData.map((item: any) =>
              item._id === feedback._id ? feedback : item
            )
          )
          setOpenEditFeedbackPage(false)
        }
      } catch (error) {
        console.error('Error adding feedback:', error)
      }
    }
  }

  const deleteFeedback = async (deleteId: any) => {
    try {
      const response = await fetch('https://game-feedback.netlify.app/api/feedback', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ deleteId, changeType }),
      })

      if (response.ok) {
        setSuggestionsData(
          suggestionsData.filter((item: any) => item._id !== deleteId)
        )
      }
    } catch (error) {
      console.error('Error adding comment:', error)
    }
  }

  const handleCancelChange = () => {
    if (changeType === 'Delete') {
      setChangeType('')
    } else {
      setOpenEditFeedbackPage(false)
    }
  }

  const handleDeleteButton = () => {
    if (changeType === 'Delete') {
      deleteFeedback(currentPost._id)
      setOpenEditFeedbackPage(false)
      router.push('/')
    }

    setChangeType('Delete')
  }

  return (
    <div className="newFeedbackContainer editFeedbackContainer">
      <div>
        <img src="/shared/icon-arrow-left.svg" />
        <button onClick={() => setOpenEditFeedbackPage(false)}>Go Back</button>
      </div>
      <div className="formContainer">
        <img
          src="/shared/icon-edit-feedback.svg"
          alt="edit feedback icon"
          className="editFeedbackIcon"
        />

        <h1>Editing '{currentPost.title}'</h1>
        <div className="formItemWrapper">
          <h2>Feedback Title</h2>
          <p>Add a short, descriptive headline</p>
          <input onChange={handleTitleChange}></input>
        </div>

        <div className="formItemWrapper">
          <h2>Category</h2>
          <p>Choose a category for your feedback</p>
          <button
            className={`${isOpen ? 'open' : ''} categoryDropdownButton`}
            onClick={toggleDropdown}
          >
            {dropValue}
            <img
              src={
                isOpen
                  ? '/shared/icon-arrow-up.svg'
                  : '/shared/icon-arrow-down.svg'
              }
            />
          </button>
          {isOpen && (
            <ul className="categoryDropdown">
              <li onClick={() => handleMenuItemClick('Feature')}>
                Feature
                {dropValue === 'Feature' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleMenuItemClick('UI')}>
                UI
                {dropValue === 'UI' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleMenuItemClick('UX')}>
                UX
                {dropValue === 'UX' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleMenuItemClick('Enhancement')}>
                Enhancement
                {dropValue === 'Enhancement' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleMenuItemClick('Bug')}>
                Bug
                {dropValue === 'Bug' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
            </ul>
          )}
        </div>

        <div className="formItemWrapper">
          <h2>Update Status</h2>
          <p>Change feedback state</p>
          <button
            className={`${statusIsOpen ? 'open' : ''} categoryDropdownButton`}
            onClick={toggleStatusDropdown}
          >
            {statusDropValue}
            <img
              src={
                statusIsOpen
                  ? '/shared/icon-arrow-up.svg'
                  : '/shared/icon-arrow-down.svg'
              }
            />
          </button>
          {statusIsOpen && (
            <ul className="categoryDropdown">
              <li onClick={() => handleStatusMenuItemClick('Suggestion')}>
                Suggestion
                {statusDropValue === 'Suggestion' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleStatusMenuItemClick('Planned')}>
                Planned
                {statusDropValue === 'Planned' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleStatusMenuItemClick('In-Progress')}>
                In-Progress
                {statusDropValue === 'In-Progress' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
              <li onClick={() => handleStatusMenuItemClick('Live')}>
                Live
                {statusDropValue === 'Live' && (
                  <img className="check" src="/shared/icon-check.svg" />
                )}
              </li>
            </ul>
          )}
        </div>

        <div className="formItemWrapper">
          <h2>Feedback Detail</h2>
          <p>
            Include any specific comments on what should be improved, added,
            etc.
          </p>
          <textarea
            className={`feedbackDetail ${textError && 'empty'}`}
            onChange={handleDescriptionChange}
          ></textarea>
          {textError && <p className="errorMessage">Cant be Empty</p>}
        </div>

        <div className="editButtonWrapper">
          <button
            className={`deleteButton ${
              changeType === 'Delete' ? 'confirmDelete' : ''
            }`}
            onClick={handleDeleteButton}
          >
            {changeType === 'Delete' ? 'Confirm Delete' : 'Delete'}
          </button>
          <button onClick={handleCancelChange}>Cancel</button>
          <button onClick={() => editFeedback(newFeedback)}>
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}
