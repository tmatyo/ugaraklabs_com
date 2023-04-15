<script setup>
import { reactive } from 'vue';

const state = reactive({
	hasWebsite: false,
	didClick: false
});

function clicked(t) {
	if (!state.didClick) {
		state.didClick = !state.didClick;
	}

	state.hasWebsite = t;
	setTimeout(() => window.scrollTo({top: document.body.scrollHeight, behavior: 'smooth'}), 500);
}
</script>

<template>
	<main>
		<div id="slide1" class="slide">
			<h1>Time is <span class="hl">money</span>.
				<br>Even more so if you have
				<br>a <span class="hl">business</span> to run.
			</h1>
		</div>

		<div id="slide2" class="slide">
			<h1 class="ar">For the majority of <span class="hl">people</span>,
				<br>a <span class="tp">company</span> without a <span class="hl">website</span>
				<br>is not even a <span class="tp">company</span>.
			</h1>
		</div>

		<div id="slide3" class="slide">
			<h1 class="ct">Those <span class="hl">people</span> could be your <span class="hl">clients</span>.
				<br>Do you already have a <span class="hl">website</span>?
			</h1>
			<div class="button-group">
				<button @click="clicked(true)">Yes</button>
				<button @click="clicked(false)">No</button>
			</div>
		</div>

		<div id="slide4" class="slide" v-show="state.didClick">
			<h1 v-if="state.hasWebsite" class="ct">You are <span class="hl">on the right track</span> to get <span class="hl">new
					clients</span>.
				<br>In case you need to <span class="hl">improve</span> and <span class="hl">modernize</span> it, or <span
					class="hl">make it more pretty</span>,
				<br>do not hesitate to <span class="hl">contact us</span> via the form below
				<br>and we will agree on the details.
			</h1>
			<h1 v-else class="ct">You are in the right place!
				<br><span class="hl">Contact us</span> via the form below
				<br>and we will agree on the details.
			</h1>
			<form></form>
		</div>
	</main>
</template>
