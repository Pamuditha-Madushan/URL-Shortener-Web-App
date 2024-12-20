import mongoose, { Document, Schema } from "mongoose";

export interface IUrl extends Document {
  shortenUrl: string;
  redirectUrl: string;
  visitHistory: {
    timestamp: Date;
    ipAddress?: string;
  }[];
}

const urlSchema: Schema = new mongoose.Schema(
  {
    shortenUrl: {
      type: String,
      required: true,
      unique: true,
    },
    redirectUrl: {
      type: String,
      required: true,
    },
    visitHistory: {
      type: [
        {
          timestamp: { type: Date, default: Date.now },
          ipAddress: { type: String },
        },
      ],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Url = mongoose.model<IUrl>("Url", urlSchema);

export default Url;
