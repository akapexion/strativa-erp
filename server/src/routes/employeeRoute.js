import express from "express";
import upload from "../middleware/uploadMiddleware.js";
import { addEmployee, allEmployees, fetchSingleEmployee, updateEmployee } from "../controllers/employeeController.js";

const employeeRoute = express.Router();

employeeRoute.post("/add-employee", upload.single("employee_image"), addEmployee);
employeeRoute.get("/all-employees", allEmployees);
employeeRoute.get("/employee/:id", fetchSingleEmployee);
employeeRoute.put("/update-employee/:id", updateEmployee);

export default employeeRoute;