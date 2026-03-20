import express from "express";
import cors from "cors";
import employeeRoute from "./routes/employeeRoute.js";
import authRoute from "./routes/authRoute.js";
import connectDB from "./config/db_connection.js";
import formRoute from "./routes/formRoutes.js";
import leaveTypeRoute from "./routes/leaveTypeRoutes.js";
import appraisalRoute from "./routes/appraisalRoute.js";
import DFIRoute from "./routes/DFIRoutes.js";
import KPIRoute from "./routes/KPIRoutes.js";
import profileRoute from "./routes/profileRoutes.js";


const app = express();

app.use(cors());
app.use(express.json());

connectDB();

app.use("/auth", authRoute);
app.use("/admin", employeeRoute);
app.use("/user", employeeRoute);
app.use("/admin", formRoute);
app.use("/user", formRoute);
app.use("/user", appraisalRoute);
app.use("/user", DFIRoute);
app.use("/user", KPIRoute);
app.use("/admin", leaveTypeRoute);
app.use("/profile", profileRoute);

app.listen(process.env.PORT || 5000, () => {
  console.log("Server Started");
})