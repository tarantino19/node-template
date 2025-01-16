// server/src/routes/submissionRoutes.js
const express = require('express');
const submissionController = require('../controllers/submissionController');

const router = express.Router();

router.post('/', submissionController.createSubmission);
router.get('/:submissionId', submissionController.getSubmissionById);
router.put('/:submissionId', submissionController.updateSubmission);
router.delete('/:submissionId', submissionController.deleteSubmission);
router.get('/user/:userId', submissionController.getSubmissionsByUser);

module.exports = router;
