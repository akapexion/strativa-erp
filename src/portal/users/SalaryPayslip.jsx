import React, { useEffect, useState } from "react";
import {
  Printer,
  Calendar,
  Download,
  Building2,
  User,
  CreditCard,
  CheckCircle2,
  DollarSign,
  FileText,
  ShieldCheck,
  Loader2,
  ArrowLeft,
  Clock,
  AlertCircle,
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../config/api.js";
import { showValidationToast } from "../../utils/formValidationToast.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');

  .ps-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .ps-root { background: #f8fafc; min-height: 100vh; }

  /* ── Header ── */
  .ps-page-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
    padding: 14px 24px;
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }

  .ps-back-btn {
    width: 36px; height: 36px; border-radius: 10px;
    border: 1.5px solid #e8ecf0; background: #fff;
    display: flex; align-items: center; justify-content: center;
    color: #64748b; cursor: pointer;
    transition: border-color 0.15s, background 0.15s, color 0.15s;
    flex-shrink: 0;
  }
  .ps-back-btn:hover { border-color: #6366f1; background: #f5f3ff; color: #6366f1; }

  .ps-print-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 20px; font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ps-print-btn:hover:not(:disabled) { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  .ps-pdf-btn {
    display: inline-flex; align-items: center; gap: 8px;
    padding: 9px 20px; font-size: 13px; font-weight: 800;
    color: #0f172a;
    background: #f1f5f9;
    border: 1.5px solid #e2e8f0; border-radius: 12px; cursor: pointer;
    transition: background 0.15s; font-family: 'Plus Jakarta Sans', sans-serif;
  }
  .ps-pdf-btn:hover:not(:disabled) { background: #e2e8f0; }

  /* ── Payslip Paper Card ── */
  .ps-paper {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03);
    padding: 40px;
    max-width: 860px; margin: 0 auto;
    position: relative; overflow: hidden;
  }

  .ps-paper-header {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 24px; margin-bottom: 28px;
    display: flex; align-items: flex-start; justify-content: space-between;
    flex-wrap: wrap; gap: 16px;
  }

  .ps-grid-2 {
    display: grid; grid-template-columns: 1fr 1fr; gap: 24px;
  }

  .ps-info-block {
    background: #fafbfc;
    border: 1.5px solid #f1f5f9;
    border-radius: 16px;
    padding: 20px;
    display: flex; flex-direction: column; gap: 12px;
  }

  .ps-info-row {
    display: flex; align-items: center; justify-content: space-between;
    font-size: 13px;
  }
  .ps-info-label { font-weight: 700; color: #64748b; }
  .ps-info-val { font-weight: 800; color: #0f172a; }

  /* ── Table ── */
  .ps-table { width: 100%; border-collapse: collapse; margin-top: 8px; }
  .ps-th {
    text-align: left; font-size: 11px; font-weight: 800;
    color: #64748b; text-transform: uppercase; letter-spacing: 0.07em;
    padding: 10px 14px; background: #f8fafc; border-bottom: 1.5px solid #e2e8f0;
  }
  .ps-td {
    padding: 12px 14px; font-size: 13px; font-weight: 600; color: #334155;
    border-bottom: 1px solid #f1f5f9;
  }
  .ps-td-amount { text-align: right; font-weight: 800; color: #0f172a; }

  .ps-total-box {
    background: linear-gradient(135deg, #f5f3ff 0%, #eff6ff 100%);
    border: 1.5px solid #c7d2fe;
    border-radius: 18px;
    padding: 24px 28px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 24px; flex-wrap: wrap; gap: 16px;
  }

  /* ── Print Media Styles ── */
  @media print {
    body * { visibility: hidden; }
    .ps-root, .ps-root * { visibility: visible; }
    .ps-page-header, .ps-print-controls { display: none !important; }
    .ps-root { background: #fff !important; padding: 0 !important; }
    .ps-paper {
      box-shadow: none !important; border: none !important;
      padding: 0 !important; margin: 0 !important; width: 100% !important;
    }
    @page { size: A4; margin: 15mm; }
  }
`;

const SalaryPayslip = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [payslipData, setPayslipData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  // Month & Year Selector
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");

  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];
  const years = ["2026", "2025", "2024"];

  const fetchPayslip = async () => {
    setLoading(true);
    try {
      const monthNum = String(months.indexOf(selectedMonth) + 1).padStart(2, "0");
      const period = `${selectedYear}-${monthNum}`;

      const res = await axios.get(
        `${API_BASE_URL}/payroll/my-payslips?period=${period}&month=${selectedMonth}&year=${selectedYear}`
      );

      if (res.data?.success && res.data.payslips?.length > 0) {
        setPayslipData(res.data.payslips[0]);
      } else {
        setPayslipData(null);
      }
    } catch (err) {
      console.error("Fetch payslip error:", err);
      showValidationToast(err.response?.data?.message || "Failed to load payslip data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayslip();
  }, [selectedMonth, selectedYear]);

  // Download official backend PDF generated with PDFKit
  const handleDownloadPdf = async () => {
    if (!payslipData?._id) return;
    setDownloading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(`${API_BASE_URL}/payroll/payslip/${payslipData._id}/pdf`, {
        responseType: "blob",
        headers: { Authorization: `Bearer ${token}` },
      });

      const blob = new Blob([response.data], { type: "application/pdf" });
      const downloadUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `Payslip_${payslipData.employee_code}_${payslipData.period}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(downloadUrl);
    } catch (err) {
      console.error("PDF download error:", err);
      showValidationToast("Failed to download PDF payslip.");
    } finally {
      setDownloading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style>{styles}</style>
      <div className="ps-root">
        {/* Page Header */}
        <div className="ps-page-header">
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <button className="ps-back-btn" onClick={() => navigate(-1)}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em", lineHeight: 1.2 }}>
                Salary Payslip
              </h1>
              <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 2 }}>
                Official Monthly Pay Statement with working hours and verified deductions
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  border: "1.5px solid #e8ecf0",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{
                  padding: "8px 14px",
                  fontSize: 13,
                  fontWeight: 700,
                  borderRadius: 10,
                  border: "1.5px solid #e8ecf0",
                  outline: "none",
                  cursor: "pointer",
                  fontFamily: "inherit",
                }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleDownloadPdf}
              disabled={downloading || !payslipData}
              className="ps-pdf-btn"
            >
              {downloading ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              Download PDF
            </button>

            <button onClick={handlePrint} className="ps-print-btn">
              <Printer size={15} strokeWidth={2.5} />
              Print
            </button>
          </div>
        </div>

        {/* Main Content */}
        <main style={{ padding: "40px 24px" }}>
          {loading ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 300, gap: 12 }}>
              <Loader2 size={32} color="#6366f1" className="animate-spin" />
              <p style={{ fontSize: 14, fontWeight: 700, color: "#64748b" }}>Loading official payslip statement…</p>
            </div>
          ) : !payslipData ? (
            <div style={{ textAlign: "center", padding: "60px 24px", background: "#fff", maxWidth: 600, margin: "0 auto", borderRadius: 20, border: "1px solid #e2e8f0" }}>
              <AlertCircle size={36} color="#94a3b8" style={{ margin: "0 auto 12px" }} />
              <h3 style={{ fontSize: 16, fontWeight: 800, color: "#0f172a" }}>No Payslip Statement Available</h3>
              <p style={{ fontSize: 13, color: "#64748b", marginTop: 4 }}>
                No payroll record found for {selectedMonth} {selectedYear}.
              </p>
            </div>
          ) : (
            <div className="ps-paper">
              {/* Paper Header */}
              <div className="ps-paper-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                    <div style={{ width: 40, height: 40, borderRadius: 12, background: "#312e81", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff" }}>
                      <Building2 size={20} />
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>
                        {user.firm_name || "Apexion Strativa Global"}
                      </h2>
                      <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>
                        Official Monthly Employee Statement &bull; Firm Ref: {user.firm_code || "APEX"}
                      </p>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span
                    style={{
                      display: "inline-block",
                      padding: "4px 12px",
                      borderRadius: 8,
                      fontSize: 11,
                      fontWeight: 800,
                      background: payslipData.status === "finalized" ? "#ecfdf5" : "#fffbeb",
                      color: payslipData.status === "finalized" ? "#059669" : "#d97706",
                      border: `1px solid ${payslipData.status === "finalized" ? "#a7f3d0" : "#fde68a"}`,
                      textTransform: "uppercase",
                      letterSpacing: "0.05em",
                    }}
                  >
                    {payslipData.status}
                  </span>
                  <p style={{ fontSize: 14, fontWeight: 900, color: "#0f172a", marginTop: 4 }}>
                    {payslipData.month_name} {payslipData.year}
                  </p>
                </div>
              </div>

              {/* Employee & Attendance Overview Grid */}
              <div className="ps-grid-2" style={{ marginBottom: 28 }}>
                <div className="ps-info-block">
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Employee Profile
                  </p>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Name:</span>
                    <span className="ps-info-val">{payslipData.employee_name}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Employee Code:</span>
                    <span className="ps-info-val" style={{ fontFamily: "monospace" }}>{payslipData.employee_code}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Designation:</span>
                    <span className="ps-info-val">{payslipData.employee_designation}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Department:</span>
                    <span className="ps-info-val">{payslipData.employee_department}</span>
                  </div>
                </div>

                <div className="ps-info-block">
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em" }}>
                    Hours &amp; Attendance
                  </p>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Expected Hours:</span>
                    <span className="ps-info-val">{payslipData.expected_hours} hrs</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Worked Hours:</span>
                    <span className="ps-info-val">{payslipData.worked_hours} hrs</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Present Days:</span>
                    <span className="ps-info-val">{payslipData.present_days} days</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Absences / LOP:</span>
                    <span className="ps-info-val" style={{ color: payslipData.absent_days > 0 ? "#e11d48" : "#0f172a" }}>
                      {payslipData.absent_days} days
                    </span>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Tables */}
              <div className="ps-grid-2">
                {/* Earnings Table */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <DollarSign size={14} color="#10b981" /> Earnings
                  </h4>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th className="ps-th">Component</th>
                        <th className="ps-th" style={{ textAlign: "right" }}>Amount (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-td">Basic Salary</td>
                        <td className="ps-td ps-td-amount">{Number(payslipData.base_salary).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">House Rent Allowance (HRA)</td>
                        <td className="ps-td ps-td-amount">{Number(payslipData.hra).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Medical Allowance</td>
                        <td className="ps-td ps-td-amount">{Number(payslipData.medical_allowance).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Special Allowance</td>
                        <td className="ps-td ps-td-amount">{Number(payslipData.special_allowance).toLocaleString()}</td>
                      </tr>
                      <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                        <td className="ps-td" style={{ fontWeight: 800 }}>Gross Earnings</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#0f172a" }}>
                          PKR {Number(payslipData.gross_earnings).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Deductions Table */}
                <div>
                  <h4 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <CreditCard size={14} color="#f43f5e" /> Deductions
                  </h4>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th className="ps-th">Component</th>
                        <th className="ps-th" style={{ textAlign: "right" }}>Amount (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-td">Income Tax</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>{Number(payslipData.income_tax).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Provident Fund (PF)</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>{Number(payslipData.provident_fund).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Unpaid Leaves / LOP</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>{Number(payslipData.unpaid_leave_deduction).toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Other Deductions</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>{Number(payslipData.other_deductions).toLocaleString()}</td>
                      </tr>
                      <tr style={{ background: "#f8fafc", fontWeight: 800 }}>
                        <td className="ps-td" style={{ fontWeight: 800, color: "#e11d48" }}>Total Deductions</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>
                          PKR {Number(payslipData.total_deductions).toLocaleString()}
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Total Net Salary Box */}
              <div className="ps-total-box">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Net Salary Payable
                  </p>
                  <p style={{ fontSize: 28, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.02em", marginTop: 2 }}>
                    PKR {Number(payslipData.net_salary).toLocaleString()}
                  </p>
                  <p style={{ fontSize: 12, color: "#475569", fontWeight: 600, marginTop: 4 }}>
                    {payslipData.net_salary_in_words}
                  </p>
                </div>

                <button
                  onClick={handleDownloadPdf}
                  disabled={downloading}
                  className="ps-print-btn"
                >
                  <Download size={16} />
                  Download Verified PDF
                </button>
              </div>

              {/* Footer Note */}
              <div style={{ marginTop: 32, paddingTop: 20, borderTop: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between", fontSize: 11, color: "#94a3b8" }}>
                <span>This payslip is a system-generated document and does not require a physical signature.</span>
                <span>Audit ID: {payslipData._id}</span>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default SalaryPayslip;
