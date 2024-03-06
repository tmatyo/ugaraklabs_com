module.exports = validate = (params) => {
	const EMAIL_MAX_LENGTH = 320;
	const MSG_MAX_LENGTH = 2000;
	let emailErrors = [];
	let messageErrors = [];

	if (params.clientEmail.length === 0) {
		emailErrors.push('noEmail');
	} else if (params.clientEmail.length > EMAIL_MAX_LENGTH) {
		emailErrors.push('emailTooLong');
	} else if (params.clientEmail.indexOf('@') < 0) {
		emailErrors.push('notAnEmailAddress');
	}

	if (params.messageBody.length === 0) {
		messageErrors.push('emptyMessage');
	} else if (params.messageBody.length > MSG_MAX_LENGTH) {
		messageErrors.push('messageTooLong');
	}

	return { emailErrors, messageErrors };
};
