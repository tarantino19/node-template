const generateConfirmationCode = () => {
	return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit code as a string
};

module.exports = generateConfirmationCode;
