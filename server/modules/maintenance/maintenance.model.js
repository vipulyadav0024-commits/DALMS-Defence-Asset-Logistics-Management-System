import mongoose from "mongoose";


const maintenanceSchema = new mongoose.Schema(
  {
    assetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Asset",
      required: true,
    },
    issue: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    reportedDate: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ["Pending", "In Progress", "Completed"],
      default: "Pending",
    },
    resolvedDate: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);
const Maintenance = mongoose.model("Maintenance", maintenanceSchema);

export default Maintenance;