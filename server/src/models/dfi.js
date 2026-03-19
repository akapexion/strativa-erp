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
    }
})

const DFIForms = mongoose.model("DFIForm", DFIModel);

export default DFIForms;