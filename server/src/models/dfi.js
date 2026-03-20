import mongoose from 'mongoose'

const DFIModel = new mongoose.Schema({
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
        default: "Pending"
    }
})

const DFIForms = mongoose.model("DFIForm", DFIModel);

export default DFIForms;