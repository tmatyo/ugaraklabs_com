<script setup>
import { ref } from "vue";
import ContactForm from "../components/ContactForm.vue";
const emailsEnabled = ref(false);
const readyOrNot = () => {
	emailsEnabled.value = true;
};
</script>

<template>
	<div id="about-page">
		<h1>{{ $t("about.title") }}</h1>
		<div id="about">
			<div id="about-left" class="half">
				<h2>{{ $t("about.company.name") }}</h2>
				<p>
					<strong>{{ $t("about.company.id.name") }}:</strong>
					{{ $t("about.company.id.value") }}
				</p>
				<p>
					<strong>{{ $t("about.company.tax.name") }}:</strong>
					{{ $t("about.company.tax.value") }}
				</p>
				<p>
					<strong>{{ $t("about.company.orsr.name") }}:</strong><br />{{ $t("about.company.orsr.value") }}
				</p>

				<h3>{{ $t("about.contact") }}:</h3>
				<p>
					<strong>{{ $t("about.company.email.name") }}: </strong>
					<a
						class="hl"
						:href="`mailto:${$t('about.company.email.value', { acc: $t('about.company.email.acc'), dom: $t('about.company.email.dom') })}`"
					>
						{{
							$t("about.company.email.value", {
								acc: $t("about.company.email.acc"),
								dom: $t("about.company.email.dom"),
							})
						}}</a
					>
				</p>
				<p v-if="emailsEnabled">{{ $t("about.msg") }}</p>
			</div>
			<div id="about-right" class="half">
				<ContactForm @ready="readyOrNot" />
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
