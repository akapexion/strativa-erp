import Appraisals from "../models/appraisals.js";
import DFIForms from "../models/dfi.js";
import KPIForms from "../models/kpi.js";

export const allFormRequests = async (req, res) => {
  try {
    const AppraisalRequests = await Appraisals.find();
    const DFIRequests = await DFIForms.find();
    const KPIRequests = await KPIForms.find();

    const AllFormSubmissions = [...AppraisalRequests, ...DFIRequests, ...KPIRequests];
    res.status(200).json({ success: true, AllFormSubmissions });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const singleFormRequest = async (req, res) => {
  try {
    const { id } = req.params;

    let form = await Appraisals.findById(id);
    if (!form) form = await DFIForms.findById(id);
    if (!form) form = await KPIForms.findById(id);

    if (!form) {
      return res.status(404).json({ success: false, message: "Form not found" });
    }

    res.status(200).json({ success: true, formSubmission: form });

  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const managerAction = async (req, res) => {
  try {
    const { id } = req.params;
    const { manager_1_remarks, form_status } = req.body;

    // Validate input
    if (!form_status || !["approved", "rejected"].includes(form_status.toLowerCase())) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const collections = [Appraisals, DFIForms, KPIForms];
    let updatedDoc = null;

    for (let Model of collections) {
      updatedDoc = await Model.findByIdAndUpdate(
        id,
        {
          manager_1_remarks,
          form_status: form_status.toLowerCase(),
        },
        { new: true } 
      );

      if (updatedDoc) break; 
    }

    if (!updatedDoc) {
      return res.status(404).json({ message: "Form not found in any collection" });
    }

    return res.json({
      message: `Form ${form_status} successfully`,
      data: updatedDoc,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};