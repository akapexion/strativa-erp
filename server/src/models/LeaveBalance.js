import mongoose from 'mongoose';

const leaveBalanceModel = new mongoose.Schema({
  employee_code:    { type: String, required: true },
  employee_name:    { type: String, required: true },
  leave_type_id:    { type: mongoose.Schema.Types.ObjectId, ref: "LeaveType", required: true },
  leave_type_title: { type: String, required: true },
  leave_total_days: { type: Number, required: true },
  leave_used_days:  { type: Number, default: 0 },
  leave_remaining_days: {
    type: Number,
    default: function () { return this.leave_total_days; },
  },
  year: { type: Number, default: () => new Date().getFullYear() },
}, { timestamps: true });

const LeaveBalance = mongoose.model("LeaveBalance", leaveBalanceModel);
export default LeaveBalance;
