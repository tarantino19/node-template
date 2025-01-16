const SubmissionService = require("../services/submissionService");

const submissionController = {
  /**
   * Create a new submission.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  createSubmission: async (req, res) => {
    await SubmissionService.createSubmission(req, res);
  },

  /**
   * Get a submission by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getSubmissionById: async (req, res) => {
    await SubmissionService.getSubmissionById(req, res);
  },

  /**
   * Update a submission by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  updateSubmission: async (req, res) => {
    await SubmissionService.updateSubmission(req, res);
  },

  /**
   * Delete a submission by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  deleteSubmission: async (req, res) => {
    await SubmissionService.deleteSubmission(req, res);
  },

  /**
   * Get submissions by user ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getSubmissionsByUser: async (req, res) => {
    await SubmissionService.getSubmissionsByUser(req, res);
  },
};

module.exports = submissionController;