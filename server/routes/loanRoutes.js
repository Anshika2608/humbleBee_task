const express = require("express");
const { generateLoanSchedule } = require("../Controllers/LoanController");
const { validateLoanInput } = require("../Middleware/loanMiddleware");

const router = express.Router();

router.post("/generate-schedule", validateLoanInput, generateLoanSchedule);

module.exports = router;
