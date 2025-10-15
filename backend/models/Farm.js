import mongoose from 'mongoose';

const farmSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'User',
  },
  farmName: {
    type: String,
    required: [true, 'Please add a farm name'],
    trim: true,
  },
  acreage: {
    type: Number,
    required: [true, 'Please add acreage'],
    min: 0,
  },
  cropType: {
    type: String,
    required: [true, 'Please add crop type'],
    trim: true,
  },
  season: {
    type: String,
    required: [true, 'Please add season'],
    trim: true,
  },
  location: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

farmSchema.index({ userId: 1 });

const Farm = mongoose.model('Farm', farmSchema);

export default Farm;
