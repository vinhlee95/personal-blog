var vfile = require('to-vfile')
const frontmatterPlugin = require('remark-frontmatter')
const Remark = require('remark')
const parse = require('remark-parse')
const stringify = require('remark-stringify')
const yaml = require('js-yaml')
const visit = require('unist-util-visit')

module.exports.transformPostFromPath = async (filePath) => {
	console.log(filePath)
	const frontmatter = await getFrontmatter(filePath)
	const siteUrl = process.env.MEDIUM_CALLBACK_URL

	return new Promise((resolve, reject) => {
		new Remark()
			.data(`settings`, {
				commonmark: true,
				footnotes: true,
				pedantic: true,
			})
			// creates the MAST from markdown
			.use(parse)
			// to create a markdown yaml node in the MAST
			.use(frontmatterPlugin)
			// converts the MAST back to markdown
			.use(stringify)
			// apply it to the file
			.process(vfile.readSync(filePath), function(err, vfile) {
				if (err) return reject(err)
				return resolve({
					content: String(vfile),
					frontmatter,
					siteUrl
				})
			})
	})
}

const getFrontmatter = async (filePath) => {
  let frontmatter
  function frontmatterToJs() {
    return function transformer(tree) {
      visit(tree, `yaml`, node => {
        frontmatter = yaml.load(node.value)
      })
    }
	}

  return new Promise((resolve, reject) => {
    new Remark()
      .data(`settings`, {
        commonmark: true,
        footnotes: true,
        pedantic: true,
      })
      .use(parse)
      .use(frontmatterPlugin)
      .use(frontmatterToJs)
      .process(vfile.readSync(filePath), function(err) {
        if (err) return reject(err)
        if (!frontmatter)
          return reject(new Error('No frontmatter found in markdown-AST'))
        console.log(`Found frontmatter ...`)
        return resolve(frontmatter)
      })
  })
}