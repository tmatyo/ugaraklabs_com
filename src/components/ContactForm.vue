<template>
    <div class="contact-form">
        <form @submit.prevent="() => onSubmit()">
            <label for="email">{{ $t("form.email.label") }}</label>
            <input v-model="email"
                ref="emailInput"
                type="email" 
                name="email" 
                id="email"
                :placeholder="$t('form.email.placeholder', { acc: $t('form.email.acc'), dom: $t('form.email.dom') })" 
                :aria-label="$t('form.email.label')"
                required>

            <label for="message">{{ $t("form.message.label") }}</label>
            <textarea v-model="message"
                ref="messageTextArea"
                name="message" 
                id="message" 
                cols="30" 
                rows="10"
                :placeholder="$t('form.message.placeholder')" 
                :aria-label="$t('form.message.label')"
                required></textarea>

            <div id="checkbox-group">
                <input type="checkbox" name="checkbox" id="checkbox" v-model="gdpr" required>
                <label for="checkbox" id="checkbox-label"><small>{{ $t("form.disclaimer") }}</small></label>
            </div>
            
            <input type="submit" :value="$t('form.send')" id="submit-button">
        </form>
    </div>
</template>    

<script setup>
import { ref, reactive } from 'vue';
import axios from 'axios';

const props = defineProps({
    hasWebsite: {
        type: Boolean,
        required: true
    }
});

const emailInput = ref(null);
const email = ref("");
const messageTextArea = ref(null);
const message = ref("");
const gdpr = ref(false);
const cycle = reactive({});

function onSubmit() {
    console.log('email', email.value);
    console.log('email-valid', emailInput.value.validity.valid);
    console.log('message', message.value);
    console.log('message-valid', messageTextArea.value.validity.valid);
    console.log('gdpr', gdpr.value);
    console.log('has-website', props.hasWebsite);

    if(!emailInput.value.validity.valid || !messageTextArea.value.validity.valid || !gdpr.value) {
        console.log('onSubmit() Aborting form submit');
        return;
    } else {
        checkForLimit();
    }   

}

const checkForLimit = () => {
    const { VITE_SMTP2GO_API_KEY, VITE_SMTP2GO_CYCLE } = import.meta.env;

    axios({
        url: VITE_SMTP2GO_CYCLE,
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        data: JSON.stringify({
            'api_key': VITE_SMTP2GO_API_KEY
        }),
    })
    .then((results) => {
        console.log(results);
        cycle.value = results.data.data;

        if(cycle.value.cycle_remaining > 1) {
            sendEmail();
        } else {
            console.log(`Cannot send email, because monthly quota exceeded. ${cycle.value.cycle_remaining}/${cycle.value.cycle_max} left. Try again after ${cycle.value.cycle_end}. `);
        }
    })
    .catch((err) => console.log(err));
}

const sendEmail = () => {

    const d = new Date();
    const emailBodyHtml = `<html><table><tr><td><strong>email:</strong></td><td>${email.value}</td></tr>
        <tr><td><strong>web:</strong></td><td>${props.hasWebsite ? "✅" : "⛔"}</td></tr>
        <tr><td><strong>time:</strong></td><td>${d.toUTCString()}</td></tr>
        </table><p>${message.value}</p>
        <table><tr><td><strong>cycle_end:</strong></td><td>${cycle.value.cycle_end}</td></tr>
        <tr><td><strong>cycle_start:</strong></td><td>${cycle.value.cycle_start}</td></tr>
        <tr><td><strong>cycle_used:</strong></td><td>${cycle.value.cycle_used}</td></tr>
        <tr><td><strong>cycle_remaining:</strong></td><td>${cycle.value.cycle_remaining}</td></tr>
        <tr><td><strong>cycle_max:</strong></td><td>${cycle.value.cycle_max}</td></tr>
        </table></html>`;

    const { VITE_SMTP2GO_API_KEY, VITE_SMTP2GO_SEND, VITE_SENDER_ADDRESS, VITE_RECEIVER_ADDRESS, VITE_EMAIL_SUBJECT } = import.meta.env;

    axios({
        url: VITE_SMTP2GO_SEND,
        method: 'POST',
        headers: {
            'Content-Type': "application/json"
        },
        data: JSON.stringify({
            'api_key': VITE_SMTP2GO_API_KEY,
            'sender': VITE_SENDER_ADDRESS,
            'to': [ VITE_RECEIVER_ADDRESS ],
            'subject': `${VITE_EMAIL_SUBJECT} from ${email.value.split('@')[0]}`,
            'html_body': emailBodyHtml
        }),
    })
    .then((results) => console.log(results))
    .catch((err) => console.log(err));
}
</script>

<style>
.contact-form {
	width: 100%;
}

.contact-form form {
	display: flex;
	flex-direction: column;
	width: 100%;
}

.contact-form form label {
	margin: 20px 0 10px 0;
}

.contact-form form input {
	height: 3em;
	line-height: 2em;
	font-size: 1em;
	padding: 0 15px;
	border-radius: 5px;
	outline: none;
	border: 0;
}

.contact-form form textarea {
	padding: 10px 15px;
	line-height: 1.5em;
	font-size: 1em;
	border-radius: 5px;
	outline: none;
	border: 0;
	font-family: var(--the-font);
}

.contact-form form #checkbox-group {
    margin: 10px 0;
}

.contact-form form #checkbox {
    height: auto;
}

.contact-form form #submit-button {
    margin: 20px 0;
    font-weight: bold;
    cursor: pointer;
}

.contact-form form #submit-button:hover {
	background: -webkit-linear-gradient(69deg, var(--color-brand-1), var(--color-brand-2));
	color: var(--color-text);
	text-shadow: 1px 1px 1px var(--color-text-shadow);
}

.contact-form form small {
    line-height: 1.2em;
}

</style>