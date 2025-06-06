import mongoose, { Document } from "mongoose";

import { IOtp } from "../types/otp.types";

interface IOtpDocument extends IOtp, Document {}

const otpSchema = new mongoose.Schema<IOtpDocument>(
  {
    email: {
      type: String,
      required: true
    },
    otp: {
      type: String,
      required: true
    },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }
  },
  {
    timestamps: true
  }
);

const Otp = mongoose.model<IOtpDocument>("Otp", otpSchema, "otps");

export default Otp;
