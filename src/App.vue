<script setup>
import { RouterLink, RouterView } from 'vue-router'
import UgarakLogo from './components/UgarakLogo.vue';
</script>

<template>
	<header>
		<!-- <img alt="Ugarak Labs s.r.o." class="logo" src="@/assets/logo.svg" width="200" /> -->
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

