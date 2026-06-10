import mongoose, { Schema, Document } from 'mongoose';

export interface IDocument extends Document {
  title: string;
  fileUrl: string;
  fileType: string;
  category: 'general' | 'takeover';
  facility: mongoose.Types.ObjectId;
  uploadedBy: mongoose.Types.ObjectId;
}

const DocumentSchema = new Schema<IDocument>(
  {
    title: { type: String, required: true },
    fileUrl: { type: String, required: true },
    fileType: { type: String, required: true },
    category: { type: String, enum: ['general', 'takeover'], required: true },
    facility: { type: Schema.Types.ObjectId, ref: 'Facility', required: true },
    uploadedBy: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  },
  { timestamps: true }
);

export default mongoose.model<IDocument>('Document', DocumentSchema);
