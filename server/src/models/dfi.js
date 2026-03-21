import mongoose from 'mongoose'

const DFIModel = new mongoose.Schema({
    form_no: {
        type: String,
        unique: true,
        default: () => `FORM-${Math.floor(Math.random() * 1000)}`
    },
    employee_code : {
        type : String,
        required : true
    },   
    employee_name: {
    type: String,
    required: true
    },
    dfi_alternate_count: {
        type: Number,
        required: true
    },
    dfi_amount: {
        type: Number,
        required: true
    },
    form_title: {
        type: String,
        default: "Direct Financial Incentive - DFI"
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

const DFIForms = mongoose.model("DFIForm", DFIModel);

export default DFIForms;