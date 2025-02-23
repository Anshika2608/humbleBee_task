function calculateEMI(principal, rate, tenure) {
    rate = rate / (12 * 100);
    return (principal * rate * Math.pow(1 + rate, tenure)) / (Math.pow(1 + rate, tenure) - 1);
}

function generateRepaymentSchedule({ disbursementDate, principal, tenure, emiFrequency, interestRate, moratoriumPeriod }) {
    let schedule = [];
    let rate = interestRate / 100;
    let currentDate = new Date(disbursementDate);

    currentDate.setMonth(currentDate.getMonth() + 1);

   
    let moratoriumInterest = 0;
    for (let i = 1; i <= moratoriumPeriod; i++) {
        let interest = (principal * rate) / 12; 
        moratoriumInterest += interest;

        schedule.push({
            installment: 0,  
            date: currentDate.toISOString().split("T")[0],
            emi: "0.00",
            principalPaid: "0.00",
            interestPaid: interest.toFixed(2),
            remainingPrincipal: principal.toFixed(2),
        });

        currentDate.setMonth(currentDate.getMonth() + 1);
    }

    principal += moratoriumInterest;
    let emi = calculateEMI(principal, interestRate, tenure);
    for (let i = 1; i <= tenure; i++) {
        let interest = (principal * interestRate) / (12 * 100);
        let principalPaid = emi - interest;
        principal -= principalPaid;

        schedule.push({
            installment: i,
            date: currentDate.toISOString().split("T")[0],
            emi: emi.toFixed(2),
            principalPaid: principalPaid.toFixed(2),
            interestPaid: interest.toFixed(2),
            remainingPrincipal: principal.toFixed(2),
        });

        currentDate.setMonth(currentDate.getMonth() + (emiFrequency === "quarterly" ? 3 : 1)); // Ensure proper month progression
    }

    return schedule;
}



function generateLoanSchedule(req, res) {
    try {
        const schedule = generateRepaymentSchedule(req.body);
        res.status(201).json({message:"schedule generated successfully",schedule})
    } catch (error) {
        res.status(500).json({ error: "Error generating repayment schedule" });
    }
}

module.exports = { generateLoanSchedule };
