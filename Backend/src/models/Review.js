import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  booking: { type: mongoose.Schema.Types.ObjectId, ref: 'Booking', required: true },
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  barber: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true }
}, { timestamps: true });

// Prevent multiple reviews for same booking
reviewSchema.index({ booking: 1, customer: 1 }, { unique: true });

// Static method to calculate average rating for a barber
reviewSchema.statics.calculateAvgRating = async function(barberId) {
  const obj = await this.aggregate([
    { $match: { barber: barberId } },
    { $group: { _id: '$barber', avgRating: { $avg: '$rating' }, numReviews: { $sum: 1 } } }
  ]);
  
  try {
    if (obj.length > 0) {
      await mongoose.model('User').findByIdAndUpdate(barberId, {
        rating: Math.round(obj[0].avgRating * 10) / 10,
        reviewCount: obj[0].numReviews
      });
    } else {
      await mongoose.model('User').findByIdAndUpdate(barberId, {
        rating: 0,
        reviewCount: 0
      });
    }
  } catch (err) {
    console.error(err);
  }
};

// Call calculateAvgRating after save and remove
reviewSchema.post('save', function() {
  this.constructor.calculateAvgRating(this.barber);
});

// For Mongoose 7/8 compat, post 'deleteOne'
reviewSchema.post('deleteOne', { document: true, query: false }, function() {
  this.constructor.calculateAvgRating(this.barber);
});

const Review = mongoose.model('Review', reviewSchema);
export default Review;
