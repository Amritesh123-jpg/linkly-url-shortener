
const { promisify } = require("util");
const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const redis = require("../config/redis");
const {signAccessToken,signRefreshToken} = require("../utils/signToken");
//const appError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

/* ===============================
  ⬇️ Logic Implement Here ⬇️⬇
================================ */
// Acitve:
const createSendToken = async (user, statusCode, res) => {
  // Generate Tokens
  const accessToken = signAccessToken(user._id, user.role);
  const refreshToken = signRefreshToken(user._id);

  // Store Refresh Token in Redis (7 Days)
  await redis.set(
    `refresh:${user._id}`,
    refreshToken,
    "EX",
    7 * 24 * 60 * 60
  );

  // HttpOnly Cookie
  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: false, // true in production (HTTPS)
    sameSite: "lax",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  user.password = undefined;
  user.active = undefined;

  res.status(statusCode).json({
    status: "success",
    accessToken,
    data: {
      user,
    },
  });
};

exports.refreshToken = catchAsync(async (req, res, next) => {
  // 1. Get Refresh Token from Cookie
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    return next(new AppError("Refresh token not found", 401));
  }

  // 2. Verify Refresh Token
  const decoded = await promisify(jwt.verify)(
    refreshToken,
    process.env.JWT_REFRESH_SECRET
  );

  // 3. Check Redis
  const storedToken = await redis.get(`refresh:${decoded.id}`);

  if (!storedToken || storedToken !== refreshToken) {
    return next(new AppError("Invalid refresh token", 401));
  }

  // 4. Find User
  const user = await User.findById(decoded.id);

  if (!user) {
    return next(new AppError("User no longer exists", 401));
  }

  // 5. Generate New Access Token
  const accessToken = signAccessToken(user._id, user.role);

  res.status(200).json({
    status: "success",
    accessToken,
  });
});

/* ===============================
   SIGNUP
================================ */
exports.signUp = catchAsync(async (req, res,next) => {
  
    const { name, email, password, passwordConfirm } = req.body;

    const user = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password,
      passwordConfirm,
      
    });
    
   await createSendToken(user,201,res);
    next();
  })
  



exports.login = catchAsync(async (req,res,next)=>{
  console.log(req.body);
  let email = req.body.email;
  const password = req.body.password;

  //// In body email and password exits or not?
  if(!email || !password){
    return next( new AppError("Please provde email or Password!😊",400));
  }

  
if(typeof email !== "string" || typeof password !== "string"){
    return next(new AppError("Email and Password must be string",400));
  }
 
if(typeof password !== "string" ){
    return next(new AppError("Password must be string and minimum 8 characters",400));
  }  


  email = email.toLowerCase().trim();
   
  // find email or password in DB 
  const user = await User.findOne({email}).select('+password');
 
  // if any one are wrong throw an error 
  if(!user || !(await user.correctPassword(password,user.password))){
    return next(new AppError("Invalid email or Password",401));
  }
  // all things are good then send token 😊
 await createSendToken(user,200,res);

});
/* ===============================
   PROTECT 🪖
================================ */

exports.protect = catchAsync(async (req,res,next) =>{
  let token;

  if(
    req.headers.authorization && req.headers.authorization.startsWith('Bearer')
  ){
  token = req.headers.authorization.split(' ')[1];
  }

  if(!token){
    return next(new AppError('You are not logged in! Please log in to get access.',401));
  }

  const decoded = await promisify(jwt.verify)(
    token,
    process.env.JWT_SECRET
  )

  const currentUser = await User.findById(decoded.id);

  if(!currentUser){
    return next(new AppError('The user belonging to this token no longer exists.',401));
  }

  if(currentUser.passwordChangedAfter(decoded.iat)){
        return next(new AppError('User recently changed password. Please log in again.',401));
  }
    
  req.user = currentUser;
  next();

}
)


exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

/* ===============================
   RESTRICT 🚫
================================ */

exports.restrict = (...roles) =>{
  return(req,res,next) =>{
    if(!roles.includes(req.user.role)){
      return next(
        new AppError('You do not have permission to perform this action 🤚🤚',403)
      )
    }
    next();
  }
}


exports.logout = catchAsync(async (req, res, next) => {
  const refreshToken = req.cookies.refreshToken;

  if (refreshToken) {
    try {
      const decoded = await promisify(jwt.verify)(
        refreshToken,
        process.env.JWT_REFRESH_SECRET
      );

      await redis.del(`refresh:${decoded.id}`);
    } catch (err) {
      // Token expired/invalid hai to bhi logout continue hoga
    }
  }

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: false,
    sameSite: "lax",
  });

  res.status(200).json({
    status: "success",
    message: "Logged out successfully",
  });
});