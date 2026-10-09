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
} from "lucide-react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    display: flex; align-items: center; gap: 8px;
    padding: 9px 22px; font-size: 13px; font-weight: 800;
    color: #fff;
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    border: none; border-radius: 12px; cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.35);
    transition: opacity 0.15s, box-shadow 0.15s, transform 0.15s;
  }
  .ps-print-btn:hover { opacity: 0.92; box-shadow: 0 6px 20px rgba(99,102,241,0.45); transform: translateY(-1px); }

  /* ── Payslip Paper Card ── */
  .ps-paper {
    background: #fff;
    border: 1px solid #e2e8f0;
    border-radius: 24px;
    box-shadow: 0 4px 24px rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.03);
    padding: 40px;
    max-width: 840px; margin: 0 auto;
    position: relative; overflow: hidden;
  }

  .ps-paper-header {
    border-bottom: 2px solid #f1f5f9;
    padding-bottom: 24px; margin-bottom: 28px;
    display: flex; align-items: flex-start; justify-content: space-between;
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
    padding: 20px 24px;
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 24px;
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

// Simple number to words converter for Pakistani Rupees
const numberToWords = (num) => {
  const a = ['', 'One ', 'Two ', 'Three ', 'Four ', 'Five ', 'Six ', 'Seven ', 'Eight ', 'Nine ', 'Ten ', 'Eleven ', 'Twelve ', 'Thirteen ', 'Fourteen ', 'Fifteen ', 'Sixteen ', 'Seventeen ', 'Eighteen ', 'Nineteen '];
  const b = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];
  
  const inWords = (n) => {
    if ((n = n.toString()).length > 9) return 'overflow';
    let nArr = ('000000000' + n).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!nArr) return '';
    let str = '';
    str += (nArr[1] != 0) ? (a[Number(nArr[1])] || b[nArr[1][0]] + ' ' + a[nArr[1][1]]) + 'Crore ' : '';
    str += (nArr[2] != 0) ? (a[Number(nArr[2])] || b[nArr[2][0]] + ' ' + a[nArr[2][1]]) + 'Lakh ' : '';
    str += (nArr[3] != 0) ? (a[Number(nArr[3])] || b[nArr[3][0]] + ' ' + a[nArr[3][1]]) + 'Thousand ' : '';
    str += (nArr[4] != 0) ? (a[Number(nArr[4])] || b[nArr[4][0]] + ' ' + a[nArr[4][1]]) + 'Hundred ' : '';
    str += (nArr[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(nArr[5])] || b[nArr[5][0]] + ' ' + a[nArr[5][1]]) : '';
    return str;
  };
  return inWords(num) ? `${inWords(num).trim()} Rupees Only` : 'Zero Rupees';
};

