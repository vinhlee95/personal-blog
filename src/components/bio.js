import React from 'react'
import { StaticQuery, graphql } from 'gatsby'
import Image from 'gatsby-image'
import { rhythm } from '../utils/typography'
import {Link} from '../styles';

function Bio() {
  return (
    <StaticQuery
      query={bioQuery}
      render={data => {
				const {
					author: {name}, siteUrl,
					social: { twitter, medium, linkedIn, github }
				} = data.site.siteMetadata
        return (
          <div
            style={{
							display: 'flex',
							borderBottom: '1px solid white',
							marginBottom: '30px',
							paddingBottom: '30px',
							boxSizing: 'border-box'
            }}
          >
						<Image
              fixed={data.avatar.childImageSharp.fixed}
              style={{
                marginRight: rhythm(1 / 2),
                marginBottom: 0,
                minWidth: 50,
                borderRadius: `100%`,
              }}
            />

            <p
							style={{
								margin: 0,
							}}
						>
              Written by <strong>{name}</strong> - a software developer living in Helsinki area, Finland.
							<br/>
							Learn more in my <Link href={siteUrl} target='_blank'><strong>personal site</strong></Link>.
							<br />
							Or hit me up on:
							<Link
								href={twitter} target='_blank' >
								<strong> Twitter</strong>
							</Link>
							<Link
								href={medium} target='_blank' >
								<strong> Medium</strong>
							</Link>
							<Link
								href={linkedIn} target='_blank' >
								<strong> LinkedIn</strong>
							</Link>
							<Link
								href={github} target='_blank' >
								<strong> Github</strong>
							</Link>
            </p>
          </div>
        )
      }}
    />
  )
}

const bioQuery = graphql`
  query BioQuery {
    avatar:file(absolutePath: { regex: "/profile.jpg/" }) {
      childImageSharp {
        fixed(width: 50, height: 50) {
          ...GatsbyImageSharpFixed
        }
      }
    }
    site {
      siteMetadata {
				author {
          name
        }
				siteUrl
				social {
					twitter
					medium
					linkedIn
					github
				}
      }
    }
  }
`

export default Bio
