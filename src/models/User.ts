import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  auth0Id: string;
  email: string;
  name: string;
  picture: string;
  role: 'user' | 'admin';
}

const UserSchema = new Schema<IUser>({
  auth0Id: { type: String, required: true, unique: true },
  email: { type: String, required: true },
  name: { type: String, required: true },
  picture: { type: String },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
}, { timestamps: true });

export default mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
