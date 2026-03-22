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
    const { manager_remarks, form_status } = req.body;

    const collections = [Appraisals, DFIForms, KPIForms];
    let doc = null;

    for (let Model of collections) {
      doc = await Model.findById(id);
      if (doc) {

        console.log("USER:", req.body.user);

        // ❌ prevent duplicate approval
        const alreadyReviewed = doc.manager_remarks.some(
          (r) => r.manager_id.toString() === req.body.user.user_id.toString()
        );

        if (alreadyReviewed) {
          return res.status(400).json({ message: "Already reviewed" });
        }

        // ✅ push remark
        doc.manager_remarks.push({
          manager_id: req.body.user.user_id,
          manager_name: req.body.user.user_fullname,
          remark: manager_remarks,
          status: form_status,
          date: new Date(),
        });

        // ❌ if ANY rejects → final reject
        if (form_status === "rejected") {
          doc.form_status = "rejected";
        } else {
          // ✅ count approvals
          const approvedCount = doc.manager_remarks.filter(
            (r) => r.status === "approved"
          ).length;

          // ✅ total approvers
          const totalApprovers = doc.approvers.length;

          // ✅ final decision
          if (approvedCount === totalApprovers) {
            doc.form_status = "approved";
          } else {
            doc.form_status = "pending";
          }
        }

        await doc.save();
        break;
      }
    }

    if (!doc) {
      return res.status(404).json({ message: "Form not found" });
    }

    res.json({
      message: "Action recorded",
      data: doc,
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};