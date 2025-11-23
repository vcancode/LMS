import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

const jwtauthmiddleware = (req, res, next) => {
  //* first check authorization if it exists or not

  const authorization = req.headers.authorization;
  if (!authorization) return res.json({ error: "token missing" });

  //* extract the jwt token from headers of the request
  const token = req.headers.authorization.split(" ")[1];

  //* this splits the keywords into two parts ... one is bearer and other is entire token itself so we are taking token part by indexing to 1
  if (!token) res.status(404).json({ error: "unauthorized" });
  

  try {
    // !verify the token
    const decoded = jwt.verify(token, process.env.secretkey);
    

    //* it returns the body and info of the token which acts as a pyload of the information of the user

    // ?attach user information to the request
    req.userdata = decoded;
    

    next(); //! shift to next  funciton i.e controller
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

//! now we need to generate token

const generatetoken = (Userdata) => {
  //* Userdata is the payload

  // *  generate the token

  return jwt.sign(Userdata, process.env.secretkey);
  //? both creating and testing the token will require secret key
};

export { jwtauthmiddleware, generatetoken };
//? we will use this in the main file
