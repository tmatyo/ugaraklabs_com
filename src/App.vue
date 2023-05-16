<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UgarakLogo from './components/UgarakLogo.vue'
import LangSwitch from './components/LangSwitch.vue'
import Tr from './i18n/translation'
</script>

<template>
	<header>
		<UgarakLogo color="#fff"/>

		<div class="wrapper">
			<nav>
				<RouterLink :class="navbar-link" :to="Tr.routeGenerator({ name: 'home' })" >{{ $t("nav.home") }}</RouterLink>
				<RouterLink :class="navbar-link" :to="Tr.routeGenerator({ name: 'about' })" >{{ $t("nav.about") }}</RouterLink>
			</nav>
			<LangSwitch />
		</div>
	</header>

	<RouterView />
</template>

<style>

header {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 70px;
	padding: 20px;
}

header .wrapper {
	display: flex;
	flex-direction: column;
	margin-left: auto;
}

header .wrapper nav a {
	color: var(--color-text);
	text-decoration: none;
	text-transform: uppercase;
	font-size: 1.5em;
	font-weight: bold;
	margin-left: 30px;
}

header .wrapper nav a:hover {
	background: -webkit-linear-gradient(69deg, var(--color-brand-1), var(--color-brand-2));
	-webkit-text-fill-color: transparent;
	background-clip: text;
	-webkit-background-clip: text;
}


</style>

