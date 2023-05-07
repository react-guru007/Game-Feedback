import React, { useState } from 'react'
import IconArrowUp from './IconArrowUp'

interface RoadmapPageProps {
  openRoadmapPage: boolean
  setOpenRoadmapPage: React.Dispatch<React.SetStateAction<boolean>>
  suggestionsData: any
  setSuggestionsData: any
  session: any
  pageId: string
  setPageId: any
  openFeedbackPage: boolean
  setOpenFeedbackPage: any
  openNewFeedback: any
  setOpenNewFeedback: any
}

export default function RoadmapPage({
  openRoadmapPage,
  setOpenRoadmapPage,
  suggestionsData,
  setSuggestionsData,
  session,
  pageId,
  setPageId,
  openFeedbackPage,
  setOpenFeedbackPage,
  openNewFeedback,
  setOpenNewFeedback,
}: RoadmapPageProps) {
  const user = session?.data?.user?.name

  const [hasUserUpvoted, setHasUserUpvoted] = useState(false)

  const [strokeColors, setStrokeColors] = useState<Record<string, string>>({})

  const [mobileColumn, setMobileColumn] = useState(1)

  const handleOpenFeedbackPage = (id: string) => {
    setPageId(id)
    setOpenRoadmapPage(false)
    setOpenFeedbackPage(true)
  }

  const handleOpenNewFeedbackPage = () => {
    setOpenRoadmapPage(false)
    setOpenNewFeedback(true)
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
    <div className="roadmapPageContainer">
      {/* header bar */}
      <div className="roadmapHeaderContainer">
        <div>
          <button
            className="backButtonWrapper"
            onClick={() => setOpenRoadmapPage(false)}
          >
            <img src="/shared/icon-arrow-left.svg" />
            <p>Go Back</p>
          </button>
          <h1>Roadmap</h1>
        </div>
        <button className="feedbackButton" onClick={handleOpenNewFeedbackPage}>
          <img src="/shared/icon-plus.svg" />
          Add Feedback
        </button>
      </div>

      {/* roadmap columns */}

      {/* mobile selector */}
      <div className="mobileSelectorWrapper">
        <button onClick={() => setMobileColumn(1)} className={`${mobileColumn === 1 && 'selectedItem'}`}>
          Planned{' '}
          {`(${
            suggestionsData.filter((item: any) => item.status === 'Planned')
              .length
          })`}
        </button>
        <button onClick={() => setMobileColumn(2)} className={`${mobileColumn === 2 && 'selectedItem'}`}>
          In-Progress{' '}
          {`(${
            suggestionsData.filter((item: any) => item.status === 'In-Progress')
              .length
          })`}
        </button>
        <button onClick={() => setMobileColumn(3)} className={`${mobileColumn === 3 && 'selectedItem'}`}>
          Live{' '}
          {`(${
            suggestionsData.filter((item: any) => item.status === 'Live')
              .length
          })`}
        </button>
      </div>

      <div className={`roadmapLayoutContainer `}>
        {/* planned column */}
        <div className={`layoutColumn ${mobileColumn !== 1 && 'hideColumn'}`}>
          <div className="columnHeader">
            <h2>
              Planned
              {` (${
                suggestionsData.filter((item: any) => item.status === 'Planned')
                  .length
              })`}
            </h2>
            <p>Ideas prioritized for researched</p>
          </div>
          {suggestionsData
            .filter((item: any) => item.status === 'Planned')
            .map((item: any) => (
              <div className="roadmapItem" key={item._id}>
                <div className="colorBar plannedColor"></div>
                <div className="itemContent">
                  <div className="statusWrapper">
                    <div className="plannedColor"></div>
                    <p>Planned</p>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="itemCategory">{item.category}</div>
                  <div className="itemFooter">
                    <button
                      className={`${
                        item?.upvotedBy?.some(
                          (item2: any) => item2 === item.name
                        ) && 'upvoted'
                      } roadmapUpvoteButton`}
                      onClick={() => upvoteFeedback(item._id)}
                      onMouseEnter={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors: any) => ({
                            ...prevColors,
                            [item._id]: 'black',
                          }))
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors) => ({
                            ...prevColors,
                            [item._id]: 'white',
                          }))
                        }
                      }}
                    >
                      <IconArrowUp
                        className="iconArrowUp"
                        strokeColor={`${
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                            ? strokeColors[item._id] || 'white'
                            : '#4661E6'
                        }`}
                      />
                      {item.upvotes}
                    </button>
                    <button
                      className="commentsWrapper"
                      onClick={() => handleOpenFeedbackPage(item._id)}
                    >
                      <img
                        src="/shared/icon-comments.svg"
                        alt="comment bubble"
                      />
                      <p>{item.comments.length}</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* In-Progress column */}
        <div className={`layoutColumn ${mobileColumn !== 2 && 'hideColumn'}`}>
          <div className="columnHeader">
            <h2>
              In-Progress
              {` (${
                suggestionsData.filter(
                  (item: any) => item.status === 'In-Progress'
                ).length
              })`}
            </h2>
            <p>Ideas prioritized for researched</p>
          </div>
          {suggestionsData
            .filter((item: any) => item.status === 'In-Progress')
            .map((item: any) => (
              <div className="roadmapItem">
                <div className="colorBar progressColor"></div>
                <div className="itemContent">
                  <div className="statusWrapper">
                    <div className="progressColor"></div>
                    <p>In-Progress</p>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="itemCategory">{item.category}</div>
                  <div className="itemFooter">
                    <button
                      className={`${
                        item?.upvotedBy?.some(
                          (item2: any) => item2 === item.name
                        ) && 'upvoted'
                      } roadmapUpvoteButton`}
                      onClick={() => upvoteFeedback(item._id)}
                      onMouseEnter={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors: any) => ({
                            ...prevColors,
                            [item._id]: 'black',
                          }))
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors) => ({
                            ...prevColors,
                            [item._id]: 'white',
                          }))
                        }
                      }}
                    >
                      <IconArrowUp
                        className="iconArrowUp"
                        strokeColor={`${
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                            ? strokeColors[item._id] || 'white'
                            : '#4661E6'
                        }`}
                      />
                      {item.upvotes}
                    </button>
                    <button
                      className="commentsWrapper"
                      onClick={() => handleOpenFeedbackPage(item._id)}
                    >
                      <img
                        src="/shared/icon-comments.svg"
                        alt="comment bubble"
                      />
                      <p>{item.comments.length}</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>

        {/* Live column */}
        <div className={`layoutColumn ${mobileColumn !== 3 && 'hideColumn'}`}>
          <div className="columnHeader">
            <h2>
              Live
              {` (${
                suggestionsData.filter((item: any) => item.status === 'Live')
                  .length
              })`}
            </h2>
            <p>Ideas prioritized for researched</p>
          </div>
          {suggestionsData
            .filter((item: any) => item.status === 'Live')
            .map((item: any) => (
              <div className="roadmapItem">
                <div className="colorBar liveColor"></div>
                <div className="itemContent">
                  <div className="statusWrapper">
                    <div className="liveColor"></div>
                    <p>Live</p>
                  </div>

                  <h3>{item.title}</h3>
                  <p>{item.description}</p>
                  <div className="itemCategory">{item.category}</div>
                  <div className="itemFooter">
                    <button
                      className={`${
                        item?.upvotedBy?.some(
                          (item2: any) => item2 === item.name
                        ) && 'upvoted'
                      } roadmapUpvoteButton`}
                      onClick={() => upvoteFeedback(item._id)}
                      onMouseEnter={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors: any) => ({
                            ...prevColors,
                            [item._id]: 'black',
                          }))
                        }
                      }}
                      onMouseLeave={() => {
                        if (
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                        ) {
                          setStrokeColors((prevColors) => ({
                            ...prevColors,
                            [item._id]: 'white',
                          }))
                        }
                      }}
                    >
                      <IconArrowUp
                        className="iconArrowUp"
                        strokeColor={`${
                          item?.upvotedBy?.some(
                            (item2: any) => item2 === item.name
                          )
                            ? strokeColors[item._id] || 'white'
                            : '#4661E6'
                        }`}
                      />
                      {item.upvotes}
                    </button>
                    <button
                      className="commentsWrapper"
                      onClick={() => handleOpenFeedbackPage(item._id)}
                    >
                      <img
                        src="/shared/icon-comments.svg"
                        alt="comment bubble"
                      />
                      <p>{item.comments.length}</p>
                    </button>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  )
}
