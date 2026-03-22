import Appraisals from "../models/appraisals.js";
import DFIForms from "../models/dfi.js";
import KPIForms from "../models/kpi.js";
import Users from "../models/users.js";

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

        // ✅ If already finally approved or rejected — lock it
        if (doc.form_status === "approved" || doc.form_status === "rejected") {
          return res.status(400).json({
            message: `Form is already ${doc.form_status}. No further actions allowed.`,
          });
        }

        // ✅ Prevent duplicate review by same manager
        const alreadyReviewed = doc.manager_remarks.some(
          (r) => r.manager_id.toString() === req.body.user.user_id.toString()
        );

        if (alreadyReviewed) {
          return res.status(400).json({
            message: "You have already submitted your review.",
            alreadyReviewed: true,
          });
        }

        // ✅ Push this manager's remark
        doc.manager_remarks.push({
          manager_id: req.body.user.user_id,
          manager_name: req.body.user.user_fullname,
          manager_designation: req.body.user.user_designation,
          remark: manager_remarks,
          status: form_status,
          date: new Date(),
        });

        // ✅ If ANY manager rejects → immediately final reject, lock form
        if (form_status === "rejected") {
          doc.form_status = "rejected";
        } else {
          // ✅ Count total approvals so far
          const approvedCount = doc.manager_remarks.filter(
            (r) => r.status === "approved"
          ).length;

          // ✅ Total managers in system = 3 (hardcode or fetch dynamically)
          const totalManagers = await Users.countDocuments({ user_role: "manager" });

          // ✅ Only mark approved when ALL managers have approved
          if (approvedCount === totalManagers) {
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

    res.json({ message: "Action recorded", data: doc });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};