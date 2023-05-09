import { useState, useEffect } from 'react'
import Head from 'next/head'
import Suggestions from '../components/Suggestions'
import Banner from '../components/Banner'
import Tags from '../components/Tags'
import RoadmapDashboard from '../components/RoadmapDashboard'
import NewFeedback from '../components/NewFeedback'
import FeedbackPage from '../components/FeedbackPage'
import EditFeedback from '../components/EditFeedback'
import { useSession } from 'next-auth/react'
import RoadmapPage from '../components/RoadmapPage'
import { Post } from '../types/data'

interface HomeProps {
  data: Post[]
}

export default function Home({ data }: HomeProps) {
  const [suggestionsData, setSuggestionData] = useState(data)

  const [tag, setTag] = useState('All')

  const [tagData, setTagData] = useState(data)

  const [openNewFeedback, setOpenNewFeedback] = useState(false)

  const [openFeedbackPage, setOpenFeedbackPage] = useState(false)

  const [openEditFeedbackPage, setOpenEditFeedbackPage] = useState(false)

  const [openRoadmapPage, setOpenRoadmapPage] = useState(false)

  const [openMobileMenu, setOpenMobileMenu] = useState(false)

  const [pageId, setPageId] = useState('')

  const session = useSession()

  return (
    <div className="container">
      <Head>
        <title>game-feedback-app</title>
        <link rel="icon" href="/favicon-32x32.png" />
      </Head>
      {openNewFeedback && (
        <NewFeedback
          openNewFeedback={openNewFeedback}
          setOpenNewFeedback={setOpenNewFeedback}
          suggestionsData={suggestionsData}
          setSuggestionsData={setSuggestionData}
        />
      )}

      {openFeedbackPage && (
        <FeedbackPage
          setOpenFeedbackPage={setOpenFeedbackPage}
          openEditFeedbackPage={openEditFeedbackPage}
          setOpenEditFeedbackPage={setOpenEditFeedbackPage}
          pageId={pageId}
          data={data}
        />
      )}

      {openEditFeedbackPage && (
        <EditFeedback
          setOpenEditFeedbackPage={setOpenEditFeedbackPage}
          pageId={pageId}
          setPageId={setPageId}
          data={data}
          suggestionsData={suggestionsData}
          setSuggestionsData={setSuggestionData}
        />
      )}

      {openRoadmapPage && (
        <RoadmapPage
          setOpenRoadmapPage={setOpenRoadmapPage}
          suggestionsData={suggestionsData}
          setSuggestionsData={setSuggestionData}
          session={session}
          setPageId={setPageId}
          setOpenFeedbackPage={setOpenFeedbackPage}
          setOpenNewFeedback={setOpenNewFeedback}
        />
      )}

      {!openNewFeedback &&
        !openFeedbackPage &&
        !openEditFeedbackPage &&
        !openRoadmapPage && (
          <main className={`main`}>
            <section>
              <Banner
                openMobileMenu={openMobileMenu}
                setOpenMobileMenu={setOpenMobileMenu}
              />

              <div className="mobileMenuItems">
                <Tags
                  tag={tag}
                  setTag={setTag}
                  suggestionsData={suggestionsData}
                  setTagData={setTagData}
                />
                <RoadmapDashboard
                  setOpenRoadmapPage={setOpenRoadmapPage}
                  suggestionsData={suggestionsData}
                  setSuggestionsData={setSuggestionData}
                />
              </div>

              {openMobileMenu && (
                <div className="mobileMenuOverlay">
                  <div className="transparent"></div>
                  <div className="menu">
                    <Tags
                      tag={tag}
                      setTag={setTag}
                      suggestionsData={suggestionsData}
                      setTagData={setTagData}
                    />
                    <RoadmapDashboard
                      setOpenRoadmapPage={setOpenRoadmapPage}
                      suggestionsData={suggestionsData}
                      setSuggestionsData={setSuggestionData}
                    />
                  </div>
                </div>
              )}
            </section>

            <Suggestions
              setOpenNewFeedback={setOpenNewFeedback}
              setOpenFeedbackPage={setOpenFeedbackPage}
              setPageId={setPageId}
              session={session}
              suggestionsData={suggestionsData}
              setSuggestionsData={setSuggestionData}
              tag={tag}
              tagData={tagData}
            />
          </main>
        )}
    </div>
  )
}

export async function getStaticProps() {
  try {
    const response = await fetch('http://localhost:3000/api/feedback')
    const data = await response.json()
    return { props: { data } }
  } catch (error) {
    console.error('Error fetching data:', error)
    return { props: { data: [] } }
  }
}
