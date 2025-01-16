const SurveyService = require("../services/surveyService");

const surveyController = {
  createSurvey: async (req, res) => {
    await SurveyService.createSurvey(req, res);
  },

  getSurveyById: async (req, res) => {
    await SurveyService.getSurveyById(req, res);
  },

  updateSurvey: async (req, res) => {
    await SurveyService.updateSurvey(req, res);
  },

  deleteSurvey: async (req, res) => {
    await SurveyService.deleteSurvey(req, res);
  },

  getSurveyByUser: async (req, res) => {
    await SurveyService.getSurveyByUser(req, res);
  },
};

module.exports = surveyController;