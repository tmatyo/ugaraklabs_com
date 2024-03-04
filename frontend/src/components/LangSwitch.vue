<script>
import { useI18n } from "vue-i18n";
import { useRouter } from "vue-router";
import Tr from "../i18n/translation";

export default {
	setup() {
		const { t, locale } = useI18n();

		const supportedLanguages = Tr.supportedLanguages;
		const router = useRouter();

		const switchLanguage = async (event) => {
			// user has chosen another language, translate site
			const newLanguage = event.target.value;
			await Tr.switchLanguage(newLanguage);

			// also change the language in the URL
			try {
				await router.replace({ params: { lang: newLanguage } });
			} catch (e) {
				console.log(e);
				router.push("/");
			}
		};

		return { t, locale, supportedLanguages, switchLanguage };
	},
};
</script>

<template>
	<select @change="switchLanguage" name="lang" id="lang">
		<option
			v-for="language in supportedLanguages"
			:key="`language-${language}`"
			:value="language"
			:selected="locale === language"
		>
			{{ t(`language.${language}`) }}
		</option>
	</select>
</template>

<style>
#lang {
	max-width: 75px;
	margin-left: 30px;
	background: var(--color-background);
	color: var(--color-text);
	padding: 5px;
	font-size: 0.8em;
	border: none;
}
</style>
