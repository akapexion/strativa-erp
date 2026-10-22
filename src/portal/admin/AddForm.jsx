import React, { useState, useEffect } from 'react';
import { ArrowLeft, Save, FileEdit, Plus, Trash2, ArrowUp, ArrowDown, Settings, Eye } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { gooeyToast } from 'goey-toast';

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800;900&display=swap');
  .fb-root * { font-family: 'Plus Jakarta Sans', sans-serif; }
  .fb-root { background: #f8fafc; min-height: 100vh; }
  
  .fb-header {
    background: #fff;
    border-bottom: 1px solid #f1f5f9;
    box-shadow: 0 1px 3px rgba(0,0,0,0.04), 0 4px 12px rgba(0,0,0,0.03);
    position: sticky; top: 0; z-index: 40;
  }

  .fb-card {
    background: #fff;
    border: 1px solid #f1f5f9;
    border-radius: 20px;
    box-shadow: 0 1px 4px rgba(0,0,0,0.04), 0 6px 20px rgba(0,0,0,0.03);
  }

  .fb-field-card {
    background: #fff;
    border: 1.5px solid #e8ecf0;
    border-radius: 16px;
    transition: all 0.2s;
  }
  .fb-field-card:hover {
    border-color: #c7d2fe;
    box-shadow: 0 4px 12px rgba(99,102,241,0.05);
  }

  .fb-input {
    width: 100%;
    padding: 10px 14px;
    font-size: 13px;
    font-weight: 600;
    color: #0f172a;
    border: 1.5px solid #e8ecf0;
    border-radius: 12px;
    outline: none;
    transition: border-color 0.15s, box-shadow 0.15s;
    box-sizing: border-box;
  }
  .fb-input:focus {
    border-color: #6366f1;
    box-shadow: 0 0 0 3px rgba(99,102,241,0.1);
  }

  .fb-select {
    appearance: none;
    background: #fff url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%2394a3b8' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E") no-repeat right 12px center;
    padding-right: 32px;
  }

  .fb-btn-add {
    background: #f5f3ff;
    color: #6366f1;
    border: 1.5px solid #e0e7ff;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.15s;
  }
  .fb-btn-add:hover {
    background: #ede9fe;
    border-color: #c7d2fe;
    transform: translateY(-1px);
  }

  .fb-btn-save {
    background: linear-gradient(135deg, #6366f1, #4f46e5);
    color: #fff;
    border: none;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 800;
    cursor: pointer;
    box-shadow: 0 4px 14px rgba(99,102,241,0.3);
    transition: all 0.15s;
  }
  .fb-btn-save:hover {
    filter: brightness(1.08);
    box-shadow: 0 6px 20px rgba(99,102,241,0.4);
    transform: translateY(-1px);
  }

  .fb-icon-btn {
    padding: 6px;
    border-radius: 8px;
    border: 1.5px solid #e2e8f0;
    background: #fff;
    color: #64748b;
    cursor: pointer;
    transition: all 0.12s;
  }
  .fb-icon-btn:hover:not(:disabled) {
    background: #f1f5f9;
    color: #334155;
    border-color: #cbd5e1;
  }
  .fb-icon-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
  }
  
  .fb-delete-btn {
    border-color: #fecdd3;
    color: #f43f5e;
  }
  .fb-delete-btn:hover {
    background: #fff1f2;
    color: #e11d48;
    border-color: #f43f5e;
  }

  .preview-empty {
    border: 2px dashed #cbd5e1;
    border-radius: 16px;
    background: #fafbfc;
    padding: 40px 20px;
    text-align: center;
  }
`;

const AddForm = () => {
  const navigate = useNavigate();
  const { formId } = useParams();
  const [formTitle, setFormTitle] = useState('');
  const [targetRole, setTargetRole] = useState('');
  const [fields, setFields] = useState([]);

  useEffect(() => {
    if (formId) {
      const fetchForm = async () => {
        try {
          const token = localStorage.getItem("token");
          const res = await axios.get(`http://localhost:5000/custom-forms/${formId}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (res.data?.success && res.data.data) {
            const f = res.data.data;
            setFormTitle(f.form_title || '');
            setTargetRole(f.form_target_role || '');
            setFields((f.fields || []).map((fld, idx) => ({
              id: fld._id || Date.now().toString() + idx,
              field_label: fld.field_label || '',
              field_type: fld.field_type || 'text',
              field_options: fld.field_options || [],
              field_required: fld.field_required || false,
              optionsString: (fld.field_options || []).join(', ')
            })));
          }
        } catch (err) {
          console.error(err);
          gooeyToast.error("Failed to load form details for editing", {
            fillColor: "#FFF",
            bounce: 0.45,
            timing: { displayDuration: 2500 }
          });
        }
      };
      fetchForm();
    }
  }, [formId]);

  const roles = [
    { value: "all", label: "All Departments" },
    { value: "Finance", label: "Finance" },
    { value: "Human Resources", label: "Human Resources" },
    { value: "Software Engineering", label: "Software Engineering" },
    { value: "Sales", label: "Sales" }
  ];

  const fieldTypes = [
    { value: "text", label: "Single Line Text" },
    { value: "textarea", label: "Paragraph Text" },
    { value: "select", label: "Dropdown Options" },
    { value: "number", label: "Numeric Input" }
  ];

  const handleAddField = (type) => {
    const newField = {
      id: Date.now().toString(),
      field_label: '',
      field_type: type,
      field_options: [],
      field_required: false,
      optionsString: ''
    };
    setFields([...fields, newField]);
  };

  const handleFieldChange = (id, key, value) => {
    setFields(fields.map(f => {
      if (f.id === id) {
        if (key === 'optionsString') {
          const opts = value.split(',').map(s => s.trim()).filter(s => s.length > 0);
          return { ...f, optionsString: value, field_options: opts };
        }
        return { ...f, [key]: value };
      }
      return f;
    }));
  };

  const handleMoveField = (index, direction) => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === fields.length - 1) return;

    const newFields = [...fields];
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const temp = newFields[index];
    newFields[index] = newFields[targetIndex];
    newFields[targetIndex] = temp;
    setFields(newFields);
  };

  const handleDeleteField = (id) => {
    setFields(fields.filter(f => f.id !== id));
  };

  const handlePublish = async () => {
    if (!formTitle.trim() || !targetRole) {
      return gooeyToast.error("Please fill in both the title and the target audience", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }

    if (fields.length === 0) {
      return gooeyToast.error("Please add at least one field to your form", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }

    // Validate that all fields have labels
    const hasEmptyLabels = fields.some(f => !f.field_label.trim());
    if (hasEmptyLabels) {
      return gooeyToast.error("Please enter labels for all form fields", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }

    // Validate dropdowns have options
    const hasEmptyDropdowns = fields.some(f => f.field_type === 'select' && f.field_options.length === 0);
    if (hasEmptyDropdowns) {
      return gooeyToast.error("Dropdown fields must have at least one option", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }

    const payload = {
      form_title: formTitle,
      form_target_role: targetRole,
      fields: fields.map(({ field_label, field_type, field_required, field_options }) => ({
        field_label,
        field_type,
        field_required,
        field_options
      }))
    };

    try {
      const token = localStorage.getItem("token");
      const url = formId
        ? `http://localhost:5000/custom-forms/${formId}`
        : "http://localhost:5000/custom-forms/add-form";
      const method = formId ? "put" : "post";

      const res = await axios[method](url, payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      gooeyToast.success(res.data.message || (formId ? "Form updated successfully" : "Form published successfully"), {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });

      // Navigate back to Available Forms page
      navigate('/hr360/admin/forms');

    } catch (err) {
      console.error(err);
      gooeyToast.error(err.response?.data?.message || "Error saving form", {
        fillColor: "#FFF",
        bounce: 0.45,
        timing: { displayDuration: 2500 }
      });
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="fb-root">
        {/* Top Bar */}
        <div className="fb-header px-6 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => navigate(-1)} className="fb-icon-btn" style={{ padding: 8 }}>
              <ArrowLeft size={16} strokeWidth={2.5} />
            </button>
            <div>
              <h1 className="text-base font-extrabold text-slate-900 leading-tight tracking-tight">Visual Form Builder</h1>
              <p className="text-[11px] text-slate-400 font-medium">Design dynamic forms with drag-and-drop elements</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => navigate(-1)} className="fb-icon-btn px-4 py-2 text-sm font-bold">
              Cancel
            </button>
            <button 
              onClick={handlePublish} 
              disabled={!formTitle.trim() || !targetRole || fields.length === 0} 
              className="fb-btn-save flex items-center gap-2 px-5 py-2.5"
            >
              <Save size={15} strokeWidth={2.5} />
              Publish Form
            </button>
          </div>
        </div>

        {/* Builder Body */}
        <main className="max-w-6xl mx-auto px-6 py-8">
          <div className="grid lg:grid-cols-12 gap-8 items-start">
            
            {/* Left side: Configuration & Fields List */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Form Config Details */}
              <div className="fb-card p-6 space-y-4">
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f1f5f9", paddingBottom: 12 }}>
                  <div style={{ padding: 6, borderRadius: 8, background: "#f5f3ff", color: "#6366f1" }}>
                    <FileEdit size={16} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Form Configuration</h2>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" }}>Form Title</label>
                    <input 
                      type="text" 
                      placeholder="e.g., Performance Review"
                      className="fb-input"
                      value={formTitle}
                      onChange={(e) => setFormTitle(e.target.value)}
                    />
                  </div>
                  <div>
                    <label style={{ fontSize: 11, fontWeight: 800, color: "#64748b", textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6, display: "block" }}>Target Audience</label>
                    <select 
                      className="fb-input fb-select"
                      value={targetRole}
                      onChange={(e) => setTargetRole(e.target.value)}
                    >
                      <option value="" disabled>Select Target Role</option>
                      {roles.map(r => <option key={r.value} value={r.value}>{r.label}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Add Field Toolbar */}
              <div className="fb-card p-6">
                <div style={{ display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #f1f5f9", paddingBottom: 12, marginBottom: 14 }}>
                  <div style={{ padding: 6, borderRadius: 8, background: "#eff6ff", color: "#3b82f6" }}>
                    <Plus size={16} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Add Form Fields</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {fieldTypes.map(t => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleAddField(t.value)}
                      className="fb-btn-add py-2.5 flex items-center justify-center gap-1.5"
                    >
                      <Plus size={14} />
                      {t.label.split(' ')[0] + " Field"}
                    </button>
                  ))}
                </div>
              </div>

              {/* Added Fields Canvas */}
              <div className="space-y-4">
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                  <h3 style={{ fontSize: 13, fontWeight: 800, color: "#475569" }}>Form Elements ({fields.length})</h3>
                  {fields.length > 0 && <span style={{ fontSize: 11, color: "#94a3b8", fontWeight: 600 }}>Use arrows to reorder</span>}
                </div>

                {fields.length === 0 ? (
                  <div className="preview-empty">
                    <Settings size={28} style={{ color: "#cbd5e1", margin: "0 auto 8px" }} />
                    <p style={{ fontSize: 13, fontWeight: 700, color: "#64748b" }}>Your form is empty</p>
                    <p style={{ fontSize: 11, color: "#94a3b8", marginTop: 4 }}>Click any of the field types above to add elements</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {fields.map((field, idx) => (
                      <div key={field.id} className="fb-field-card p-5 space-y-4">
                        <div style={{ display: "flex", alignItems: "center", justifyValue: "space-between", justifyContent: "space-between" }}>
                          <span style={{ fontSize: 11, fontWeight: 800, color: "#6366f1", background: "#f5f3ff", padding: "3px 8px", borderRadius: 6, textTransform: "uppercase" }}>
                            {field.field_type}
                          </span>
                          
                          <div style={{ display: "flex", gap: 4 }}>
                            <button
                              type="button"
                              disabled={idx === 0}
                              onClick={() => handleMoveField(idx, 'up')}
                              className="fb-icon-btn"
                            >
                              <ArrowUp size={12} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              disabled={idx === fields.length - 1}
                              onClick={() => handleMoveField(idx, 'down')}
                              className="fb-icon-btn"
                            >
                              <ArrowDown size={12} strokeWidth={2.5} />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteField(field.id)}
                              className="fb-icon-btn fb-delete-btn"
                            >
                              <Trash2 size={12} strokeWidth={2.5} />
                            </button>
                          </div>
                        </div>

                        <div className="grid sm:grid-cols-12 gap-3 items-end">
                          <div className="sm:col-span-8">
                            <label style={{ fontSize: 10, fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: 4 }}>Field Label</label>
                            <input
                              type="text"
                              placeholder="e.g. Please enter your feedback"
                              className="fb-input"
                              value={field.field_label}
                              onChange={(e) => handleFieldChange(field.id, 'field_label', e.target.value)}
                            />
                          </div>

                          <div className="sm:col-span-4 flex items-center h-10">
                            <label className="flex items-center gap-2 cursor-pointer select-none">
                              <input
                                type="checkbox"
                                checked={field.field_required}
                                onChange={(e) => handleFieldChange(field.id, 'field_required', e.target.checked)}
                                className="w-4 h-4 rounded text-indigo-600 focus:ring-indigo-500 border-gray-300"
                              />
                              <span style={{ fontSize: 12, fontWeight: 700, color: "#475569" }}>Required</span>
                            </label>
                          </div>
                        </div>

                        {field.field_type === 'select' && (
                          <div style={{ background: "#f8fafc", padding: 12, borderRadius: 12, border: "1px solid #f1f5f9" }}>
                            <label style={{ fontSize: 10, fontWeight: 800, color: "#64748b", textTransform: "uppercase", display: "block", marginBottom: 6 }}>Dropdown Options (Comma separated)</label>
                            <input
                              type="text"
                              placeholder="e.g. Excellent, Good, Average, Poor"
                              className="fb-input"
                              value={field.optionsString}
                              onChange={(e) => handleFieldChange(field.id, 'optionsString', e.target.value)}
                            />
                            {field.field_options.length > 0 && (
                              <div style={{ display: "flex", flexWrap: "wrap", gap: 5, marginTop: 8 }}>
                                {field.field_options.map((opt, i) => (
                                  <span key={i} style={{ fontSize: 10, fontWeight: 700, color: "#3b82f6", background: "#eff6ff", border: "1px solid #bfdbfe", padding: "2px 8px", borderRadius: 6 }}>
                                    {opt}
                                  </span>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Right side: Live Preview Panel */}
            <div className="lg:col-span-5 lg:sticky lg:top-24">
              <div className="fb-card overflow-hidden">
                <div style={{ background: "#fafbfc", borderBottom: "1px solid #f1f5f9", padding: "16px 24px", display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ padding: 6, borderRadius: 8, background: "#f0fdf4", color: "#16a34a" }}>
                    <Eye size={16} strokeWidth={2.5} />
                  </div>
                  <h2 style={{ fontSize: 13, fontWeight: 800, color: "#0f172a" }}>Live Preview</h2>
                </div>
                <div className="p-6 space-y-5">
                  <div style={{ borderBottom: "1px solid #f8fafc", paddingBottom: 10 }}>
                    <h3 style={{ fontSize: 16, fontWeight: 900, color: "#0f172a" }}>{formTitle || "Untitled Form"}</h3>
                    <p style={{ fontSize: 11, color: "#94a3b8", fontWeight: 500, marginTop: 3 }}>
                      Audience: {roles.find(r => r.value === targetRole)?.label || "Not specified"}
                    </p>
                  </div>

                  {fields.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "40px 10px", color: "#cbd5e1" }}>
                      <p style={{ fontSize: 12, fontWeight: 600 }}>Preview will render dynamically here</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {fields.map((f, i) => (
                        <div key={f.id} className="space-y-1.5">
                          <label style={{ fontSize: 11, fontWeight: 800, color: "#475569", display: "flex", gap: 4 }}>
                            {f.field_label || `Field ${i + 1}`}
                            {f.field_required && <span style={{ color: "#ef4444" }}>*</span>}
                          </label>

                          {f.field_type === 'textarea' ? (
                            <textarea 
                              disabled 
                              className="fb-input" 
                              style={{ height: 60, resize: "none", background: "#f8fafc", cursor: "not-allowed" }} 
                              placeholder="Paragraph response text…" 
                            />
                          ) : f.field_type === 'select' ? (
                            <select disabled className="fb-input fb-select" style={{ background: "#f8fafc", cursor: "not-allowed" }}>
                              <option>Select option…</option>
                              {f.field_options.map((opt, oIdx) => <option key={oIdx}>{opt}</option>)}
                            </select>
                          ) : f.field_type === 'number' ? (
                            <input disabled type="number" className="fb-input" style={{ background: "#f8fafc", cursor: "not-allowed" }} placeholder="Numeric input value…" />
                          ) : (
                            <input disabled type="text" className="fb-input" style={{ background: "#f8fafc", cursor: "not-allowed" }} placeholder="Short answer text…" />
                          )}
                        </div>
                      ))}
                      
                      <button disabled className="w-full py-2.5 text-center text-sm font-bold text-slate-400 bg-slate-100 border border-slate-200 rounded-xl cursor-not-allowed">
                        Submit Submission
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </>
  );
};

export default AddForm;