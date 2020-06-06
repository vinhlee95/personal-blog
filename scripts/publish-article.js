/**
 * Script to publish local markdown article to Medium
 * using Medium SDK
 *
 * @author Vinh Le <lethanhvinh95@gmail.com>
 *
 */
const path = require('path')
const medium = require('medium-sdk')
const dotenv = require('dotenv')
dotenv.config({path: path.resolve(__dirname, '../.env')})

// Medium-related tokens
const client = new medium.MediumClient({
  clientId: process.env.MEDIUM_CLIENT_ID,
  clientSecret: process.env.MEDIUM_CLIENT_SECRET
})
client.setAccessToken(process.env.MEDIUM_TOKEN)

// Constants
const utils = require('./utils')

// TODO: Change blogPath
const blogPath = path.resolve(__dirname, '../content/blog/dynamo-db-2/index.md')

const publish = async () => {
  try {
    const {frontmatter, content} = await utils.transformPostFromPath(blogPath)

    client.getUser(function (err, user) {
      if(err) {
        throw new Error('Cannot get user. May be it is time to get new authorization token')
      }

      client.createPost({
        userId: user.id,
        title: frontmatter.title,
        contentFormat: medium.PostContentFormat.MARKDOWN,
        content,
        publishStatus: medium.PostPublishStatus.DRAFT
      }, function (error, post) {
        if(error) {
          console.error('Error in creating post by Medium client', error)
          return
        }

        console.log('Successfully publish new draft 🚀🥂', post)
      })
    })
  } catch(error) {
    console.error('Error in transforming post from markdown file', error)
    return
  }
}

publish()