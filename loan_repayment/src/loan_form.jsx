import { useState } from "react";
import { motion } from "framer-motion";

export default function LoanForm() {
    const [formData, setFormData] = useState({
        disbursementDate: "",
        principal: "",
        tenure: "",
        emiFrequency: "monthly",
        interestRate: "",
        moratoriumPeriod: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(formData);
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-gray-200 to-gray-50 p-4">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1.5 }}
                className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-lg border border-gray-300"
            >
                <h2 className="text-4xl font-extrabold text-center text-gray-800 mb-6 font-serif tracking-wide">Loan Details</h2>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {[
                        { name: "disbursementDate", type: "date", label: "Disbursement Date" },
                        { name: "principal", type: "number", label: "Principal Amount" },
                        { name: "tenure", type: "number", label: "Tenure (months)" },
                        { name: "interestRate", type: "number", label: "Interest Rate (%)" },
                        { name: "moratoriumPeriod", type: "number", label: "Moratorium Period (months)" }
                    ].map(({ name, type, label }) => (
                        <div key={name} className="relative">
                            <input
                                type={type}
                                name={name}
                                value={formData[name]}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-purple-500 peer bg-transparent pt-5"
                                placeholder=" "
                            />
                            <label
                                className="absolute left-3 top-1 text-gray-500 text-sm transition-all bg-white px-1 peer-placeholder-shown:top-3 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:top-1 peer-focus:text-sm peer-focus:text-purple-500"
                            >
                                {label}
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
                        <label
                            className="absolute left-3 top-1 text-gray-500 text-sm transition-all bg-white px-1 peer-focus:top-1 peer-focus:text-sm peer-focus:text-purple-500"
                        >
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
        </div>
    );
}
