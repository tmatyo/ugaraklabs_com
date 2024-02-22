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
        <p v-for="err in emailErrors"><small>{{ $t(`form.errors.${err}`) }}</small></p>
      </div>

      <label for="message">{{ $t("form.message.label") }}</label>
      <textarea
        v-model="message"
        ref="messageTextArea"
        name="message"
        id="message"
        cols="30"
        rows="10"
        :placeholder="$t('form.message.placeholder')"
        :aria-label="$t('form.message.label')"
        :class="{ 'highlight-error': messageErrors?.length}"
        @input="validate"
      ></textarea>
      <div class="error-messages message-error" v-if="messageErrors?.length">
        <p v-for="err in messageErrors"><small>{{ $t(`form.errors.${err}`) }}</small></p>
      </div>

      <div id="checkbox-group" :class="{ 'highlight-error': !gdpr && !validatorFirstRun}">
        <input
          type="checkbox"
          name="checkbox"
          id="checkbox"
          v-model="gdpr"
        />
        <label for="checkbox" id="checkbox-label"
          ><small>{{ $t("form.disclaimer") }}</small></label
        >
      </div>

      <input type="submit" :value="$t('form.send')" id="submit-button" />
    </form>
  </div>
  <div id="send-email" v-else>
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
</template>

<script setup>
import { ref, reactive, onMounted, computed } from "vue";
import axios from "axios";
import useValidator from "../composables/useValidator";

const props = defineProps({
  hasWebsite: {
    type: Boolean,
    required: true,
  },
});

const emailInput = ref(null);
const email = ref("");
const emailErrors = ref([])
const messageTextArea = ref(null);
const message = ref("");
const messageErrors = ref([])
const gdpr = ref(false);
const cycle = reactive({});
const validatorFirstRun = ref(true);
const emailsEnabled = computed(() => {
  return true; //FOR TESTING, OTHERWISE cycle?.value?.cycle_remaining > 1
});

const validate = () => {
  useValidator(email, message, emailErrors, messageErrors, validatorFirstRun);
}

const onSubmit = () => {

  if(validatorFirstRun.value) {
    validatorFirstRun.value = false;
  }

  validate();

  console.log("email", email.value);
  console.log("email-valid", emailInput.value.validity.valid);
  console.log("message", message.value);
  console.log("message-valid", messageTextArea.value.validity.valid);
  console.log("gdpr", gdpr.value);
  console.log("has-website", props.hasWebsite);

  if (
    emailErrors.value.length ||
    messageErrors.value.length ||
    !gdpr.value
  ) {
    console.log("onSubmit() Aborting form submit");
    return;
  } else {
    checkForCycles();
  }
}

const checkForCycles = (initial = false) => {
  const { VITE_SMTP2GO_API_KEY, VITE_SMTP2GO_CYCLE } = import.meta.env;

  axios({
    url: VITE_SMTP2GO_CYCLE,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      api_key: VITE_SMTP2GO_API_KEY,
    }),
  })
    .then((results) => {
      console.log(results);
      cycle.value = results?.data?.data;

      if (!initial) {
        emailsEnabled
          ? sendEmail()
          : console.log(
              `Cannot send email, because monthly quota exceeded. ${cycle.value.cycle_remaining}/${cycle.value.cycle_max} left. Try again after ${cycle.value.cycle_end}. `,
            );
      }
    })
    .catch((err) => console.log(err));
};

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

  const {
    VITE_SMTP2GO_API_KEY,
    VITE_SMTP2GO_SEND,
    VITE_SENDER_ADDRESS,
    VITE_RECEIVER_ADDRESS,
    VITE_EMAIL_SUBJECT,
  } = import.meta.env;

  axios({
    url: VITE_SMTP2GO_SEND,
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    data: JSON.stringify({
      api_key: VITE_SMTP2GO_API_KEY,
      sender: VITE_SENDER_ADDRESS,
      to: [VITE_RECEIVER_ADDRESS],
      subject: `${VITE_EMAIL_SUBJECT} from ${email.value.split("@")[0]}`,
      html_body: emailBodyHtml,
    }),
  })
    .then((results) => console.log(results))
    .catch((err) => console.log(err));
};

onMounted(() => {
  //checkForCycles(true);
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

    input {
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

    .error-messages {
      small {
        color: red;
      }
    }
    input[type="text"].highlight-error, textarea.highlight-error {
      border: 1px solid red;
      background: #ffcccc
    }

    div.highlight-error {
      border: 1px dotted red;;
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

      &:hover {
        background: -webkit-linear-gradient(
          69deg,
          var(--color-brand-1),
          var(--color-brand-2)
        );
        color: var(--color-text);
        text-shadow: 1px 1px 1px var(--color-text-shadow);
      }
    }

    small {
      line-height: 1.2em;
    }
  }
}

#send-email {
  text-align: center;
  line-height: 2em;
}
</style>
