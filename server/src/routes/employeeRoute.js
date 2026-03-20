import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { addEmployee, allEmployees, currentEmployeeFormSubmissions, deleteEmployee, fetchSingleEmployee, updateEmployee } from "../controllers/employeeController.js";

const employeeRoute = express.Router();

employeeRoute.post("/add-employee", upload.single("employee_image"), addEmployee);
employeeRoute.get("/all-employees", allEmployees);
employeeRoute.get("/employee/:id", fetchSingleEmployee);
employeeRoute.get("/current-employee-formsubmissions/:code", currentEmployeeFormSubmissions);
employeeRoute.put("/update-employee/:id", updateEmployee);
employeeRoute.delete("/delete-employee/:id", deleteEmployee);

export default employeeRoute;