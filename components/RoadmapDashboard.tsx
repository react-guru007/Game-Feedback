import React from 'react'

interface RoadmapProps {
  openRoadmapPage: any
  setOpenRoadmapPage: any
}

export default function RoadmapDashboard({ openRoadmapPage, setOpenRoadmapPage }: RoadmapProps) {
  return (
    <div className="roadmapContainer">
      <div className="roadmapHeader">
        <h2>Roadmap</h2>
        <a onClick={() => setOpenRoadmapPage(true)}>View</a>
      </div>

      <div className="statusContainer">
        <div className="status">
          <div className="circle"></div>
          <p>Planned</p>
          <p>2</p>
        </div>
        <div className="status">
          <div className="circle"></div>
          <p>In-Progress</p>
          <p>3</p>
        </div>
        <div className="status">
          <div className="circle"></div>
          <p>Live</p>
          <p>1</p>
        </div>
      </div>
    </div>
  )
}
