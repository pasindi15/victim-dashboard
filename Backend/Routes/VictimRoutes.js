const express = require('express');
const router = express.Router();
//Insert Models
const Victim = require('../Model/VictimModel');
//Insert Controllers
const VictimController = require('../Controllers/VictimControllers');

//Route paths
router.get('/', VictimController.getAllVictims);
router.post('/', VictimController.addVictims);
router.get('/:id', VictimController.getVictimById);
router.put('/:id', VictimController.updateVictim);
router.delete('/:id', VictimController.deleteVictim);

//export the router
module.exports = router;
