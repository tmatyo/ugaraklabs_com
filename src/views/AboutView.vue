<script setup>
import ContactForm from '../components/ContactForm.vue'

</script>

<template>
	<div id="about-page">
		<h1>About us</h1>
		<div id="about">
			<div id="about-left" class="half">
				<h2>Ugarak Labs s.r.o.</h2>
				<p><strong>IČO:</strong> 55137369</p>
				<p><strong>DIČ:</strong> 2121883522</p>
				<p><strong>Zápis v obchodnom registri:</strong><br>Okresný súd Nitra, oddiel: Sro, vložka č. 59246/N</p>

				<h3>Contact:</h3>
				<p><strong>Email:</strong> info@ugaraklabs.com</p>
				<p>...or feel free to use the contact form.</p>

			</div>
			<div id="about-right" class="half">
				<ContactForm/>
			</div>
		</div>
	</div>
</template>

<style>
#about-page {
	max-width: 75%;
	margin: auto;
}

#about-page #about {
	display: flex;
	gap: 20px;
	margin-top: 50px;
}

#about-page #about .half {
	width: 50%;
}

#about-page #about #about-left {
	line-height: 2em;
}

h2 {
	font-weight: bold;
	margin: 10px 0 20px 0;
}

h3 {
	margin: 10px 0 10px 0;
}

strong {
	font-weight: bold;
}

</style>
