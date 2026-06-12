import mongoose, { Schema, Document } from 'mongoose';

export interface IVideo extends Document {
  userId: mongoose.Types.ObjectId;
  title: string;
  description: string;
  videoUrl: string;
  thumbnailUrl: string;
  views: number;
  likes: string[]; // Array of Auth0 User IDs
}

const VideoSchema = new Schema<IVideo>({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  title: { type: String, required: true },
  description: { type: String },
  videoUrl: { type: String, required: true },
  thumbnailUrl: { type: String, required: true },
  views: { type: Number, default: 0 },
  likes: { type: [String], default: [] },
}, { timestamps: true });

export default mongoose.models.Video || mongoose.model<IVideo>('Video', VideoSchema);
