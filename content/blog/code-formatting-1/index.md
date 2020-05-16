---
title: "Tooling for boosting your development workflow"
date: "2019-08-26"
---

## Part 1: Code formatting
If programming is just a 1-person-to-computer process, things will probably be dead simple. You write whatever you think that will work, and the computer will help you to verify.

Sadly, that is not how it works most of the time. When you work in a team, your peers will need to review your codes and vice versa. Here is the time where things heat up *a little bit* 🙃

![code formatting](https://i.imgflip.com/38s5zo.jpg "why formatting")

## Why bothering?

### Poorly formatted codes slow down review process
When coworkers tag you in a pull request (PR), they want to quickly get approval to move the next feature out of backlog. On the other side, you want to go through it fast as well. However, when the code is poorly formatted, or even worse, not formatted at all, you both are in trouble.

Let's face the truth: each of us has different *coding style*. Thus, this difference will surely take you more time to understand logics underneath.

Take an example of handling a **Promise** in JavaScript in general:
```js
getShots(myShotsEndpoint).then((shots) => {return shots.forEach(shot => {
	saveMyShot(shot)
	removeMyLastShot()
	return
})}).catch(error => {
	if(getErrorStatus(error) === 401) { handleUnauthenticatedUser() } else {
		showErrorMessage('Cannot get my shot now!!!')
	}
})
```
Urghhhh 🤦🏻‍♂️😐🔥

I know what you are having in mind 😤But bear with me a little more. If you get into Space/Tab trouble, no don't lie, I know you were 🤗 functions like this will probably ruin your day:
```js
getShots(myShotsEndpoint).then((shots) => {return shots.forEach(shot => {
		saveMyShot(shot)
	removeMyLastShot()
			return
})}).catch(error => {
		if(getErrorStatus(error) === 401) { handleUnauthenticatedUser() } else {
				showErrorMessage('Cannot get my shot now!!!')
	}
})
```
> I understand, it is exhausting reading those codes 😥

And this is just a Promise handler. Imagining there are tens of components with function logics, UI elements, styling..etc ahead. Your job is to *go through all of them*. Annoyingly, this blocker significantly slows you down.

And trust me, your colleague is not happy either when getting a comment like:

> *"Please add 1 more tab in line number 531"*

Their jobs are to take care of business logics, not a small space/tab that you, the reviewer, does not feel right. From here, you have no choice rather than giving up, accepting a painful truth and telling yourself

> There will be no problem. The computer will take care of that.

Until a day...

### A nightmare to maintain
A new guy comes in to maintain this project and his reaction will probably follow this chain: 🧐🤨😡🤬

These uggggly code blocks will surely make it more difficult to maintain. When more developers go on board with different coding styles, maintainance becomes more challenging.

![rewrite](https://i.imgflip.com/38s842.jpg "rewrite")

### Fortunately, you don't.
There are tools out there that could be your team's saviour. Let me introduce 1 of them that already saved mine 🤩

## Prettier
[Prettier](https://prettier.io/) is an awesome tool for code formatting. It has supports for many languages, great documentation and easy to get started.

### Time for coding now! 👨🏻‍💻💪
I will show you how to set it up in a NodeJS module, as it is what I feel most comfortable with 🔥
Nonetheless, it should share many similarities with your projects.

### Step 1: Install [Prettier](https://www.npmjs.com/package/prettier) and [TSLint](https://www.npmjs.com/package/tslint) (or ESLint if you are not a fan of TypeScript)
```bash
npm install --save-dev prettier tslint
--or--
yarn add -D prettier tslint
```
You also need to install some helpers/plugins to make Prettier and TS Lint works nicely together:
```bash
npm install --save-dev tslint-config-prettier tslint-plugin-prettier
--or--
yarn add -D tslint-config-prettier tslint-plugin-prettier
```

In a nutshell, [`tslint-config-prettier`](https://github.com/prettier/tslint-config-prettier) disables [conflicting rules](https://unpkg.com/tslint-config-prettier@1.18.0/lib/index.json) between TSLint and Prettier.

### Step 2: Config linting rules for TSLint
Create `tslint.json` file in the root directory of the project:
```bash
touch tslint.json
code . tslint.json (*)
```
(*) The command `code .` I used is a feature of [VSCode](https://code.visualstudio.com/). Hands up VSCode fans! 🚀

You then can add rules in this config file. For the sake of simplicity, I will introduce some basic rules. Go [here](https://github.com/palantir/tslint) for your specific needs.

**tslint.json**
```js
{
	"defaultSeverity": "error",
	"extends": ["tslint:recommended", "tslint-config-prettier"],
	"jsRules": {},
	"rulesDirectory": ["tslint-plugin-prettier"],
	"rules": {
		"prettier": true,
	},
	"linterOptions": {
		"exclude": ["node_modules/**/*.ts"]
	}
}

```

### Step 3: Add prettier (formatting) rules
You will need to tell Prettier how you want your code to be formatted. To do that, let's create a [config file](https://prettier.io/docs/en/configuration.html), just like what we did for TSLint
```bash
touch .prettierrc
code . .prettierrc
```
Let's add some rules in this file ✍️
```
{
	"arrowParens": "avoid",
	"bracketSpacing": false,
	"insertPragma": false,
	"printWidth": 80,
	"proseWrap": "preserve",
	"requirePragma": false,
	"semi": false,
	"singleQuote": true,
	"trailingComma": "all",
	"tabWidth": 2,
	"useTabs": true
}
```
Remember, what you specify here will be exactly how Prettier formats your code. For example, last 2 lines tell Prettier to use Tab width = 2 (Sorry Space fans out there 😔). `"singleQuote": true`, for instance, will replace all double quotes by single ones. There are many other [options](https://prettier.io/docs/en/options.html) which you might want to refer to.

### Step 4: Format your code
There are 2 ways that you can do it, either right before saving a file or all files together when you feel like.

**Format on Save**

This is an Editor-specific feature, which means you have to enable this feature inside your editor's Settings. In [VSCode](https://code.visualstudio.com/docs/getstarted/settings), for instance, you can do that by putting this line in `settings.json`:
```
"editor.formatOnSave": true
```

**Format the entire project**

I personally prefer this way as it gives me more control over which types of file that I want to format. Let's write a script in `package.json`
```json
...
"name": "awesome-formatter",
"author": "ShotCode <shotcode@gmail.com>",
"scripts": {
	"format": "prettier \"**/*.+(js|json|ts|md|mdx|graphql)\" --write"
}
...
```
What does that `format` script do?

It tells Prettier to apply formatting rules that we configured in `prettierrc` on specified file extensions. In this case, they are `.js, .json, .ts...` you name it. Next we tell Prettier to **override** those files by `--write` command.

Let's run the script and see how it works:
```bash
npm run format
```
![format script](https://i.imgflip.com/38uiaa.gif "format script")

Boom! It is so cool isn't it? 🤩🏎

To bring this to the next level, you can configure this script to run with Git hooks. So that your code will be nicely formatted before committing, for instance. If you are curious about it, stay tuned for the next part 🥳

## Key takeaways
* Poorly formatted code sucks. Period.
* Why? It takes much longer time to review, harder to maintain, especially in a large project with dozens of developers.
* How to format your code properly? Get used of awesome tools like **Prettier**. It is easy to set up, pleasing to see the result and works nicely with other processes in your workflow.

## But wait, you are not the only decision maker 😔
If your peers are hesitating about using Prettier, I belive that its great features and benefits are weighty reasons for at least giving a try. And trust me, you all are gonna love it.

> You don't have to worried about your peers' coding style anymore. Let's just keep writing something awesome. And let the computer handle the rest.
