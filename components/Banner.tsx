import React from 'react'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

interface BannerProps {
  openMobileMenu: boolean
  setOpenMobileMenu: any
}

export default function Banner({ openMobileMenu, setOpenMobileMenu }: BannerProps) {
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
      <button className='mobileHamburgerMenu' onClick={() => setOpenMobileMenu(!openMobileMenu)}>
        <img src={`${openMobileMenu ? '/shared/mobile/icon-close.svg' : '/shared/mobile/icon-hamburger.svg'}`} alt="hamburger menu icon" />
      </button>
    </div>
  )
}
