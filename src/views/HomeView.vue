<script setup>
import { reactive } from "vue";
import ContactForm from "../components/ContactForm.vue";

const state = reactive({
  hasWebsite: false,
  didClick: false,
});

function clicked(t) {
  if (!state.didClick) {
    state.didClick = !state.didClick;
  }

  state.hasWebsite = t;
  setTimeout(
    () =>
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" }),
    500,
  );
}
</script>

<template>
  <main>
    <div id="slide1" class="slide">
      <span class="shape-animated"></span>
      <h1>
        {{ $t("home.slide1.part0") }}
        <span class="hl">{{ $t("home.slide1.part1") }}</span> <br />{{
          $t("home.slide1.part2")
        }}
        <br />{{ $t("home.slide1.part3") }}
        <span class="hl">{{ $t("home.slide1.part4") }}</span>
        {{ $t("home.slide1.part5") }}
      </h1>
    </div>

    <div id="slide2" class="slide">
      <span class="shape-animated"></span>
      <h1 class="ar">
        {{ $t("home.slide2.part0") }}
        <span class="hl">{{ $t("home.slide2.part1") }}</span
        >, <br />{{ $t("home.slide2.part2") }}
        <span class="hl">{{ $t("home.slide2.part3") }}</span> <br />{{
          $t("home.slide2.part4")
        }}
      </h1>
    </div>

    <div id="slide3" class="slide">
      <span class="shape-animated"></span>
      <h1 class="ct">
        {{ $t("home.slide3.part0") }}
        <span class="hl">{{ $t("home.slide3.part1") }}</span>
        {{ $t("home.slide3.part2") }}
        <span class="hl">{{ $t("home.slide3.part3") }}</span
        >. <br />{{ $t("home.slide3.part4") }}
        <span class="hl">{{ $t("home.slide3.part5") }}</span>
      </h1>
      <div class="button-group">
        <button @click="clicked(true)">{{ $t("home.yes") }}</button>
        <button @click="clicked(false)">{{ $t("home.no") }}</button>
      </div>
    </div>

    <div id="slide4" class="slide" v-show="state.didClick">
      <div class="contact-text">
        <h1 v-if="state.hasWebsite" class="ct">
          You are <span class="hl">on the right track</span> to get
          <span class="hl">new clients</span>. <br />In case you need to
          <span class="hl">improve</span> and
          <span class="hl">modernize</span> it, or
          <span class="hl">make it more pretty</span>, do not hesitate to
          <span class="hl">contact us</span> via the form below and we will
          agree on the details.
        </h1>
        <h1 v-else class="ct">
          You are in the right place! <br /><span class="hl">Contact us</span>
          via the form below <br />and we will <span class="hl">agree</span> on
          the details.
        </h1>
      </div>
      <div class="contact-form-container">
        <ContactForm :hasWebsite="state.hasWebsite" />
      </div>
    </div>
  </main>
</template>

<style>
.slide {
  /*width: 100vw;*/
  height: 100vh;
  display: flex;
  flex-direction: column;
  padding: 50px;
  justify-content: center;
}

#slide3,
#slide4 {
  align-items: center;
}

h1 {
  color: var(--color-h1);
  font-size: 3em;
  line-height: 1.5em;
  font-weight: bold;
  font-family: var(--the-font);
}

.button-group {
  display: flex;
  gap: 20px;
  align-items: center;
  justify-content: center;
}

.button-group button {
  width: 160px;
  height: 45px;
  font-size: 1.3em;
  cursor: pointer;
  border-radius: 3px;
  outline: none;
  border: none;
  font-weight: bold;
}

.button-group button:hover {
  background: -webkit-linear-gradient(
    69deg,
    var(--color-brand-1),
    var(--color-brand-2)
  );
  color: var(--color-text);
  text-shadow: 1px 1px 1px var(--color-text-shadow);
}

.contact-form-container {
  width: 70%;
}
</style>
