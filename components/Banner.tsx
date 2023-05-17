import React, { useEffect, useState } from 'react'
import Image from 'next/image'
import { useSession, signIn, signOut } from 'next-auth/react'

interface BannerProps {
  openMobileMenu: boolean
  setOpenMobileMenu: React.Dispatch<React.SetStateAction<boolean>>
}

export default function Banner({
  openMobileMenu,
  setOpenMobileMenu,
}: BannerProps) {
  const { data: session, status } = useSession()

  const userName = session?.user?.name

  const [windowWidth, setWindowWidth] = useState(0)

  //checks window width to set correct banner image src
  useEffect(() => {
    setWindowWidth(window.innerWidth)

    const handleResize = () => {
      setWindowWidth(window.innerWidth)
    }

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return (
    <div className="headerContainer">
      <h1>
        Game Feedback
        <p>Feedback Form</p>
        <div className="signWrapper">
          <p className="userName">{session && userName}</p>
          <button onClick={session ? () => signOut() : () => signIn()}>
            {session ? 'Sign Out' : 'Sign In'}
          </button>
        </div>
      </h1>
      <Image
        src={
          windowWidth > 800
            ? '/suggestions/desktop/background-header.png'
            : '/suggestions/mobile/background-header.png'
        }
        fill
        alt="background header"
        priority={true}
      />
      <button
        className="mobileHamburgerMenu"
        onClick={() => setOpenMobileMenu(!openMobileMenu)}
      >
        <img
          src={`${
            openMobileMenu
              ? '/shared/mobile/icon-close.svg'
              : '/shared/mobile/icon-hamburger.svg'
          }`}
          alt="hamburger menu icon"
        />
      </button>
    </div>
  )
}
