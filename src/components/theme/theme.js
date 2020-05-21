import React from 'react'
import styled from 'styled-components'
import Toggle from 'react-toggle'

import './toggle-style.css'
import { MdWbSunny } from 'react-icons/md'
import { FaMoon } from 'react-icons/fa'

const icons = {
	checked: <MdWbSunny />,
	unchecked: <FaMoon />
}

const supportedTheme = {
	light: 1,
	dark: 2
}

const isLightTheme = theme => theme === supportedTheme.light

const Content = styled.div`
	padding: 5% 5% 0 5%;
	font-size: 18px;
  transition: background-color .2s ease-in;

	background: ${({theme}) => isLightTheme(theme) ? 'white' : '#141d26'};
	color: ${({theme}) => isLightTheme(theme) ? 'black' : '#fff'};

	ul {
		margin-bottom: 0;
	}

	.go-back-button {
		display: flex;
		align-items: center;
		transition: transform .2s ease-out;
		color: ${({theme}) => isLightTheme(theme) ? '#000' : '#fff'};
		max-width: 120px;
		border-radius: 10px;
	}

	@media (min-width: 768px) {
		padding: 0 20%;
	}

	@media (min-width: 1024px) {
		padding: 0 25%;
	}
`

const saveThemeToStorage = (theme) => {
	localStorage.setItem('theme', theme)
}

export const Theme = ({children}) => {
	const {light, dark} = supportedTheme
	const savedTheme = Number(localStorage.getItem('theme'))
	const [theme, setTheme] = React.useState(savedTheme || dark)
	const [isClient, setClient] = React.useState(false)

	React.useEffect(() => {
		const bodyBackground = theme === dark ? '#141d26' : 'white'
		document.body.style.background = bodyBackground

		if(!isClient) {
			setClient(true)
		}

		if(!savedTheme) {
			setGlobalTheme(light)
		}
	}, [theme])

	const toggleTheme = () => {
		const newTheme = theme === light ? dark : light
		setGlobalTheme(newTheme)
	}

	const setGlobalTheme = (theme) => {
		setTheme(theme)
		saveThemeToStorage(theme)
	}

	const content = (
		<>
			<Toggle
				defaultChecked={theme === light}
				onChange={toggleTheme}
				icons={icons}
			/>
			{children}
		</>
	)

	if(!isClient) return null
	return(
		<Content theme={theme}>{content}</Content>
	)
}