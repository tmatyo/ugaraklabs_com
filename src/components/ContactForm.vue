<script setup>
import { reactive } from 'vue';

const form = reactive({
    email: '',
    message: ''
})

function onSubmit() {
    console.log('EMAIL', form.email);
    console.log('MESSAGE', form.message);
}
</script>

<template>
    <form @submit.prevent="() => onSubmit()">
        <label for="email">Your email</label>
        <input :value="form.email" 
        @input="e => form.email = e.target.value"
        type="email" 
        name="email" 
        id="email" 
        required>

        <label for="message">Your message</label>
        <textarea :value="form.message" 
        @input="e => form.message = e.target.value"
        name="message" 
        id="message" 
        cols="30" 
        rows="10" 
        required></textarea>

        <input type="submit" value="Send" id="submit-button">
    </form>
</template>    

<style>
.contact-form {
	width: 50%;
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

</style>