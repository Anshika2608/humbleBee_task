import { useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import jsPDF from "jspdf";
import "jspdf-autotable";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Particles } from "react-tsparticles";
import { loadSlim } from "tsparticles-slim";

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
            const response = await axios.post("http://localhost:5000/generate-schedule", requestData);
            setSchedule(response.data.schedule);
        } catch (error) {
            toast.error(error.response?.data?.error || "Error generating schedule");
        }
    };

    const downloadPDF = () => {
        if (!schedule || !Array.isArray(schedule)) {
            toast.error("No schedule available to download");
            return;
        }
        const doc = new jsPDF();
        const today = new Date().toLocaleDateString();
        let totalInterestPaid = schedule.reduce((sum, item) => {
            const interest = parseFloat(item.interestPaid) || 0;
            return sum + interest;
        }, 0);
        doc.setFontSize(14);
        doc.text("Loan Repayment Schedule", 14, 10);
        doc.setFontSize(10);
        doc.text(`Generated on: ${today}`, 14, 18);
        doc.autoTable({
            startY: 25, 
            head: [["Installment", "Date", "EMI", "Principal Paid", "Interest Paid", "Remaining Principal"]],
            body: schedule.map(item => [
                item.installment,
                item.date,
                item.emi,
                item.principalPaid,
                item.interestPaid,
                item.remainingPrincipal,
            ]),
        });
        let finalY = doc.autoTable.previous.finalY || 40; 
    
        doc.setFont("helvetica", "bold");
        doc.text(`Total Interest to be Paid: Rs.${totalInterestPaid.toFixed(2)}`, 14, finalY + 10);
    
        doc.save("Loan_Schedule.pdf");
    };
    return (
        <div className="relative flex flex-col justify-center items-center min-h-screen p-4 overflow-hidden">
            <Particles
                init={async (engine) => {
                    await loadSlim(engine);
                }}
                options={{
                    background: { color: "#000000" },
                    particles: {
                        number: { value: 80 },
                        size: { value: 3 },
                        move: {
                            enable: true, 
                            speed: 2,
                            direction: "none", 
                            random: true,
                            straight: false,
                            outModes: { default: "bounce" }, 
                        },
                        color: { value: "#ffffff" },
                        opacity: { value: 0.5 },
                        links: { enable: true, color: "#ffffff" }, 
                    },
                    interactivity: {
                        events: {
                            onHover: { enable: true, mode: "repulse" }, 
                            onClick: { enable: true, mode: "push" }, 
                        },
                        modes: {
                            repulse: { distance: 100, duration: 0.4 },
                            push: { quantity: 4 },
                        },
                    },
                }}
                className="absolute inset-0 z-0"
            />
            <ToastContainer />
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="relative z-10 bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-300"
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
                            <label className="absolute left-3 top-1 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-purple-500">
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
                className={`mt-4 p-3 z-1000 rounded-lg shadow-lg transition font-semibold block mx-auto ${schedule ? "bg-green-600 text-white hover:bg-green-700" : "bg-gray-400 text-gray-200 cursor-not-allowed"}`}
            >
                Download PDF
            </motion.button>
        </div>
    );
}
