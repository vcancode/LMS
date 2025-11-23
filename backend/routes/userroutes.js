import express from "express"
import  {SaveUser,LoginUser,GetUser,UpdateUser}  from "../controllers/Usercontrollers.js";
import  { jwtauthmiddleware, generatetoken } from "../middlewares/JwtMiddleWaare.js"


const userrouter=express.Router()

userrouter.post("/saveuser",SaveUser);
userrouter.post("/loginuser",LoginUser)
userrouter.get("/getuser",jwtauthmiddleware,GetUser)
userrouter.put("/updateuser",jwtauthmiddleware,UpdateUser)





export default userrouter