import mongoose, { Schema, Document } from 'mongoose';

export interface ISubscription extends Document {
  subscriberId: string; // Auth0 Sub ID
  channelId: mongoose.Types.ObjectId; // User model ID being followed
}

const SubscriptionSchema = new Schema<ISubscription>({
  subscriberId: { type: String, required: true },
  channelId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
});

// Ensure a user can't subscribe to the same channel twice
SubscriptionSchema.index({ subscriberId: 1, channelId: 1 }, { unique: true });

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema);
