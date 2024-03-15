<template>
	<div id="contact-form" v-if="emailsEnabled">
		<form @submit.prevent="onSubmit">
			<label for="email">{{ $t("form.email.label") }}</label>
			<input
				v-model="email"
				ref="emailInput"
				type="text"
				name="email"
				id="email"
				:placeholder="
					$t('form.email.placeholder', {
						acc: $t('form.email.acc'),
						dom: $t('form.email.dom'),
					})
				"
				:aria-label="$t('form.email.label')"
				:class="{ 'highlight-error': emailErrors?.length }"
				@input="validate"
			/>
			<div class="error-messages email-error" v-if="emailErrors?.length">
				<p v-for="err in emailErrors">
					<small>{{ $t(`form.errors.${err}`) }}</small>
				</p>
			</div>

			<label for="message"
				>{{ $t("form.message.label") }}
				<span :class="{ 'red-text': message.length > 2000 }"
					>{{ message.length }} {{ $t("form.message.maxLength") }}
				</span></label
			>
			<textarea
				v-model="message"
				ref="messageTextArea"
				name="message"
				id="message"
				cols="30"
				rows="10"
				:placeholder="$t('form.message.placeholder')"
				:aria-label="$t('form.message.label')"
				:class="{ 'highlight-error': messageErrors?.length }"
				@input="validate"
			></textarea>
			<div class="error-messages message-error" v-if="messageErrors?.length">
				<p v-for="err in messageErrors">
					<small>{{ $t(`form.errors.${err}`) }}</small>
				</p>
			</div>

			<div id="checkbox-group" :class="{ 'highlight-error': !gdpr && !validatorFirstRun }">
				<input type="checkbox" name="checkbox" id="checkbox" v-model="gdpr" />
				<label for="checkbox" id="checkbox-label"
					><small>{{ $t("form.disclaimer") }}</small></label
				>
			</div>

			<button
				type="submit"
				id="submit-button"
				class="g-recaptcha"
				data-sitekey="reCAPTCHA_site_key"
				data-callback="onSubmit"
				data-action="submit"
				:class="{ 'colorful-button': sending || response }"
			>
				<span v-if="!sending">{{ $t("form.send") }}</span>
				<LoadingAnimation v-else-if="sending" />
			</button>
			<span class="response-message" v-if="response && sendingSuccess">{{ $t("form.response.success") }}</span>
			<span class="response-message" v-else-if="response && !sendingSuccess">
				{{ $t("form.response.error") }}
				<a
					class="hl"
					:href="`mailto:${$t('about.company.email.value', { acc: $t('about.company.email.acc'), dom: $t('about.company.email.dom') })}`"
				>
					{{
						$t("about.company.email.value", {
							acc: $t("about.company.email.acc"),
							dom: $t("about.company.email.dom"),
						})
					}}
				</a>
			</span>
		</form>
	</div>
	<div id="send-email" v-else-if="emailsEnabled === false">
		<p>{{ $t("noForm.msg") }}</p>
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
	</div>
	<div id="cf-loading" v-else>
		<LoadingAnimation />
	</div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import useValidator from "../composables/useValidator";
import useCookie from "../composables/useCookie";
import LoadingAnimation from "./LoadingAnimation.vue";
import { useReCaptcha } from "vue-recaptcha-v3";

const { executeRecaptcha, recaptchaLoaded } = useReCaptcha();
const { setCookie, getCookie } = useCookie();

const props = defineProps({
	hasWebsite: {
		type: Boolean,
		default: false,
	},
});

const emit = defineEmits(["ready"]);

const email = ref("");
const message = ref("");
const gdpr = ref(false);

const emailInput = ref(null);
const messageTextArea = ref(null);
const emailErrors = ref([]);
const messageErrors = ref([]);

const validatorFirstRun = ref(true);
const cycle = reactive({});
const sending = ref(false);
const response = ref(false);
const sendingSuccess = ref(false);

const emailsEnabled = computed(() => {
	return cycle.value ? cycle.value.cycle_remaining > 1 : null;
});

