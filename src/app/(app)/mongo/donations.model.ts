import mongoose from './connection';

if (mongoose.models?.Donations) {
  delete mongoose.models.Donations;
}

const donationSchema = new mongoose.Schema({
  donorId: String,
  recipientId: String,
  amount: Number,
  paymentId: String,
  timestamp: { type: Date, default: Date.now },
});

donationSchema.index({ donorId: 'text' });
donationSchema.index({ paymentId: 'text' });
donationSchema.index({ recipientId: 'text' });
donationSchema.index({ timestamp: 'desc' });

const DonationsModel = mongoose.model('Donations', donationSchema);

export default DonationsModel;
