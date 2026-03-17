import mongoose from 'mongoose'

const formsModel = new mongoose.Schema({
    form_title : {
        type: String,
        required: true
    },
    form_target_role : {
        type: String,
        required: true
    }
})

const Forms = mongoose.model("Form", formsModel);

export default Forms;