const recaptcha = async (action = "") => {
	await recaptchaLoaded();
	const token = await executeRecaptcha(action);
	return token;
};

const validate = () => {
	useValidator(email, message, emailErrors, messageErrors, validatorFirstRun);
};

const onSubmit = () => {
	if (sending.value) {
		return;
	}

	if (validatorFirstRun.value) {
		validatorFirstRun.value = false;
	}

	validate();

	if (!emailErrors.value.length && !messageErrors.value.length && gdpr.value) {
		console.log("Initiating sending.");
		sending.value = true;
		sendEmail();
	}
};

const checkForCycles = async () => {
	const token = await recaptcha("cycles");

	axios
		.post(`http://localhost:3000${import.meta.env.VITE_API_ENDPOINT_CYCLES}`, { token })
		.then((res) => {
			cycle.value = res?.data?.data;
			if (emailsEnabled) {
				emit("ready");
			} else {
				let expiryDate = new Date(cycle.value.cycle_end).toUTCString();
				setCookie("cycle", expiryDate);
				console.log(
					"checkForCycles()",
					`Cannot send email, because monthly quota exceeded. ${cycle.value.cycle_remaining}/${cycle.value.cycle_max} left. Try again after ${expiryDate}. `,
				);
			}
		})
		.catch((err) => {
			console.log(err);
		});
};

const sendEmail = async () => {
	const token = await recaptcha("sendEmail");
	axios
		.post(`http://localhost:3000${import.meta.env.VITE_API_ENDPOINT_SEND}`, {
			clientEmail: email.value,
			messageBody: message.value,
			hasWebsite: props.hasWebsite,
			token,
		})
		.then((res) => {
			sending.value = false;
			response.value = true;
			sendingSuccess.value = true;
		})
		.catch((err) => {
			console.log(err);
			if (err.response?.data?.emailErrors?.length || err.response?.data?.messageErrors?.length) {
				emailErrors.value = emailErrors;
				messageErrors.value = messageErrors;
				validate();
			}
			sending.value = false;
			response.value = true;
		});
};

onMounted(() => {
	const cookie = getCookie("cycle");
	if (cookie === null) {
		checkForCycles();
	} else {
		cycle.value = { cycle_remaining: 0 };
		console.log("onMounted()", `Cannot send email, because monthly quota exceeded. Try again after ${cookie}.`);
	}
});
</script>

<style scoped>
#contact-form {
	width: 100%;

	form {
		display: flex;
		flex-direction: column;
		width: 100%;

		label {
			margin: 20px 0 10px 0;
		}

		input,
		#submit-button {
			height: 3em;
			line-height: 2em;
			font-size: 1em;
			padding: 0 15px;
			border-radius: 5px;
			outline: none;
			border: 0;
		}

		textarea {
			padding: 10px 15px;
			line-height: 1.5em;
			font-size: 1em;
			border-radius: 5px;
			outline: none;
			border: 0;
			font-family: var(--the-font);
		}

		.red-text {
			color: red;
		}

		.error-messages {
			small {
				color: red;
			}
		}
		input[type="text"].highlight-error,
		textarea.highlight-error {
			border: 1px solid red;
			background: #ffcccc;
		}

		div.highlight-error {
			border: 1px dotted red;
		}

		#checkbox-group {
			margin: 10px 0;
		}

		#checkbox {
			height: auto;
		}

		#submit-button {
			margin: 20px 0;
			font-weight: bold;
			cursor: pointer;
			/*width: 120px;*/

			&:hover,
			&.colorful-button {
				background: -webkit-linear-gradient(69deg, var(--color-brand-1), var(--color-brand-2));
				color: var(--color-text);
				text-shadow: 1px 1px 1px var(--color-text-shadow);
			}
		}

		.response-message {
			text-align: center;
		}

		small {
			line-height: 1.2em;
		}
	}
}

#send-email {
	text-align: center;
	line-height: 2em;
	flex-direction: column;
}

#cf-loading,
#send-email {
	width: 100%;
	height: 100%;
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
