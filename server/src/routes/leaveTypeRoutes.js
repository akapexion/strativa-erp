import express from "express";
import { addLeaveType, getAllLeaveTypes } from "../controllers/leaveTypeController.js";

const leaveTypeRoute = express.Router();

// Add Leave Type
leaveTypeRoute.post("/add-leave-type", addLeaveType);

// Get all Leave Types
leaveTypeRoute.get("/all-leave-types", getAllLeaveTypes);

export default leaveTypeRoute;