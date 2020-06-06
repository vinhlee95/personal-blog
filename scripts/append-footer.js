/**
 * Append footer to article
 *
 * @author Vinh Le <lethanhvinh95@gmail.com>
 *
 */
const {siteMetadata: {social, siteUrl}} = require('../gatsby-config')
social['personal site'] = siteUrl

const createHorizontalRule = () => ({
  type: `thematicBreak`,
})

const capitalizeSiteName = site => {
	const charList = site.split('')
	charList[0] = charList[0].toUpperCase()
	return charList.join('')
}

const appendSocialMedia = () => {
	const heading = {
		type: 'heading',
		depth: 2,
		children: [
			{
				type: 'text',
				value: 'Say Hello 🙌 on:'
			}
		]
	}

	return [
		heading,
		...Object.keys(social).map(site => ({
			type: 'paragraph',
			children: [{
				type: 'link',
				url: social[site],
				children: [{
					type: 'text',
					value: `🔗 ${capitalizeSiteName(site)}`
				}]
			}]
		}))
	]
}

const appendOriginalPostReference = (postUrl) => ({
	type: `paragraph`,
	children: [
		{
			type: `text`,
			value: `This blog is originally published at `,
		},
		{
			type: 'link',
			url: postUrl,
			children: [
				{
					type: 'text',
					value: postUrl
				}
			]
		},
	],
})

const appendEndingNotes = () => {
	return [
		{
			type: 'heading',
			depth: 2,
			children: [
				{
					type: 'text',
					value: 'That’s the end of this blog. I would love to hear your ideas and thoughts 🤗 Please jot them down bellow 👇👇👇'
				}
			]
		},
		{
			type: 'heading',
			depth: 1,
			children: [
				{
					type: 'text',
					value: '✍️ Written by '
				}
			]
		},
		{
			type: 'heading',
			depth: 2,
			children: [
				{
					type: 'text',
					value: 'Vinh Le '
				},
				{
					type: 'link',
					url: social.twitter,
					children: [
						{
							type: 'text',
							value: '@vinhle95'
						}
					]
				}
			]
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: '👨🏻‍💻🤓🏋️‍🏸🎾🚀'
				}
			]
		},
		{
			type: 'paragraph',
			children: [
				{
					type: 'text',
					value: 'A hustler, lifelong learner, tech lover & software developer'
				}
			]
		}
	]
}

module.exports.appendFooter = (options) => {
	const { postUrl } = options
  return function transformer(tree) {
		tree.children = [
      ...tree.children,
      createHorizontalRule(),
			...appendEndingNotes(),
			appendOriginalPostReference(postUrl),
			...appendSocialMedia()
    ]
  }
}
