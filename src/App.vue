<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UgarakLogo from './components/UgarakLogo.vue';
</script>

<template>
	<header>
		<UgarakLogo color="#fff"/>

		<div class="wrapper">
			<nav>
				<RouterLink :class="navbar-link" to="/">Home</RouterLink>
				<RouterLink :class="navbar-link" to="/about">About</RouterLink>
			</nav>
		</div>
	</header>

	<RouterView />
</template>

