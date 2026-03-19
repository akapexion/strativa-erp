import KPIForms from "../models/kpi.js";

export const raiseKPI = async (req, res) => {
  try {
    const {
      employee_code,
      employee_name,
      kpi_batch,
      kpi_batch_semester,
      kpi_do_count,
      kpi_batch_attendence_percentage,
    } = req.body;

    // 🔹 Validation
    if (
      !employee_code ||
      !employee_name ||
      !kpi_batch ||
      !kpi_batch_semester ||
      kpi_do_count === undefined ||
      !kpi_batch_attendence_percentage
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // 🔹 Duplicate check (because of unique employee_code)
    const existing = await KPIForms.findOne({ employee_code });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "KPI already submitted for this employee",
      });
    }

    // 🔹 Create
    const newKPI = new KPIForms({
      employee_code,
      employee_name,
      kpi_batch,
      kpi_batch_semester,
      kpi_do_count,
      kpi_batch_attendence_percentage,
    });

    await newKPI.save();

    res.status(201).json({
      success: true,
      message: "KPI submitted successfully",
      data: newKPI,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Server error while submitting KPI",
    });
  }
};

export const getMyKPIs = async (req, res) => {
  try {
    const data = await KPIForms.find({ employee_code: req.params.code });

    res.status(200).json({
      success: true,
      data,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Error fetching KPI data",
    });
  }
};