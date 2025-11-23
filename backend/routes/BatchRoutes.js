import express from "express"
import  { jwtauthmiddleware, generatetoken } from "../middlewares/JwtMiddleWaare.js"
import { CreateBatch } from "../controllers/BatchController.js";

const BatchRouter=express.Router()

BatchRouter.post("/createbatch",jwtauthmiddleware,CreateBatch);




export default BatchRouter