import express from 'express'
import { allFormRequests, managerAction, singleFormRequest } from '../controllers/formController.js';

const formRoute = express.Router();

// formRoute.put("/action/:id");
formRoute.get("/form-requests", allFormRequests);
formRoute.get("/form-request/:id", singleFormRequest);
formRoute.put("/action/:type/:id", managerAction);





export default formRoute;