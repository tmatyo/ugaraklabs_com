const axios = require('axios');

module.exports = verify = async (response) => {
	const answer = await askGoogle(response);
	console.log(answer);
	return answer.data?.success && answer.data?.score > 0.5;
};

const askGoogle = async (response) => {
	try {
		const results = await axios({
			url: process.env.GOOGLE_RECAPTCHA_VERIFY,
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8',
			},
			data: {
				secret: process.env.GOOGLE_RECAPTCHA_SECRET,
				response,
			},
		});
		return results;
	} catch (error) {
		return error;
	}
};
