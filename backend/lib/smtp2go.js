const axios = require('axios');
const validate = require('./validate');

const getCycles = async () => {
	const { SMTP2GO_API_KEY, SMTP2GO_CYCLE } = process.env;
	try {
		const results = await axios({
			url: SMTP2GO_CYCLE,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				api_key: SMTP2GO_API_KEY,
			},
		});
		const { status, statusText, data } = results;
		return { status, statusText, data };
	} catch (error) {
		const { code, message } = error;
		return { code, message };
	}
};

const send = async (req, cyc) => {
	const { SMTP2GO_API_KEY, SMTP2GO_SEND, SENDER_ADDRESS, RECEIVER_ADDRESS, EMAIL_SUBJECT } = process.env;
	const { clientEmail, messageBody, hasWebsite } = req;
	const { cycle_end, cycle_start, cycle_used, cycle_remaining, cycle_max } = cyc;
	const d = new Date();
	const emailBodyHtml = `<html><table><tr><td><strong>email:</strong></td><td>${clientEmail}</td></tr>
	<tr><td><strong>web:</strong></td><td>${hasWebsite ? '✅' : '⛔'}</td></tr>
	<tr><td><strong>time:</strong></td><td>${d.toUTCString()}</td></tr>
	</table><p>${messageBody}</p>
	<table><tr><td><strong>cycle_end:</strong></td><td>${cycle_end}</td></tr>
	<tr><td><strong>cycle_start:</strong></td><td>${cycle_start}</td></tr>
	<tr><td><strong>cycle_used:</strong></td><td>${cycle_used}</td></tr>
	<tr><td><strong>cycle_remaining:</strong></td><td>${cycle_remaining}</td></tr>
	<tr><td><strong>cycle_max:</strong></td><td>${cycle_max}</td></tr>
	</table></html>`;

	try {
		const results = await axios({
			url: SMTP2GO_SEND,
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
			},
			data: {
				api_key: SMTP2GO_API_KEY,
				sender: SENDER_ADDRESS,
				to: [RECEIVER_ADDRESS],
				subject: `${EMAIL_SUBJECT} from ${clientEmail.split('@')[0]}`,
				html_body: emailBodyHtml,
			},
		});
		const { status, statusText, data } = results;
		return { status, statusText, data };
	} catch (error) {
		const { code, message } = error;
		return { code, message };
	}
};

const checkForCycles = async (req, res) => {
	const cycles = await getCycles();
	cycles.status === 200 ? res.status(200).json(cycles.data) : res.status(500).json(cycles.data);
};

const sendEmail = async (req, res) => {
	const { emailErrors, messageErrors } = validate(req.body);
	if (emailErrors.length > 0 || messageErrors.length > 0) {
		res.status(400).json({ status: 400, message: 'Bad Request: Invalid parameters', emailErrors, messageErrors });
		return;
	} else {
		const cycles = await getCycles();

		if (cycles.data.data.cycle_remaining > 1) {
			const sending = await send(req.body, cycles.data.data);
			sending.status === 200 ? res.status(200).json(sending.data) : res.status(500).json(sending.data);
		} else {
			res.status(503).json({ status: 503, message: 'Service Unavailable: Quota exceeded!' });
		}
	}
};

module.exports = { checkForCycles, sendEmail };
