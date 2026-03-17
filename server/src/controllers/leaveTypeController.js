import LeaveTypes from "../models/leavetypes.js";

export const addLeaveType = async (req, res) => {
  try {
    const { type, quantity } = req.body;

    if (!type || quantity === undefined) {
      return res.status(400).json({
        success: false,
        message: "Both fields are required",
      });
    }

    const newLeaveType = new LeaveTypes({
      leave_type_title: type,
      leave_type_annual_quantity: quantity,
    });

    await newLeaveType.save();

    res.status(201).json({
      success: true,
      message: "Leave Type added successfully",
      data: newLeaveType,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getAllLeaveTypes = async (req, res) => {
  try {
    const types = await LeaveTypes.find();

    res.status(200).json({
      success: true,
      leave_types: types,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};