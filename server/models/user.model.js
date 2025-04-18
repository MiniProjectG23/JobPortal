import mongoose from "mongoose";
import validator from "validator";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Please enter your Name!"],
    minLength: [3, "Name must contain at least 3 Characters!"],
    maxLength: [30, "Name cannot exceed 30 Characters!"],
  },
  email: {
    type: String,
    required: [true, "Please enter your Email!"],
    validate: [validator.isEmail, "Please provide a valid Email!"],
  },
  phone: {
    type: Number,
    required: [true, "Please enter your Phone Number!"],
  },
  password: {
    type: String,
    required: [true, "Please provide a Password!"],
    minLength: [8, "Password must contain at least 8 characters!"],
    maxLength: [32, "Password cannot exceed 32 characters!"],
  },
  role: {
    type: String,
    required: [true, "Please select a role"],
    enum: ["Job Seeker", "Employer"],
  },
  refreshToken: {
    type: String,
}
},{timestamps: true});


userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
   this.password = await bcrypt.hashSync(this.password, 10);
   next();
})

userSchema.methods.isPasswordCorrect = async function (enteredPassword) {
  if ( !this.password) {
    console.error('Missing password input or stored password:', {
      enteredPassword,
      storedPassword: this.password
    });
    throw new Error('Password comparison failed: missing this.password');
  }

  return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
      {
          _id: this._id,
          email: this.email,
          phone: this.phone,
          name: this.name,
          role: this.role,
      },
      process.env.ACCESS_TOKEN_SECRET,
      {
          expiresIn: process.env.ACCESS_TOKEN_EXPIRY || "1d",
      }
  );
};
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
      {
          _id: this._id,
      },
      process.env.REFRESH_TOKEN_SECRET,
      {
          expiresIn: process.env.REFRESH_TOKEN_EXPIRY || "30d", 
      }
  );
};

const User = mongoose.model("User", userSchema);

export { User };