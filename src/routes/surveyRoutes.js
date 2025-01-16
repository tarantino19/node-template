// server/src/routes/surveyRoutes.js
const express = require('express');
const surveyController = require('../controllers/surveyController');

const router = express.Router();

router.post('/', surveyController.createSurvey);
router.get('/:surveyId', surveyController.getSurveyById);
router.put('/:surveyId', surveyController.updateSurvey);
router.delete('/:surveyId', surveyController.deleteSurvey);
router.get('/user/:userId', surveyController.getSurveyByUser);

module.exports = router;
