<script setup>
defineProps({
  msg: {
    type: String,
    required: true
  }
})
</script>

<template>
  <div class="greetings">
    <h1 class="green">{{ msg }}</h1>
    <h3>
      You’ve successfully created a project with
      <a href="https://vitejs.dev/" target="_blank" rel="noopener">Vite</a> +
      <a href="https://vuejs.org/" target="_blank" rel="noopener">Vue 3</a>.
    </h3>
  </div>
</template>

<style>
header {
	display: flex;
	flex-direction: row;
	align-items: center;
	height: 70px;
}

header #ugarak-logo {
	height: 40px;
	width: auto;
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
