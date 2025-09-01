const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const VictimController = require('../Controllers/VictimControllers');

const router = express.Router();

/* ---------- ensure /uploads exists ---------- */
const uploadsDir = path.join(process.cwd(), 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

/* ---------- Multer config (images + video, max 2 files) ---------- */
const storage = multer.diskStorage({
  destination: (_, __, cb) => cb(null, uploadsDir),
  filename:    (_, file, cb) => {
    const safe = (file.originalname || 'file')
      .replace(/\s+/g, '_')
      .replace(/[^\w.-]/g, '');
    cb(null, `${Date.now()}_${safe}`);
  }
});

const ALLOWED = new Set([
  'image/jpeg', 'image/png', 'image/webp', 'image/avif',
  'video/mp4', 'video/quicktime', 'video/webm'
]);

const fileFilter = (_req, file, cb) => {
  cb(null, ALLOWED.has(file.mimetype));
};

const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 25 * 1024 * 1024, // 25 MB per file
    files: 2                     // <= TWO attachments
  }
});

/* ---------------- Routes ---------------- */
router.get('/', VictimController.getAllVictims);
router.get('/:id', VictimController.getVictimById);

// multipart/form-data: use field name "media" (up to 2 files)
router.post('/', upload.array('media', 2), VictimController.addVictims);
router.put('/:id', upload.array('media', 2), VictimController.updateVictim);

// quick live location updates (no files)
router.patch('/:id/location', VictimController.updateLocation);

router.delete('/:id', VictimController.deleteVictim);

module.exports = router;
