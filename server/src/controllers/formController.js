import Forms from "../models/forms.js";

export const addForm = async (req, res) => {
  try {
    const { form_title, form_target_role } = req.body;

    if (!form_title || !form_target_role) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newForm = new Forms({
      form_title,
      form_target_role,
    });

    await newForm.save();

    res.status(201).json({
      success: true,
      message: "Form added successfully",
      data: newForm,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getEmployeeForms = async (req, res) => {
  try {
    const employee_forms = await Forms.find();

    res.status(200).json({
      success: true,
      message: "Employee Forms fetched successfully",
      employee_forms,
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};