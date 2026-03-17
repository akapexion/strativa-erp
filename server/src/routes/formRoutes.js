import express from "express";
import { addForm, getEmployeeForms } from "../controllers/formController.js";

const formRoute = express.Router();

// Add Form (Admin)
formRoute.post("/add-form", addForm);

// Get forms for employees
formRoute.get("/employee-forms", getEmployeeForms);

export default formRoute;