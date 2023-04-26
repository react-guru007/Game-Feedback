import { useState, useEffect } from 'react'
import Head from 'next/head'
import clientPromise from '../lib/mongodb'
import { InferGetServerSidePropsType } from 'next'
import Suggestions from '../components/Suggestions'
import Banner from '../components/Banner'
import Tags from '../components/Tags'
import RoadmapDashboard from '../components/RoadmapDashboard'
import NewFeedback from '../components/NewFeedback'
import FeedbackPage from '../components/FeedbackPage'
import EditFeedback from '../components/EditFeedback'
import { useSession } from 'next-auth/react'

interface HomeProps {
  data: any
}

export default function Home({ data }: HomeProps) {
  const [tag, setTag] = useState('All')

  const [openNewFeedback, setOpenNewFeedback] = useState(false)

  const [openFeedbackPage, setOpenFeedbackPage] = useState(false)

  const [openEditFeedbackPage, setOpenEditFeedbackPage] = useState(false)

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
        />
      )}

      {openFeedbackPage && (
        <FeedbackPage 
          openFeedbackPage={openFeedbackPage}
          setOpenFeedbackPage={setOpenFeedbackPage}
          openEditFeedbackPage={openEditFeedbackPage}
          setOpenEditFeedbackPage={setOpenEditFeedbackPage}
          pageId={pageId}
          setPageId={setPageId}
          data={data}
        />
      )}

      {openEditFeedbackPage && (
        <EditFeedback 
        openEditFeedbackPage={openEditFeedbackPage}
        setOpenEditFeedbackPage={setOpenEditFeedbackPage}
        pageId={pageId}
        setPageId={setPageId}
        data={data}
        />
      )}

      {!openNewFeedback && !openFeedbackPage && !openEditFeedbackPage &&(
        <main className={`main`}>
          <section>
            <Banner />
            <Tags tag={tag} setTag={setTag} />
            <RoadmapDashboard />
          </section>

          <Suggestions
            openNewFeedback={openNewFeedback}
            setOpenNewFeedback={setOpenNewFeedback}
            openFeedbackPage={openFeedbackPage}
            setOpenFeedbackPage={setOpenFeedbackPage}
            pageId={pageId}
            setPageId={setPageId}
            data={data}
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
