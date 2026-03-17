import mongoose from 'mongoose'

const leaveTypesModel = new mongoose.Schema({
    leave_type_title : {
        type: String,
        required: true,
    },
    leave_type_annual_quantity : {
        type: Number,
        required: true,
    }
    
})

const LeaveTypes = mongoose.model("LeaveType", leaveTypesModel);

export default LeaveTypes;