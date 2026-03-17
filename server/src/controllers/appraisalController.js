import Appraisals from "../models/appraisals.js";
import Employees from "../models/employees.js";

export const raiseAppraisal = async (req, res) => {
  try {
    const {
      employee_code,
      employee_name,
      joining_date,
      lastincrement_date,
      achievements,
      sep_qualification,
    } = req.body;

    const newAppraisal = new Appraisals({
      employee_code,
      employee_name,
      appraisal_joining_date: joining_date,
      appraisal_lastincrement_date: lastincrement_date,
      appraisal_achievements: achievements,
      appraisal_sep_qualification: sep_qualification,
    });


    await newAppraisal.save();

    res.status(200).send({
      success: true,
      message: "Appraisal submitted successfully",
      data: newAppraisal,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

export const getMyAppraisals = async (req, res) => {
  try {

    const appraisals = await Appraisals.find({employee_code: req.params.code});

    res.status(200).json({
      success: true,
      data: appraisals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};