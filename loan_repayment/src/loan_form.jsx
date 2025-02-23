import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function LoanForm() {
    const [formData, setFormData] = useState({
        disbursementDate: "",
        principal: "",
        tenure: "",
        emiFrequency: "monthly",
        interestRate: "",
        moratoriumPeriod: "",
    });
    const [schedule, setSchedule] = useState(null);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const requestData = {
            disbursementDate: formData.disbursementDate,
            principal: Number(formData.principal),
            tenure: Number(formData.tenure),
            emiFrequency: formData.emiFrequency,
            interestRate: Number(formData.interestRate),
            moratoriumPeriod: Number(formData.moratoriumPeriod),
        };

        try {
            const response = await axios.post("https://humblebee-task.onrender.com/generate-schedule", requestData);
            setSchedule(response.data.schedule);
        } catch (error) {
            if (error.response && error.response.data.error) {
                toast.error(error.response.data.error);
            } else {
                toast.error("Error generating schedule");
            }
        }
    };
    const downloadPDF = () => {
        if (!schedule) {
            toast.error("No schedule available to download.");
            return;
        }
    
        const doc = new jsPDF();
        const currentDate = new Date().toLocaleDateString();
        const totalInterestPaid = schedule.reduce((sum, item) => sum + Number(item.interestPaid), 0);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(16);
        doc.text("Loan Repayment Schedule", 14, 10);
        doc.setFont("helvetica", "normal");
        doc.setFontSize(12);
        doc.text(`Generated on: ${currentDate}`, 14, 20);
        doc.autoTable({
            startY: 30,  
            head: [["Installment", "Date", "EMI", "Principal Paid", "Interest Paid", "Remaining Principal"]],
            body: schedule.map((item) => [
                item.installment,
                item.date,
                item.emi,
                item.principalPaid,
                item.interestPaid,
                item.remainingPrincipal,
            ]),
        });
    
        doc.setFont("helvetica");
        doc.setFontSize(12);
        doc.text(`Total Interest to be Paid: Rs.${totalInterestPaid.toFixed(2)}`, 14, doc.autoTable.previous.finalY + 10);
        doc.save("Loan_Schedule.pdf");
    };
    return (
        <div className="flex flex-col justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-50 p-4">
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-300"
            >
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6 font-serif tracking-wide">Loan Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {["disbursementDate", "principal", "tenure", "interestRate", "moratoriumPeriod"].map((name, index) => (
                        <div key={index} className="relative">
                            <input
                                type={name === "disbursementDate" ? "date" : "number"}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 peer bg-transparent pt-5"
                                placeholder=" "
                            />
                            <label
                                className="absolute left-3 top-1 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-purple-500"
                            >
                                {name.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                        </div>
                    ))}
                    <div className="relative">
                        <select
                            name="emiFrequency"
                            value={formData.emiFrequency}
                            onChange={handleChange}
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 bg-transparent pt-5 peer"
                        >
                            <option value="monthly">Monthly</option>
                            <option value="quarterly">Quarterly</option>
                        </select>
                        <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all bg-white px-1 peer-focus:top-1 peer-focus:text-sm peer-focus:text-purple-500">
                            EMI Frequency
                        </label>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        type="submit"
                        className="w-1/2 mx-auto block bg-purple-600 text-white p-4 rounded-lg shadow-lg hover:bg-purple-700 transition font-semibold"
                    >
                        Generate Schedule
                    </motion.button>
                </form>
            </motion.div>
            <motion.button
                whileHover={{ scale: schedule ? 1.05 : 1 }}
                whileTap={{ scale: schedule ? 0.95 : 1 }}
                onClick={downloadPDF}
                disabled={!schedule} 
                className={`mt-4 p-3 rounded-lg shadow-lg transition font-semibold block mx-auto 
        ${schedule ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}
    `}
            >
                Download PDF
            </motion.button>

        </div>
    );
}
