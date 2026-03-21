import React, { useEffect, useState } from "react";
import {
  ArrowLeft,
  FileText,
  User,
  Hash,
  Tag,
  Loader2,
  BadgeAlert,
  CheckCircle2,
  Clock,
  XCircle,
  Star,
  DollarSign,
  BarChart2,
  Percent,
  ShieldCheck,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { gooeyToast } from "goey-toast";

// ─── Status Config ────────────────────────────────────────────────────────────
const getStatusConfig = (status) => {
  switch (status?.toLowerCase()) {
    case "approved":
      return {
        icon: <CheckCircle2 size={14} />,
        label: "Approved",
        badge: "bg-emerald-50 border border-emerald-200 text-emerald-700",
        banner: "border-l-4 border-emerald-500 bg-white",
        dot: "bg-emerald-500",
        message: "This submission has been reviewed and approved by HR.",
      };
    case "rejected":
      return {
        icon: <XCircle size={14} />,
        label: "Rejected",
        badge: "bg-red-50 border border-red-200 text-red-600",
        banner: "border-l-4 border-red-500 bg-white",
        dot: "bg-red-500",
        message: "This submission has been rejected by HR.",
      };
    case "pending":
    default:
      return {
        icon: <Clock size={14} />,
        label: "Pending",
        badge: "bg-amber-50 border border-amber-200 text-amber-700",
        banner: "border-l-4 border-amber-400 bg-white",
        dot: "bg-amber-400",
        message: "Your submission is currently under review",
      };
  }
};

// ─── Form Type Config ─────────────────────────────────────────────────────────
const getFormTypeConfig = (title) => {
  if (title === "Annual Appraisal")
    return { icon: <Star size={15} />, detailLabel: "Appraisal Details" };
  if (title === "Direct Financial Incentive - DFI")
    return { icon: <DollarSign size={15} />, detailLabel: "DFI Details" };
  return { icon: <BarChart2 size={15} />, detailLabel: "KPI Details" };
};

// ─── Field Block ──────────────────────────────────────────────────────────────
const Field = ({ icon, label, value, mono = false, colSpan = false }) => (
  <div className={`flex flex-col gap-1.5 ${colSpan ? "md:col-span-2" : ""}`}>
    <div className="flex items-center gap-1.5">
      <span className="text-slate-400">{icon}</span>
      <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">
        {label}
      </p>
    </div>
    <div
      className={`text-sm font-semibold text-slate-800 pl-0.5 leading-relaxed ${
        mono ? "font-mono" : ""
      }`}
    >
      {value || (
        <span className="text-slate-300 font-normal italic">Not provided</span>
      )}
    </div>
  </div>
);

// ─── Card Section ─────────────────────────────────────────────────────────────
const Card = ({ icon, title, accent = "text-blue-600", children }) => (
  <section className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
    <div className="px-7 py-4 border-b border-gray-100 flex items-center gap-2.5">
      <span className={accent}>{icon}</span>
      <h2 className="font-bold text-slate-800 text-sm tracking-tight">{title}</h2>
    </div>
    <div className="px-7 py-6">{children}</div>
  </section>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployeeFormDetail = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const user = JSON.parse(localStorage.getItem("user"));

  const [formDetail, setFormDetail] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [remarks, setRemarks] = useState("");

  // Determine type for backend API
  const getFormType = (title) => {
    if (title === "Annual Appraisal") return "appraisal";
    if (title === "Direct Financial Incentive - DFI") return "dfi";
    return "kpi";
  };

  // Fetch form details
  const fetchFormDetail = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      let baseURL = "";
      if (user.user_role === "user") {
        baseURL = "http://localhost:5000/user/form-submission";
      } else {
        baseURL = "http://localhost:5000/manager/form-request";
      }
      const res = await axios.get(`${baseURL}/${id}`);
      setFormDetail(res.data.formSubmission || res.data);
      setRemarks(res.data.formSubmission?.manager_1_remarks || "");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load form details.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) fetchFormDetail();
  }, [id]);

  const statusConfig = getStatusConfig(formDetail?.form_status);
  const formTypeConfig = getFormTypeConfig(formDetail?.form_title);

  const handleAction = async (status) => {
    try {
      const type = getFormType(formDetail.form_title);

      await axios.put(`http://localhost:5000/manager/action/${type}/${id}`, {
        manager_1_remarks: remarks,
        form_status: status
      });

      gooeyToast.success(`Form ${status} successfully`);
      fetchFormDetail(); // refresh UI after action
    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition-colors"
          >
            <ArrowLeft size={20} />
          </button>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">
              Form Detail
            </h1>
          </div>
        </div>

        {formDetail?.form_status && (
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${statusConfig.badge}`}
          >
            {statusConfig.icon}
            {statusConfig.label}
          </span>
        )}
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
          <Loader2 size={32} className="text-blue-500 animate-spin" />
          <p className="text-slate-400 text-sm">Loading form details...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
          <div className="p-4 bg-red-50 rounded-full">
            <BadgeAlert size={36} className="text-red-400" />
          </div>
          <p className="text-slate-700 font-bold">{error}</p>
          <button
            onClick={fetchFormDetail}
            className="px-5 py-2 text-sm font-bold text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
          >
            Try again
          </button>
        </div>
      )}

      {/* Main Content */}
      {!loading && !error && formDetail && (
        <main className="max-w-3xl mx-auto px-6 py-10 space-y-5">
          {/* Status Banner */}
          <div
            className={`${statusConfig.banner} rounded-2xl shadow-sm px-6 py-4 flex items-center gap-4`}
          >
            <div
              className={`w-2.5 h-2.5 rounded-full shrink-0 ${statusConfig.dot}`}
            />
            <div className="flex-1">
              <p className="text-sm font-bold text-slate-800">{statusConfig.label}</p>
              <p className="text-xs text-slate-500 mt-0.5">{statusConfig.message}</p>
            </div>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold ${statusConfig.badge}`}
            >
              {statusConfig.icon}
              {statusConfig.label}
            </span>
          </div>

          {/* Form Info */}
          <Card icon={<FileText size={16} />} title="Form Information" accent="text-blue-600">
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
              <Field icon={<FileText size={13} />} label="Form Title" value={formDetail.form_title} />
              <Field
                icon={<Tag size={13} />}
                label="Category"
                value={
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-slate-100 border border-slate-200 text-slate-600 font-bold text-xs rounded-lg">
                    Academics
                  </span>
                }
              />
              <Field
                icon={<ShieldCheck size={13} />}
                label="Submission Status"
                value={
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${statusConfig.badge}`}>
                    {statusConfig.icon}
                    {statusConfig.label}
                  </span>
                }
              />
            </div>
          </Card>

          {/* Employee Info */}
          <Card icon={<User size={16} />} title="Employee Information" accent="text-slate-600">
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
              <Field icon={<User size={13} />} label="Full Name" value={formDetail.employee_name} />
              <Field icon={<Hash size={13} />} label="Employee Code" value={formDetail.employee_code} mono />
            </div>
          </Card>

          {/* Form Specific Details */}
          <Card icon={formTypeConfig.icon} title={formTypeConfig.detailLabel} accent="text-slate-600">
            <div className="grid md:grid-cols-2 gap-x-10 gap-y-5">
              {formDetail.form_title === "Annual Appraisal" ? (
                <>
                  <Field icon={<Star size={13} />} label="Achievements" value={formDetail.appraisal_achievements} colSpan />
                  <Field
                    icon={<CheckCircle2 size={13} />}
                    label="SEP Qualification"
                    value={
                      formDetail.appraisal_sep_qualification ? (
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-bold ${
                            formDetail.appraisal_sep_qualification?.toLowerCase() === "yes"
                              ? "bg-emerald-50 border border-emerald-200 text-emerald-700"
                              : "bg-red-50 border border-red-200 text-red-600"
                          }`}
                        >
                          {formDetail.appraisal_sep_qualification?.toLowerCase() === "yes" ? (
                            <CheckCircle2 size={12} />
                          ) : (
                            <XCircle size={12} />
                          )}
                          {formDetail.appraisal_sep_qualification}
                        </span>
                      ) : null
                    }
                  />
                </>
              ) : formDetail.form_title === "Direct Financial Incentive - DFI" ? (
                <>
                  <Field icon={<Hash size={13} />} label="Alternate Count" value={formDetail.dfi_alternate_count} mono />
                  <Field
                    icon={<DollarSign size={13} />}
                    label="Incentive Amount"
                    value={formDetail.dfi_amount ? `PKR ${Number(formDetail.dfi_amount).toLocaleString()}` : null}
                    mono
                  />
                </>
              ) : (
                <>
                  <Field icon={<BarChart2 size={13} />} label="Batch" value={formDetail.kpi_batch} mono />
                  <Field icon={<Hash size={13} />} label="Semester" value={formDetail.kpi_batch_semester} mono />
                  <Field icon={<Hash size={13} />} label="DO Count" value={formDetail.kpi_do_count} mono />
                  <Field icon={<Percent size={13} />} label="Attendance Percentage" value={formDetail.kpi_batch_attendence_percentage ? `${formDetail.kpi_batch_attendence_percentage}%` : null} mono />
                </>
              )}
            </div>
          </Card>
          
          {user.user_role === "manager" ? 
          (
          /* Manager Remarks & Approve/Reject */
          <Card icon={formTypeConfig.icon} title="Remarks" accent="text-slate-600">
            <textarea
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              className="w-[100%] border border-gray-300 focus:border-blue-500 p-5 h-36 focus:outline-none"
            />
            <div className="flex justify-end gap-2 my-2">
              <button
                disabled={formDetail.form_status !== "pending"}
                onClick={() => handleAction("approved")}
                className="bg-green-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                Approve
              </button>
              <button
                disabled={formDetail.form_status !== "pending"}
                onClick={() => handleAction("rejected")}
                className="bg-red-600 text-white px-6 py-2 rounded disabled:opacity-50"
              >
                Reject
              </button>
            </div>
          </Card>
      )
          :
          null
          }
        </main>
      )}
    </div>
  );
};

export default EmployeeFormDetail;