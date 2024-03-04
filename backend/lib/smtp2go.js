const axios = require('axios');

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

const send = async (req) => {
	const { SMTP2GO_API_KEY, SMTP2GO_SEND, SENDER_ADDRESS, RECEIVER_ADDRESS, EMAIL_SUBJECT } = process.env;
	const { clientName, messageBody } = req;

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
				subject: `${EMAIL_SUBJECT} from ${clientName}`,
				html_body: messageBody,
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
	const cycles = await getCycles();

	if (cycles.data.data.cycle_remaining > 1) {
		const sending = await send(req.body);
		sending.status === 200 ? res.status(200).json(sending.data) : res.status(500).json(sending.data);
	} else {
		res.status(503).json({ status: 503, message: 'Service Unavailable: Quota exceeded!' });
	}
};

module.exports = { checkForCycles, sendEmail };
