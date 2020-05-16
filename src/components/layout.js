import React from "react"
import { Link } from "gatsby"
import { MdKeyboardArrowLeft } from 'react-icons/md'

import { Theme } from './theme/theme'

import { rhythm, scale } from "../utils/typography"

const Layout = ({ location, title, children }) => {
  const rootPath = `${__PATH_PREFIX__}/`
  let header

  if (location.pathname === rootPath) {
    header = (
      <h1
        style={{
          ...scale(1.5),
          marginBottom: rhythm(1.5),
          marginTop: 0,
        }}
      >
        <Link
          style={{
            boxShadow: `none`,
            color: `inherit`,
          }}
          to={`/`}
        >
          {title}
        </Link>
      </h1>
    )
  } else {
    header = (
      <Link
        to={'/'}
      >
        <div className='go-back-button'>
          <MdKeyboardArrowLeft size={32} />
          All blogs
        </div>
      </Link>
    )
  }
  return (
    <Theme>
      <header>{header}</header>
      <main>{children}</main>
      <footer style={{textAlign: 'center'}}>
        © {new Date().getFullYear()} Vinh Le
      </footer>
    </Theme>
  )
}

export default Layout
