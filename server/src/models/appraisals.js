import mongoose from 'mongoose'

const appraisalsModel = new mongoose.Schema({
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
        default: "Pending"
    }
    })

const Appraisals = mongoose.model("Appraisal", appraisalsModel);

export default Appraisals;