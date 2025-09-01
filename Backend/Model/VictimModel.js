// Mongoose model for disaster victim reports with media + geolocation
const mongoose = require('mongoose');

const MediaSchema = new mongoose.Schema(
  {
    filename: { type: String },
    url:      { type: String },   // absolute URL served from /uploads/<file>
    mimetype: { type: String },
    size:     { type: Number }    // bytes
  },
  { _id: false }
);

const VictimSchema = new mongoose.Schema(
  {
    // Reporter / victim basics
    name:    { type: String, required: true },
    age:     { type: Number, required: true },
    email:   { type: String, required: true },
    phone:   { type: String, required: true },
    address: { type: String, required: true },

    description: { type: String, required: true },

    // Legacy single image (kept for backward-compat)
    image: { type: String },

    // Multiple attachments (images/videos)
    media: { type: [MediaSchema], default: [] },

    // Risk status ONLY (render as colored dot in UI)
    // Allowed: High | Medium | Low
    status: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
      default: 'Low'
    },

    // When the incident occurred (optional)
    occurredAt: { type: Date },

    // GeoJSON location ([lng, lat]) for geospatial queries (optional)
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: {
        type: [Number],     // [lng, lat]
        default: [0, 0]
      }
    },

    // Original created date (kept for compatibility)
    date: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Geospatial index for $near queries
VictimSchema.index({ location: '2dsphere' });

module.exports = mongoose.model('VictimModel', VictimSchema);
