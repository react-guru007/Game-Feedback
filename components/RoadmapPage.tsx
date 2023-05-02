import React from 'react'

interface RoadmapPageProps {
    openRoadmapPage: boolean
    setOpenRoadmapPage: any
}

export default function RoadmapPage({ openRoadmapPage, setOpenRoadmapPage }: RoadmapPageProps) {



  return (
    <div className='roadmapPageContainer'>
        <div className='roadmapHeaderContainer'>
            
            <div>
                <button className='backButtonWrapper' onClick={() => setOpenRoadmapPage(false)}>
                    <img src='/shared/icon-arrow-left.svg'/>
                    <p >Go Back</p>
                </button>
                <h1>Roadmap</h1>
            </div>
            <button className='feedbackButton' >
                <img src="/shared/icon-plus.svg" />
                Add Feedback
            </button>
        </div>

        <div className='roadmapLayoutContainer'>
            
            <div className='layoutColumn'>
                planned
            </div>
            <div className='layoutColumn'>
                inprogress
            </div>
            <div className='layoutColumn'>
                live
            </div>
        </div>
    </div>
  )
}
