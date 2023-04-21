import React from 'react'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

export default function Banner() {
  const { data: session, status } = useSession()

  const userName = session?.user?.name

  return (
    <div className="headerContainer">
      <h1>
        Game Feedback
        <p>Feedback Form</p>
        <div className="signWrapper">
          <p className='userName'>{session && userName}</p>
          <button onClick={session ? () => signOut() : () => signIn()}>
            {session ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </h1>
      <Image
        src={'/suggestions/desktop/background-header.png'}
        fill
        alt="background header"
      />
    </div>
  )
}
