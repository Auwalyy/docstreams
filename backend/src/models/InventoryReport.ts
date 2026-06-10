import mongoose, { Schema, Document } from 'mongoose';

interface IOutletEntry {
  outletName: string;
  outletAddress: string;
  openingPmsStock: number;
  productReceived: number;
  pumpPrice: number;
  pumpDispensingLevel: number;
}

export interface IInventoryReport extends Document {
  createdBy: mongoose.Types.ObjectId;
  entries: IOutletEntry[];
}

const InventorySchema = new Schema<IInventoryReport>(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    entries: [
      {
        outletName: { type: String, required: true },
        outletAddress: { type: String, required: true },
        openingPmsStock: { type: Number, required: true },
        productReceived: { type: Number, required: true },
        pumpPrice: { type: Number, required: true },
        pumpDispensingLevel: { type: Number, required: true },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.model<IInventoryReport>('InventoryReport', InventorySchema);
