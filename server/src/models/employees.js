import mongoose from 'mongoose'

const employeesModel = new mongoose.Schema({
    employee_code : {
        type: String,
        required: true,
        unique: true
    },
    employee_fname : {
        type: String,
        required: true
    },
    employee_lname : {
        type: String,
        required: true
    },
    employee_email : {
        type: String,
        required: true,
        unique: true
    },
    employee_phonenumber : {
        type: String,
        required: true,
        trim: true
    },
    employee_cnicnumber : {
        type: Number,
        required: true,
        trim: true
    },
    employee_dob : {
        type: Date,
        required: true,
    },
    employee_maritalstatus : {
        type: String,
        required: true,
    },
    employee_image : {
        type: String,
        required: true,
    },
    employee_department : {
        type: String,
        required: true,
    },
    employee_designation : {
        type: String,
        required: true,
    },
    employee_qualification : {
        type: String,
        required: true,
    },
    employee_lastorganization : {
        type: String,
        required: true,
    },
    employee_salary : {
        type: String,
        required: true,
    },
    employee_joiningdate : {
        type: Date,
        required: true
    },
    is_manager: {
    type: Boolean,
    default: false,
  }
})

const Employees = mongoose.model("Employee", employeesModel);

export default Employees;