const SalaryPayslip = () => {
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem("user") || "{}");

  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Month & Year Selector
  const [selectedMonth, setSelectedMonth] = useState("July");
  const [selectedYear, setSelectedYear] = useState("2026");

  const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const years = ["2026", "2025", "2024"];

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/profile/getprofile", {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data?.success && res.data.data) {
        setProfileData(res.data.data);
      }
    } catch (err) {
      console.error("Fetch profile error for payslip:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const rawSalary = Number(profileData?.employee_salary || 125000);

  // Earnings Breakdown
  const basicSalary = Math.round(rawSalary * 0.60);
  const hra = Math.round(rawSalary * 0.25);
  const medicalAllowance = Math.round(rawSalary * 0.10);
  const specialAllowance = rawSalary - (basicSalary + hra + medicalAllowance);
  const grossEarnings = rawSalary;

  // Deductions Breakdown
  const incomeTax = Math.round(grossEarnings * 0.03); // 3% estimated tax
  const providentFund = Math.round(grossEarnings * 0.02); // 2% PF
  const totalDeductions = incomeTax + providentFund;

  const netSalary = grossEarnings - totalDeductions;
  const netSalaryWords = numberToWords(netSalary);

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
                Official Monthly Pay Slip Statement
              </p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, borderRadius: 10, border: "1.5px solid #e8ecf0", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {months.map((m) => (
                  <option key={m} value={m}>{m}</option>
                ))}
              </select>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                style={{ padding: "8px 14px", fontSize: 13, fontWeight: 700, borderRadius: 10, border: "1.5px solid #e8ecf0", outline: "none", cursor: "pointer", fontFamily: "inherit" }}
              >
                {years.map((y) => (
                  <option key={y} value={y}>{y}</option>
                ))}
              </select>
            </div>

            <button onClick={handlePrint} className="ps-print-btn">
              <Printer size={16} strokeWidth={2.5} />
              Print / Download PDF
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "100px 24px", gap: 12 }}>
            <Loader2 size={28} color="#6366f1" className="animate-spin" />
            <p style={{ fontSize: 14, fontWeight: 700, color: "#334155" }}>Generating salary payslip…</p>
          </div>
        )}

        {/* Main Paper Content */}
        {!loading && (
          <main style={{ padding: "36px 24px" }}>
            <div className="ps-paper">
              
              {/* Paper Header */}
              <div className="ps-paper-header">
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #4f46e5)", display: "flex", alignItems: "center", justify: "center", color: "#fff", fontWeight: 900, fontSize: 18 }}>
                      S
                    </div>
                    <div>
                      <h2 style={{ fontSize: 18, fontWeight: 900, color: "#0f172a", letterSpacing: "-0.01em" }}>STRATIVA ERP</h2>
                      <p style={{ fontSize: 11, color: "#64748b", fontWeight: 600 }}>Human Resources &amp; Payroll Division</p>
                    </div>
                  </div>
                </div>

                <div style={{ textAlign: "right" }}>
                  <span style={{ fontSize: 11, fontWeight: 800, color: "#059669", background: "#ecfdf5", border: "1.5px solid #a7f3d0", padding: "4px 12px", borderRadius: 99 }}>
                    CONFIDENTIAL PAYSLIP
                  </span>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#64748b", marginTop: 8 }}>
                    Pay Period: <strong style={{ color: "#0f172a" }}>{selectedMonth} {selectedYear}</strong>
                  </p>
                  <p style={{ fontSize: 11, color: "#94a3b8", fontFamily: "'Courier New', monospace", marginTop: 2 }}>
                    Slip Ref: PAY-{selectedYear}-{(selectedMonth.slice(0,3)).toUpperCase()}-{user.user_code || "1001"}
                  </p>
                </div>
              </div>

              {/* Employee & Payment Meta Grid */}
              <div className="ps-grid-2" style={{ marginBottom: 28 }}>
                <div className="ps-info-block">
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                    <User size={13} /> Employee Information
                  </p>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Full Name:</span>
                    <span className="ps-info-val">{profileData?.employee_fname} {profileData?.employee_lname}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Employee Code:</span>
                    <span className="ps-info-val" style={{ fontFamily: "'Courier New', monospace" }}>{profileData?.employee_code || user.user_code}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Designation:</span>
                    <span className="ps-info-val">{profileData?.employee_designation || user.user_designation}</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Department:</span>
                    <span className="ps-info-val">{profileData?.employee_department || "Operations"}</span>
                  </div>
                </div>

                <div className="ps-info-block">
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.06em", display: "flex", alignItems: "center", gap: 6 }}>
                    <CreditCard size={13} /> Payment &amp; Bank Details
                  </p>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Payment Mode:</span>
                    <span className="ps-info-val">Direct Bank Transfer</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Bank Name:</span>
                    <span className="ps-info-val">Habib Bank Limited (HBL)</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Account No:</span>
                    <span className="ps-info-val" style={{ fontFamily: "'Courier New', monospace" }}>PK92 HABB 0001 **** 9821</span>
                  </div>
                  <div className="ps-info-row">
                    <span className="ps-info-label">Disbursement Date:</span>
                    <span className="ps-info-val">28-{selectedMonth.slice(0,3)}-{selectedYear}</span>
                  </div>
                </div>
              </div>

              {/* Earnings & Deductions Tables Grid */}
              <div className="ps-grid-2" style={{ marginBottom: 20 }}>
                
                {/* Earnings Table */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <DollarSign size={14} color="#10b981" /> Earnings Breakdown
                  </h3>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th className="ps-th">Description</th>
                        <th className="ps-th" style={{ textAlign: "right" }}>Amount (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-td">Basic Salary</td>
                        <td className="ps-td ps-td-amount">{basicSalary.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">House Rent Allowance (HRA)</td>
                        <td className="ps-td ps-td-amount">{hra.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Medical Allowance</td>
                        <td className="ps-td ps-td-amount">{medicalAllowance.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Special / Performance Allowance</td>
                        <td className="ps-td ps-td-amount">{specialAllowance.toLocaleString()}</td>
                      </tr>
                      <tr style={{ background: "#f8fafc" }}>
                        <td className="ps-td" style={{ fontWeight: 800, color: "#0f172a" }}>Total Gross Earnings</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#059669" }}>{grossEarnings.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                {/* Deductions Table */}
                <div>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a", marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
                    <FileText size={14} color="#f43f5e" /> Deductions
                  </h3>
                  <table className="ps-table">
                    <thead>
                      <tr>
                        <th className="ps-th">Description</th>
                        <th className="ps-th" style={{ textAlign: "right" }}>Amount (PKR)</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td className="ps-td">Income Tax Deduction</td>
                        <td className="ps-td ps-td-amount">{incomeTax.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Provident Fund / EOBI</td>
                        <td className="ps-td ps-td-amount">{providentFund.toLocaleString()}</td>
                      </tr>
                      <tr>
                        <td className="ps-td">Unpaid Leaves / Absences</td>
                        <td className="ps-td ps-td-amount">0</td>
                      </tr>
                      <tr style={{ background: "#f8fafc" }}>
                        <td className="ps-td" style={{ fontWeight: 800, color: "#0f172a" }}>Total Deductions</td>
                        <td className="ps-td ps-td-amount" style={{ color: "#e11d48" }}>{totalDeductions.toLocaleString()}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

              </div>

              {/* Net Salary Highlighted Box */}
              <div className="ps-total-box">
                <div>
                  <p style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", textTransform: "uppercase", letterSpacing: "0.08em" }}>
                    Net Salary Payable
                  </p>
                  <p style={{ fontSize: 12, fontWeight: 700, color: "#475569", marginTop: 4 }}>
                    Amount in words: <strong style={{ color: "#1e1b4b" }}>{netSalaryWords}</strong>
                  </p>
                </div>
                <div style={{ textAlign: "right" }}>
                  <p style={{ fontSize: 28, fontWeight: 900, color: "#4338ca", letterSpacing: "-0.02em" }}>
                    PKR {netSalary.toLocaleString()}.00
                  </p>
                </div>
              </div>

              {/* Stamp & Footer Signatures */}
              <div style={{ marginTop: 40, paddingTop: 24, borderTop: "1.5px dashed #e2e8f0", display: "flex", alignItems: "center", justifyValue: "space-between", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <ShieldCheck size={28} color="#10b981" />
                  <div>
                    <p style={{ fontSize: 12, fontWeight: 800, color: "#0f172a" }}>Electronically Approved</p>
                    <p style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>Strativa ERP Automated Payroll System</p>
                  </div>
                </div>

                <div style={{ textAlign: "center" }}>
                  <div style={{ width: 140, borderBottom: "1.5px solid #cbd5e1", marginBottom: 4 }} />
                  <p style={{ fontSize: 11, fontWeight: 700, color: "#64748b" }}>Authorized Signatory</p>
                </div>
              </div>

            </div>
          </main>
        )}
      </div>
    </>
  );
};

export default SalaryPayslip;
