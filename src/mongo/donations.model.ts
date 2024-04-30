import { ObjectId } from 'mongodb';
import mongoose from './connection';

if (mongoose.models.Donatios) {
  delete mongoose.models.Donatios;
}

const donationSchema = new mongoose.Schema({
  donorId: String,
  recipientId: String,
  amount: Number,
  paymentId: String,
  timestamp: { type: Date, default: Date.now },
});

donationSchema.index({ donorId: 'text' });
donationSchema.index({ recipientId: 'text' });
donationSchema.index({ timestamp: 'desc' });

// TODO FIX COLLECITON NAME
const DonationsModel = mongoose.model('Donatios', donationSchema);

export default DonationsModel;
