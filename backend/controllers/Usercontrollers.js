import User from "../utils/usershema.js";
import  { jwtauthmiddleware, generatetoken } from "../middlewares/JwtMiddleWaare.js"




const SaveUser = async (req, res) => {
  try {
    const {firstName, lastName, email, password, role,imageUrl } = req.body;
    console.log(req.body);
    

    // Validate required fields
    if (!email) {
      return res.status(400).json({ message: "email are required" });
    }

    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(200).json({ message: "User already exists", user });
    }

    // Create new user
    const newUser = new User({
      firstName,
      lastName,
      email,
      password,
      role,
      imageUrl
    });

    const response=await newUser.save();

        const payload = {
        email : response.email,
        role: response.role
    }

    const token = generatetoken(payload);

    return res.status(201).json({
      message: "User saved successfully",
      user: newUser,
      token:token
    });
  } catch (error) {
    console.error("Error saving user:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

const LoginUser=async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    

    // Check for missing fields
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user by email
    const user = await User.findOne({ email: email });
    console.log(user);
    
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Since you are not hashing, directly compare passwords
    if (user.password !== password) {
      return res.status(400).json({ error: 'Invalid email or password' });
    }

    // Generate token payload
    const payload = {
      email: user.email,
      id: user._id,
      role: user.role, // optional, if your schema has role
    };

    // Generate JWT token
    const token = generatetoken(payload);

    // Send success response
    res.status(200).json({
      message: 'Login successful',
      token,
      user
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
}


const GetUser=async(req,res)=>{
    const jwtaccount=req.userdata
    const user= await User.findOne({email:jwtaccount.email})
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.send(user)
    
}

const UpdateUser = async (req, res) => {
  try {
    const jwtaccount = req.userdata;

    // Check for valid user
    const user = await User.findOne({ email: jwtaccount.email });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const { firstName, lastName,imageUrl } = req.body;
    if (!firstName && !lastName) {
      return res.status(400).json({ message: "Nothing to update" });
    }

    // Update values
    const updatedUser = await User.findOneAndUpdate(
      { email: jwtaccount.email },
      { firstName, lastName,imageUrl },
      { new: true }
    );

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};





export  {SaveUser,LoginUser,GetUser,UpdateUser}