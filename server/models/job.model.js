import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, "Please provide a title."],
    minLength: [3, "Title must contain at least 3 Characters!"],
    maxLength: [30, "Title cannot exceed 30 Characters!"],
  },
  description: {
    type: String,
    required: [true, "Please provide decription."],
    minLength: [30, "Description must contain at least 30 Characters!"],
    maxLength: [100000, "Description cannot exceed 100000 Characters!"],
  },
  category: {
    type: String,
    required: [true, "Please provide a category."],
  },
  country: {
    type: String,
    required: [true, "Please provide a country name."],
  },
  city: {
    type: String,
    required: [true, "Please provide a city name."],
  },
  location: {
    type: String,
    required: [true, "Please provide location."],
    minLength: [20, "Location must contian at least 20 characters!"],
  },
  fixedSalary: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"], // Use 'min' for numbers
    max: [999999999, "Salary cannot exceed 9 digits"], // Use 'max' for numbers
  },
  salaryFrom: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"],
    max: [999999999, "Salary cannot exceed 9 digits"],
  },
  salaryTo: {
    type: Number,
    min: [1000, "Salary must be at least 4 digits"],
    max: [999999999, "Salary cannot exceed 9 digits"],
  },
  expired: {
    type: Boolean,
    default: false,
  },
  jobPostedOn: {
    type: Date,
    default: Date.now,
  },
  postedBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
});

export const Job = mongoose.model("Job", jobSchema);
