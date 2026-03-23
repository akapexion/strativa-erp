import React, { useState } from "react";
import {
  ArrowLeft,
  Save,
  TrendingUp,
  BadgeDollarSign,
  Repeat,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";
import { z } from "zod";

// ─── Zod Schema ───────────────────────────────────────────────────────────────
const dfiSchema = z.object({
  dfi_alternate_count: z
    .string()
    .min(1, "Alternate count is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "Alternate count must be a positive number",
    })
    .refine((val) => Number.isInteger(Number(val)), {
      message: "Alternate count must be a whole number",
    }),

  dfi_amount: z
    .string()
    .min(1, "DFI amount is required")
    .refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
      message: "DFI amount must be a positive number",
    }),
});
// ─────────────────────────────────────────────────────────────────────────────

const RaiseDFI = () => {
  const navigate = useNavigate();

  const user = JSON.parse(localStorage.getItem("user"));

  const initialFormData = {
    employee_code: user?.user_code || "",
    employee_name: user?.user_fullname || "",
    dfi_alternate_count: "",
    dfi_amount: "",
  };

  const [formData, setFormData] = useState(initialFormData);
  const [errors, setErrors] = useState({}); // ← new: holds field-level errors

  const handleChange = (e) => {
    // Clear the error for this field as the user types
    setErrors((prev) => ({ ...prev, [e.target.name]: undefined }));
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async () => {
    // ─── Zod Validation ───────────────────────────────────────────────────────
    const result = dfiSchema.safeParse(formData);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      const firstErrors = Object.fromEntries(
        Object.entries(fieldErrors).map(([key, msgs]) => [key, msgs[0]])
      );
      setErrors(firstErrors);
      gooeyToast.error("Please fix the errors before submitting.", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 },
      });
      return; // stop submission
    }

    setErrors({}); // clear errors on success
    // ─────────────────────────────────────────────────────────────────────────

    try {
      const res = await axios.post(
        "http://localhost:5000/user/raise-dfi",
        formData
      );

      gooeyToast.success(
        res.data.message || "DFI submitted successfully",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        }
      );

      setFormData(initialFormData);
      setErrors({});
    } catch (error) {
      console.error(error);
      gooeyToast.error(
        error.response?.data?.message || "Error submitting DFI",
        {
          fillColor: "#FFF",
          bounce: 0.45,
          timing: { displayDuration: 2500 },
        }
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
          >
            <ArrowLeft size={20} />
          </button>
          <h1 className="text-xl font-bold text-slate-900">Raise DFI</h1>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 border border-blue-200 rounded-lg hover:bg-blue-50">
            <TrendingUp size={16} />
            <Link to="/hr360/user/dfis">View Submissions</Link>
          </button>

          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 text-sm font-bold text-slate-500"
          >
            Discard
          </button>

          <button
            onClick={handleSubmit}
            className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white font-bold rounded-lg shadow-lg hover:bg-blue-700"
          >
            <Save size={18} />
            Submit DFI
          </button>
        </div>
      </div>

      {/* Main */}
      <main className="max-w-4xl mx-auto px-6 py-10 space-y-8">

        {/* Employee Info (Read Only) */}
        <form onSubmit={handleSubmit}>
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm">
            <div className="px-8 py-5 border-b bg-slate-50">
              <h2 className="font-bold text-slate-800">Employee Information</h2>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">
              <div>
                <label className="text-sm font-bold text-slate-700">Employee Code</label>
                <input
                  type="text"
                  value={formData.employee_code}
                  disabled
                  className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-300"
                />
              </div>

              <div>
                <label className="text-sm font-bold text-slate-700">Employee Name</label>
                <input
                  type="text"
                  value={formData.employee_name}
                  disabled
                  className="w-full mt-2 px-4 py-2.5 rounded-xl border border-gray-300"
                />
              </div>
            </div>
          </section>

          {/* DFI Details */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm mt-8">
            <div className="px-8 py-5 border-b bg-slate-50 flex items-center gap-2">
              <BadgeDollarSign size={18} />
              <h2 className="font-bold text-slate-800">DFI Details</h2>
            </div>

            <div className="p-8 grid md:grid-cols-2 gap-6">

              {/* Alternate Count */}
              <div>
                <label className="text-sm font-bold text-slate-700">Alternate Count</label>
                <div className="relative mt-2">
                  <Repeat
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="dfi_alternate_count"
                    value={formData.dfi_alternate_count}
                    onChange={handleChange}
                    placeholder="Enter count"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.dfi_alternate_count
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.dfi_alternate_count && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dfi_alternate_count}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-bold text-slate-700">DFI Amount</label>
                <div className="relative mt-2">
                  <BadgeDollarSign
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                    size={18}
                  />
                  <input
                    type="number"
                    name="dfi_amount"
                    value={formData.dfi_amount}
                    onChange={handleChange}
                    placeholder="Enter amount"
                    className={`w-full pl-10 pr-4 py-2.5 rounded-xl border ${
                      errors.dfi_amount
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  />
                </div>
                {errors.dfi_amount && (
                  <p className="text-xs text-red-500 mt-1">
                    {errors.dfi_amount}
                  </p>
                )}
              </div>

            </div>
          </section>
        </form>

      </main>
    </div>
  );
};

export default RaiseDFI;