import { createApp } from "vue/dist/vue.esm-bundler";
import App from "./App.vue";
import router from "./router";
import i18n from "./i18n";

import "./assets/main.css";
import { VueReCaptcha } from "vue-recaptcha-v3";

const app = createApp(App);

app.use(router);

app.use(i18n);

app.use(VueReCaptcha, { siteKey: import.meta.env.VITE_RECAPTCHA_SITE_KEY });

app.mount("#app");
