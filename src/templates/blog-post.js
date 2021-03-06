import React from "react"
import { graphql } from "gatsby"
import readingTime from 'reading-time'
import {IoMdTime} from 'react-icons/io'

import Bio from "../components/bio"
import Layout from "../components/layout"
import SEO from "../components/seo"
import { rhythm, scale } from "../utils/typography"
import BlogPostFooter from "./blog-post-footer"
import {ReadingTime} from '../styles/ReadingTime'

const BlogPostTemplate = ({ data, pageContext, location }) => {
  const post = data.markdownRemark
  const siteTitle = data.site.siteMetadata.title
  const { previous, next } = pageContext
  const {text} = readingTime(post.html)

  return (
    <Layout location={location} title={siteTitle}>
      <SEO
        title={post.frontmatter.title}
        description={post.frontmatter.description || post.excerpt}
      />
      <article>
        <header>
          <h1
            style={{
              marginTop: rhythm(1),
              marginBottom: 0,
            }}
          >
            {post.frontmatter.title}
          </h1>
          <p
            style={{
              ...scale(-1 / 5),
              marginBottom: 8
            }}
          >
            {post.frontmatter.date}
          </p>
          <ReadingTime>
            <IoMdTime size={16} />
            <span>{text}</span>
          </ReadingTime>
        </header>
        <section dangerouslySetInnerHTML={{ __html: post.html }} />
        <hr
          style={{
            marginBottom: rhythm(1),
          }}
        />
        <footer>
          <h3>
            Thanks for reading this blog! And stay tuned for upcoming ones 🤩
            <br />
            <br />
            👨🏻‍💻🤓🏋️‍🏸🎾♂️🚀
          </h3>
          <Bio />
        </footer>
      </article>

      <BlogPostFooter
        previous={previous}
        next={next}
      />
    </Layout>
  )
}

export default BlogPostTemplate

export const pageQuery = graphql`
  query BlogPostBySlug($slug: String!) {
    site {
      siteMetadata {
        title
      }
    }
    markdownRemark(fields: { slug: { eq: $slug } }) {
      id
      excerpt(pruneLength: 160)
      html
      frontmatter {
        title
        date(formatString: "MMMM DD, YYYY")
      }
    }
  }
`
