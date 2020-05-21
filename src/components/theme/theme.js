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

export const LightTheme = styled.div`
	margin-top: 16px;
	padding: 0 5%;
	font-size: 18px;

	ul {
		margin-bottom: 0;
	}

	.go-back-button {
		display: flex;
		align-items: center;
		color: #000;
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

export const DarkTheme = styled.div`
	padding: 0 5%;
	background: #141d26;
	color: #fff;
	font-size: 18px;

	ul {
		margin-bottom: 0;
	}

	h3 {
		a {
			color: #fff;
		}
	}

	.go-back-button {
		display: flex;
		align-items: center;
		color: #fff;
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
	const [theme, setTheme] = React.useState(light)
	const [isClient, setClient] = React.useState(false)

	React.useEffect(() => {
		if(!isClient) {
			setClient(true)
		}
		if(!localStorage.getItem('theme')) {
			setGlobalTheme(light)
		}
	}, [])

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
		theme === light ?
		<LightTheme>{content}</LightTheme> :
		<DarkTheme>{content}</DarkTheme>
	)
}