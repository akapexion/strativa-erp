import Employees from "../models/employees.js";
import Users from "../models/users.js";
import { generateEmployeeCode } from "../utils/generateEmployeeCode.js";

export const addEmployee = async (req, res) => {
  try {
    const { employee_fname, employee_lname, employee_email } = req.body;

    const fname = req.body.employee_fname || "";
    const lname = req.body.employee_lname || "";
    const employeeCode = generateEmployeeCode(fname, lname);

    const newEmployee = new Employees({
      employee_code: employeeCode,
      employee_fname: req.body.employee_fname,
      employee_lname: req.body.employee_lname,
      employee_email: req.body.employee_email,
      employee_phonenumber: req.body.employee_phonenumber,
      employee_cnicnumber: req.body.employee_cnicnumber,
      employee_dob: req.body.employee_dob,
      employee_maritalstatus: req.body.employee_maritalstatus,
      employee_department: req.body.employee_department,
      employee_designation: req.body.employee_designation,
      employee_qualification: req.body.employee_qualification,
      employee_lastorganization: req.body.employee_lastorganization,
      employee_salary: req.body.employee_salary,
      employee_joiningdate: req.body.employee_joiningdate,
      employee_image: req.file ? req.file.filename : "",
    });

    const newUser = new Users({
      user_fullname: employee_fname + " " + employee_lname,
      user_email: employee_email,
      user_code: employeeCode,
      user_designation: req.body.employee_designation,
      user_image: req.file ? req.file.filename : "",
    });

    await newEmployee.save();
    await newUser.save();

    res.status(200).send({
      success: true,
      message: "Employee added successfully",
      data: newEmployee,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const allEmployees = async (req, res) => {
  try {
    const employees = await Employees.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      message: "Employees list fetched successfully",
      employees,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const fetchSingleEmployee = async (req, res) => {
  try {
    const employee = await Employees.findById(req.params.id);

    console.log(employee);

    res.status(200).json({ 
        success: true, 
        message: "Employees list fetched successfully", 
        employee
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const updateEmployee = async(req, res) => {
   try {
    const updatedEmployee = await Employees.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, message: "Employee updated", updatedEmployee });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
}