const rateLimit = require('express-rate-limit');

// Rate limiter configuration
const loginLimiter = rateLimit({
	windowMs: 10 * 60 * 1000, // 10 minutes
	max: 5, // Limit each IP to 5 login requests per windowMs
	message: 'Too many login attempts from this IP, please try again after 10 minutes.',
	handler: (req, res) => {
		res.status(429).json({
			message: 'Too many login attempts from this IP, please try again after 10 minutes.',
		});
	},
});

module.exports = loginLimiter;
