import Employees from '../models/employees.js'

// ── 1. Apply for leave ──
export const applyLeave = async (req, res) => {
  try {
    const { employee_code, leave_type, leave_from, leave_to, leave_days, leave_reason } = req.body;

    const employee = await Employees.findOne({ employee_code });
    if (!employee) return res.status(404).json({ message: "Employee not found." });

    const alloted = employee.alloted_leaves?.[leave_type] ?? 0;
    if (alloted <= 0) {
      return res.status(400).json({ message: "No balance for this leave type." });
    }

    await Employees.findOneAndUpdate(
      { employee_code },
      {
        $push: {
          leave_requests: {
            leave_type,
            leave_from,
            leave_to,
            leave_days,
            leave_reason,
          }
        }
      }
    );

    res.status(201).json({ success: true, message: "Leave request submitted." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 2. Get my leave requests (employee) ──
export const getMyLeaveRequests = async (req, res) => {
  try {
    const employee = await Employees.findOne(
      { employee_code: req.params.employee_code },
      { leave_requests: 1 }
    );
    res.status(200).json({ success: true, requests: employee?.leave_requests || [] });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 3. Get ALL leave requests (manager) ──
export const getAllLeaveRequests = async (req, res) => {
  try {
    // Pull leave_requests from all employees and flatten into one array
    const employees = await Employees.find(
      { "leave_requests.0": { $exists: true } },  // only employees who have requests
      { employee_code: 1, employee_fname: 1, employee_lname: 1, leave_requests: 1 }
    );

    // Flatten — attach employee info to each request
    const allRequests = employees.flatMap((emp) =>
      emp.leave_requests.map((req) => ({
        ...req.toObject(),
        employee_code: emp.employee_code,
        employee_name: `${emp.employee_fname} ${emp.employee_lname}`,
      }))
    );

    // Sort by latest first
    allRequests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    res.status(200).json({ success: true, requests: allRequests });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 4. Approve / Reject (manager) ──
export const actionLeaveRequest = async (req, res) => {
  try {
    const { employee_code, request_id, leave_status } = req.body;

    const updateQuery = {
      $set: { "leave_requests.$.leave_status": leave_status },
    };

    if (leave_status === "approved") {
      const employee = await Employees.findOne(
        { employee_code, "leave_requests._id": request_id },
        { "leave_requests.$": 1 }
      );

      const request = employee?.leave_requests?.[0];
      if (!request) {
        return res.status(404).json({ message: "Leave request not found." });
      }

      updateQuery.$inc = {
        [`alloted_leaves.${request.leave_type}`]: -request.leave_days,
      };
    }

    await Employees.findOneAndUpdate(
      { employee_code, "leave_requests._id": request_id },
      updateQuery
    );

    res.status(200).json({ success: true, message: `Leave ${leave_status}.` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ── 5. Get all leave types (for dropdown) ──
export const getAllLeaveTypes = async (req, res) => {
  try {
    // Fetch all employees that have alloted_leaves assigned
    const employees = await Employees.find(
      { alloted_leaves: { $exists: true } },
      { alloted_leaves: 1 }
    );

    res.status(200).json({ success: true, leaveTypesAvailable: employees });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};