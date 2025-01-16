const Submission = require('../models/Submission');

const submissionService = {
	/**
	 * Create a new submission.
	 * @param {Object} req - The request object.
	 * @param {Object} res - The response object.
	 */
	createSubmission: async (req, res) => {
		try {
			const { album, user } = req.body;

			// Create a new submission
			const submission = new Submission({
				album,
				user,
			});

			// Save the submission to the database
			await submission.save();

			res.status(201).json(submission);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	/**
	 * Get a submission by ID.
	 * @param {Object} req - The request object.
	 * @param {Object} res - The response object.
	 */
	getSubmissionById: async (req, res) => {
		try {
			const submission = await Submission.findById(req.params.submissionId).populate('album user');
			if (!submission) {
				return res.status(404).json({ message: 'Submission not found' });
			}
			res.status(200).json(submission);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	/**
	 * Update a submission by ID.
	 * @param {Object} req - The request object.
	 * @param {Object} res - The response object.
	 */
	updateSubmission: async (req, res) => {
		try {
			const { status } = req.body;

			const submission = await Submission.findByIdAndUpdate(req.params.submissionId, { status }, { new: true });

			if (!submission) {
				return res.status(404).json({ message: 'Submission not found' });
			}

			res.status(200).json(submission);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	/**
	 * Delete a submission by ID.
	 * @param {Object} req - The request object.
	 * @param {Object} res - The response object.
	 */
	deleteSubmission: async (req, res) => {
		try {
			const submission = await Submission.findByIdAndDelete(req.params.submissionId);
			if (!submission) {
				return res.status(404).json({ message: 'Submission not found' });
			}
			res.status(204).send();
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},

	/**
	 * Get submissions by user ID.
	 * @param {Object} req - The request object.
	 * @param {Object} res - The response object.
	 */
	getSubmissionsByUser: async (req, res) => {
		try {
			const submissions = await Submission.find({ user: req.params.userId }).populate('album user');
			res.status(200).json(submissions);
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	},
};

module.exports = submissionService;
