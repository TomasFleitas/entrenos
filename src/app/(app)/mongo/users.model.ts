import mongoose from './connection';

if (mongoose.models?.Users) {
  delete mongoose.models.Users;
}

const userSchema = new mongoose.Schema({
  defaultName: { type: String, trim: true },
  name: { type: String, trim: true },
  uid: { type: String, required: true, trim: true },
  email: { type: String, trim: true },
  lastDonationAt: Date,
  birthday: Date,
  notificationTokens: {
    type: Map,
    of: { type: String, trim: true },
  },
  avatar: {
    seed: String,
    avatarStyle: String,
  },
  mercadoPago: {
    access_token: String,
    expires_in: Number,
    user_id: Number,
    refresh_token: String,
    public_key: String,
    updatedAt: { type: Date, default: Date.now },
  },
  updatedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
});

userSchema.index({ uid: 'text' });

const UsersModel = mongoose.model('Users', userSchema);

export default UsersModel;
