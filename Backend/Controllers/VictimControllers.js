const fs = require('fs');
const path = require('path');
const Victim = require('../Model/VictimModel');

/** Build an absolute URL for a file saved in /uploads */
function fileUrl(req, filename) {
  return `${req.protocol}://${req.get('host')}/uploads/${encodeURIComponent(filename)}`;
}

/** Normalize any inbound status to our risk enum (High/Medium/Low) */
function normalizeRiskStatus(input) {
  if (!input) return undefined;
  const v = String(input).trim().toLowerCase();

  // already risk values
  if (v === 'high') return 'High';
  if (v === 'medium') return 'Medium';
  if (v === 'low') return 'Low';

  // legacy workflow -> map to risk
  if (v === 'pending' || v === 'in-review') return 'Medium';
  if (v === 'approved') return 'Low';
  if (v === 'rejected') return 'High';

  return undefined; // unknown → let schema default or keep existing
}

/**
 * GET /victims
 * Optional query:
 *  - near=lng,lat (comma separated)
 *  - radius=meters (used with near)
 *  - page=1
 *  - limit=50
 *  - status=High|Medium|Low|Pending|Approved|Rejected|In-Review (we normalize)
 */
async function getAllVictims(req, res) {
  try {
    const { near, radius = 0, page = 1, limit = 50, status } = req.query;

    const q = {};

    // status filter (accepts both risk & legacy workflow; we normalize)
    const norm = normalizeRiskStatus(status);
    if (norm) q.status = norm;
    else if (status && ['High','Medium','Low'].includes(status)) q.status = status;

    // Geo filter
    if (near && Number(radius) > 0) {
      const [lng, lat] = near.split(',').map(Number);
      if (Number.isFinite(lat) && Number.isFinite(lng)) {
        q.location = {
          $near: {
            $geometry: { type: 'Point', coordinates: [lng, lat] },
            $maxDistance: Number(radius)
          }
        };
      }
    }

    const pageNum = Math.max(1, Number(page) || 1);
    const limitNum = Math.min(200, Math.max(1, Number(limit) || 50));

    const [victims, total] = await Promise.all([
      Victim.find(q)
        .sort({ createdAt: -1 })
        .skip((pageNum - 1) * limitNum)
        .limit(limitNum),
      Victim.countDocuments(q)
    ]);

    return res.status(200).json({
      victims,
      pagination: { page: pageNum, limit: limitNum, total }
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching victims' });
  }
}

/**
 * POST /victims
 * multipart/form-data
 * - files in req.files (limited by routes to 2)
 * - body fields: name, age, email, phone, address, description,
 *                status, occurredAt, lat, lng
 */
async function addVictims(req, res) {
  try {
    const {
      name,
      age,
      email,
      phone,
      address,
      description,
      status,
      occurredAt,
      lat,
      lng
    } = req.body;

    const riskStatus = normalizeRiskStatus(status) || undefined;

    // Normalize uploaded files to media[]
    const media = (req.files || []).map(f => ({
      filename: f.filename,
      url: fileUrl(req, f.filename),
      mimetype: f.mimetype,
      size: f.size
    }));

    // Keep legacy image string only if no new files uploaded
    const image =
      media.length === 0 && typeof req.body.image === 'string' && /^https?:\/\//i.test(req.body.image)
        ? req.body.image
        : undefined;

    const doc = await Victim.create({
      name,
      age,
      email,
      phone,
      address,
      description,
      status: riskStatus, // High/Medium/Low or undefined => schema default
      occurredAt: occurredAt ? new Date(occurredAt) : undefined,
      location:
        (lat !== undefined && lng !== undefined)
          ? { type: 'Point', coordinates: [Number(lng), Number(lat)] }
          : undefined,
      image,
      media
    });

    return res.status(201).json({ victim: doc });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error adding victim', error: err.message });
  }
}

/** GET /victims/:id */
async function getVictimById(req, res) {
  try {
    const victim = await Victim.findById(req.params.id);
    if (!victim) return res.status(404).json({ message: 'Victim not found' });
    return res.status(200).json({ victim });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error fetching victim' });
  }
}

/**
 * PUT /victims/:id
 * multipart/form-data allowed for adding more media
 */
async function updateVictim(req, res) {
  try {
    const {
      name,
      age,
      email,
      phone,
      address,
      description,
      status,
      occurredAt,
      lat,
      lng
    } = req.body;

    const victim = await Victim.findById(req.params.id);
    if (!victim) return res.status(404).json({ message: 'Victim not found' });

    // Update scalar fields if provided
    if (name !== undefined) victim.name = name;
    if (age !== undefined) victim.age = age;
    if (email !== undefined) victim.email = email;
    if (phone !== undefined) victim.phone = phone;
    if (address !== undefined) victim.address = address;
    if (description !== undefined) victim.description = description;

    const riskStatus = normalizeRiskStatus(status);
    if (riskStatus) victim.status = riskStatus;

    if (occurredAt !== undefined) {
      victim.occurredAt = occurredAt ? new Date(occurredAt) : undefined;
    }

    if (lat !== undefined && lng !== undefined) {
      victim.location = {
        type: 'Point',
        coordinates: [Number(lng), Number(lat)]
      };
    }
    // … inside updateVictim after we loaded `victim` and before saving:

// Remove selected existing attachments (from EditVictimProfile)
if (req.body.remove) {
  try {
    const list = JSON.parse(req.body.remove); // array of filenames
    if (Array.isArray(list) && list.length) {
      const toRemove = new Set(list.filter(Boolean));
      // delete files from disk
      victim.media.forEach(m => {
        if (m && toRemove.has(m.filename)) {
          const p = path.join(process.cwd(), 'uploads', m.filename);
          try { if (fs.existsSync(p)) fs.unlinkSync(p); } catch(_) {}
        }
      });
      // filter out removed from document
      victim.media = victim.media.filter(m => !(m && toRemove.has(m.filename)));
      // keep legacy image consistent
      if (victim.image && victim.media.every(m => m.url !== victim.image)) {
        victim.image = victim.media[0]?.url || undefined;
      }
    }
  } catch(_) { /* ignore malformed remove */ }
}


    // Append any new uploads
    const newMedia = (req.files || []).map(f => ({
      filename: f.filename,
      url: fileUrl(req, f.filename),
      mimetype: f.mimetype,
      size: f.size
    }));
    if (newMedia.length) {
      victim.media.push(...newMedia);
      // Optionally fill legacy image if empty
      if (!victim.image) victim.image = newMedia[0].url;
    }

    await victim.save();
    return res.status(200).json({ victim });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating victim' });
  }
}

/**
 * PATCH /victims/:id/location
 * Body: { lat, lng }
 */
async function updateLocation(req, res) {
  try {
    const { lat, lng } = req.body;
    if (lat === undefined || lng === undefined) {
      return res.status(400).json({ message: 'lat and lng are required' });
    }

    const victim = await Victim.findByIdAndUpdate(
      req.params.id,
      { location: { type: 'Point', coordinates: [Number(lng), Number(lat)] } },
      { new: true }
    );

    if (!victim) return res.status(404).json({ message: 'Victim not found' });
    return res.status(200).json({ victim });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error updating location' });
  }
}

/**
 * DELETE /victims/:id
 * Also removes any locally stored files from /uploads (best effort)
 */
async function deleteVictim(req, res) {
  try {
    const victim = await Victim.findByIdAndDelete(req.params.id);
    if (!victim) return res.status(404).json({ message: 'Victim not found' });

    // best-effort cleanup of local files
    (victim.media || []).forEach(m => {
      if (!m || !m.filename) return;
      const p = path.join(process.cwd(), 'uploads', m.filename);
      try {
        if (fs.existsSync(p)) fs.unlinkSync(p);
      } catch (_) {
        // ignore
      }
    });

    return res.status(200).json({ message: 'Victim deleted successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error deleting victim' });
  }
}

module.exports = {
  getAllVictims,
  addVictims,
  getVictimById,
  updateVictim,
  updateLocation,
  deleteVictim
};
