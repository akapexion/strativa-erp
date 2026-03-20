import mongoose from 'mongoose'

const KPIModel = new mongoose.Schema({
    employee_code : {
        type : String,
        required : true
    },   
    employee_name: {
    type: String,
    required: true
    },
    kpi_batch: {
        type: String,
        required: true
    },
    kpi_batch_semester: {
        type: String,
        required: true
    },
    kpi_do_count: {
        type: Number,
        required: true
    },
    kpi_batch_attendence_percentage: {
        type: String,
        required: true
    },
    form_title: {
        type: String,
        default: "Key Performance Indicator - KPI"
    },
    form_status: {
        type: String,
        default: "Pending"
    }
})

const KPIForms = mongoose.model("KPIForm", KPIModel);

export default KPIForms;