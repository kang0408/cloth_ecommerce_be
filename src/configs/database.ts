import mongoose from "mongoose";

const connect = async () => {
  try {
    await mongoose.connect(process.env.MONGOOSE_URL || "");
    console.log("Connect Success");
  } catch (error) {
    console.log("Connect Error!");
  }
};

export default connect;
