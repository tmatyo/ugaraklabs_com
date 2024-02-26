const EMAIL_MAX_LENGTH = 320;
const MSG_MAX_LENGTH = 2000;

export default function useValidator(
  email,
  message,
  emailErrors,
  messageErrors,
  validatorFirstRun,
) {
  console.log("validator");

  if (validatorFirstRun.value) {
    console.log("validator fires on change");
    return;
  }

  emailErrors.value = [];
  messageErrors.value = [];

  if (email.value.length === 0) {
    emailErrors.value.push("noEmail");
  } else if (email.value.length > EMAIL_MAX_LENGTH) {
    emailErrors.value.push("emailTooLong");
  } else if (email.value.indexOf("@") < 0) {
    emailErrors.value.push("notAnEmailAddress");
  }

  if (message.value.length === 0) {
    messageErrors.value.push("emptyMessage");
  } else if (message.value.length > MSG_MAX_LENGTH) {
    messageErrors.value.push("messageTooLong");
  }
}
