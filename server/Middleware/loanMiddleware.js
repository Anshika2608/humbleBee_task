function validateLoanInput(req, res, next) {
    const { disbursementDate, principal, tenure, emiFrequency, interestRate, moratoriumPeriod } = req.body;

    if (!disbursementDate || !principal || !tenure || !emiFrequency || !interestRate || moratoriumPeriod === undefined) {
        return res.status(400).json({ error: "All fields are required." });
    }

    if (principal <= 0 || tenure <= 0 || interestRate <= 0 || moratoriumPeriod < 0) {
        return res.status(400).json({ error: "Invalid input values." });
    }

    next(); 
}

module.exports = { validateLoanInput };
