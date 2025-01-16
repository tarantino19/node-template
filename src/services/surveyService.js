const Survey = require("../models/Survey");

const surveyService = {
  /**
   * Create a new survey.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  createSurvey: async (req, res) => {
    try {
      const { step1, step2, step3, userId } = req.body;

      // Create a new survey
      const survey = new Survey({
        step1,
        step2,
        step3,
        user: userId,
      });

      // Save the survey to the database
      await survey.save();

      res.status(201).json(survey);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get a survey by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getSurveyById: async (req, res) => {
    try {
      const survey = await Survey.findById(req.params.surveyId).populate("user");
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.status(200).json(survey);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Update a survey by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  updateSurvey: async (req, res) => {
    try {
      const { step1, step2, step3 } = req.body;

      const survey = await Survey.findByIdAndUpdate(
        req.params.surveyId,
        { step1, step2, step3 },
        { new: true }
      );

      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }

      res.status(200).json(survey);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Delete a survey by ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  deleteSurvey: async (req, res) => {
    try {
      const survey = await Survey.findByIdAndDelete(req.params.surveyId);
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },

  /**
   * Get a survey by user ID.
   * @param {Object} req - The request object.
   * @param {Object} res - The response object.
   */
  getSurveyByUser: async (req, res) => {
    try {
      const survey = await Survey.findOne({ user: req.params.userId });
      if (!survey) {
        return res.status(404).json({ message: "Survey not found" });
      }
      res.status(200).json(survey);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  },
};

module.exports = surveyService;