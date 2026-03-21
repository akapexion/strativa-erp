import mongoose from 'mongoose'

const appraisalsModel = new mongoose.Schema({
    form_no: {
        type: String,
        unique: true,
        default: () => `FORM-${Math.floor(Math.random() * 1000)}`
    },
    employee_code: {
        type: String,
        required: true
    },
    employee_name: {
        type: String,
        required: true
    },
    appraisal_joining_date: Date,
    appraisal_lastincrement_date: Date,
    appraisal_achievements: String,
    appraisal_sep_qualification: {
        type: String,
        enum: ["Yes", "No"],
        default: "No"
    },
    form_title: {
        type: String,
        default: "Annual Appraisal"
    },
    form_status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending"
    },
    manager_1_remarks: {
        type: String,
        default: ""
    },
    manager_2_remarks: {
        type: String,
        default: ""
    },
    manager_3_remarks: {
        type: String,
        default: ""
    }
    })

const Appraisals = mongoose.model("Appraisal", appraisalsModel);

export default Appraisals;