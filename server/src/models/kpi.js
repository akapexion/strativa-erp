import mongoose from 'mongoose'

const KPIModel = new mongoose.Schema({
    employee_id : {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Employee"
    },
    employee_code : {
        type : String,
        unique : true
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
    }
})

const KPIForms = mongoose.model("KPIForm", KPIModel);

export default KPIForms;