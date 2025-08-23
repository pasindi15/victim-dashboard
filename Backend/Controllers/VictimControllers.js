const Victim = require('../Model/VictimModel');

//Data Display
const getAllVictims = async (req, res) => {

    let Victims;

    // Fetch all victims from the database
    try {
        victims = await Victim.find();
        res.status(200).json(victims);
    } catch (error) {
        console.log(error);
    }
    // Check if victims were not found
    if (!victims || victims.length === 0) {
        return res.status(404).json({ message: 'No victims found' });
    }
    //Display all users
    return res.status(200).json({ victims });
};

// data insert
const addVictims = async (req, res, next) => {
    const { name, age, email, phone, address, description, image, status } = req.body;

    let victims;

    try {
        // Create a new victim instance
        victims = new Victim({
            name,
            age,
            email,
            phone,
            address,
            description,
            image,
            status
        });

        // Save the victim to the database
        await victims.save();
        res.status(201).json({ message: 'Victim added successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error adding victim' });
    }
    // Check if the victim was not created
    if (!victims) {
        return res.status(500).json({ message: 'Unable to add victim' });
    }
    // Return the created victim
    return res.status(201).json({ victims });
};

//Get Victim by ID
const getVictimById = async (req, res, next) => {
    const id = req.params.id;

    let victim;

    // Fetch the victim by ID from the database
    try {
        victim = await Victim.findById(id);
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error fetching victim' });
    }

    // Check if the victim was not found
    if (!victim) {
        return res.status(404).json({ message: 'Victim not found' });
    }

    // Return the found victim
    return res.status(200).json({ victim });
};

//Update Victim Details
const updateVictim = async (req, res, next) => {
    const id = req.params.id;
    const { name, age, email, phone, address, description, image, status } = req.body;

    let victim;

    // Fetch the victim by ID from the database
    try {
        victim = await Victim.findByIdAndUpdate(id);
        if (!victim) {
            return res.status(404).json({ message: 'Victim not found' });
        }

        // Update the victim's details
        victim.name = name;
        victim.age = age;
        victim.email = email;
        victim.phone = phone;
        victim.address = address;
        victim.description = description;
        victim.image = image;
        victim.status = status;

        // Save the updated victim to the database
        await victim.save();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error updating victim' });
    }

    // Return the updated victim
    return res.status(200).json({ victim });
};

//Delete Victim
const deleteVictim = async (req, res, next) => {
    const id = req.params.id;

    let victim;

    // Fetch the victim by ID from the database
    try {
        victim = await Victim.findByIdAndDelete(id);
        if (!victim) {
            return res.status(404).json({ message: 'Victim not found' });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error deleting victim' });
    }

    // Return a success message
    return res.status(200).json({ message: 'Victim deleted successfully' });
};


//Exporting the functionsmodule.
exports.getAllVictims = getAllVictims;
exports.addVictims = addVictims;
exports.getVictimById = getVictimById;
exports.updateVictim = updateVictim;
exports.deleteVictim = deleteVictim;