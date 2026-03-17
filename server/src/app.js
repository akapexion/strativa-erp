import express from "express";
import cors from "cors";
import employeeRoute from "./routes/employeeRoute.js";
import authRoute from "./routes/authRoute.js";
import connectDB from "./config/db_connection.js";
import formRoute from "./routes/formRoutes.js";
import leaveTypeRoute from "./routes/leaveTypeRoutes.js";
import appraisalRoute from "./routes/appraisalRoute.js";


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoute);
app.use("/admin", employeeRoute);
app.use("/admin", formRoute);
app.use("/user", formRoute);
app.use("/user", appraisalRoute);
app.use("/admin", leaveTypeRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started");
})