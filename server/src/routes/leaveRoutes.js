import express from 'express'
import {
  actionLeaveRequest,
  applyLeave,
  getMyLeaveRequests,
  getAllLeaveRequests,
  getAllLeaveTypes,        
} from '../controllers/LeavesController.js';

const leaveRoute = express.Router();

// Employee
leaveRoute.post("/user/apply-leave",                        applyLeave);
leaveRoute.get ("/user/my-leave-requests/:employee_code",   getMyLeaveRequests);
leaveRoute.get ("/user/all-leavetypes",                     getAllLeaveTypes);   // ✅ add this

// Manager
leaveRoute.get ("/manager/all-leave-requests",              getAllLeaveRequests);
leaveRoute.put ("/manager/leave-request/action",            actionLeaveRequest);

export default leaveRoute;