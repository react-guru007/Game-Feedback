import React from 'react'
import Image from 'next/image'

export default function Banner() {
  return (
    <div className='headerContainer'>
      <h1>Game Feedback
        <p>Feedback Form</p>
      </h1>
      <Image src={'/suggestions/desktop/background-header.png'} fill alt='background header'/>
    </div>
  )
}
