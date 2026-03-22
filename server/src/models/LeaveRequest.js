import mongoose from 'mongoose';

const leaveRequestModel = new mongoose.Schema({
  employee_code:    { type: String, required: true },
  employee_name:    { type: String, required: true },
  leave_type_id:    { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType" },
  leave_type_title: { type: String, required: true },
  leave_from:       { type: Date, required: true },
  leave_to:         { type: Date, required: true },
  leave_days:       { type: Number, required: true },
  leave_reason:     { type: String, required: true },
  leave_status:     { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  actioned_by:      { type: String, default: "" },
  action_remark:    { type: String, default: "" },
}, { timestamps: true });

const LeaveRequest = mongoose.model("LeaveRequest", leaveRequestModel);
export default LeaveRequest;
