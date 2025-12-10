import express from "express"
import  { jwtauthmiddleware, generatetoken } from "../middlewares/JwtMiddleWaare.js"
import { CreateBatch, GetBatch, updateBatch } from "../controllers/BatchController.js";

const BatchRouter=express.Router()

BatchRouter.post("/createbatch",jwtauthmiddleware,CreateBatch);
BatchRouter.get("/getbatch/:id",jwtauthmiddleware,GetBatch);
BatchRouter.put("/batchupdate/:batchId",jwtauthmiddleware,updateBatch);





export default BatchRouter