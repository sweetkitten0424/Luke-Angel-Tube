import mongoose, { Schema, Document } from 'mongoose';

export interface IComment extends Document {
  videoId: mongoose.Types.ObjectId;
  auth0Id: string;
  name: string;
  picture: string;
  text: string;
}

const CommentSchema = new Schema<IComment>({
  videoId: { type: Schema.Types.ObjectId, ref: 'Video', required: true },
  auth0Id: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
  text: { type: String, required: true },
}, { timestamps: true });

export default mongoose.models.Comment || mongoose.model<IComment>('Comment', CommentSchema);
