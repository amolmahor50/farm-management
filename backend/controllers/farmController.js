import Farm from '../models/Farm.js';

export const getFarms = async (req, res) => {
  try {
    const farms = await Farm.find({ userId: req.user._id }).sort({ createdAt: -1 });
    res.json(farms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getFarmById = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (farm && farm.userId.toString() === req.user._id.toString()) {
      res.json(farm);
    } else {
      res.status(404).json({ message: 'Farm not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const createFarm = async (req, res) => {
  try {
    const { farmName, acreage, cropType, season, location } = req.body;

    const farm = await Farm.create({
      userId: req.user._id,
      farmName,
      acreage,
      cropType,
      season,
      location,
    });

    res.status(201).json(farm);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const updateFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (farm && farm.userId.toString() === req.user._id.toString()) {
      farm.farmName = req.body.farmName || farm.farmName;
      farm.acreage = req.body.acreage || farm.acreage;
      farm.cropType = req.body.cropType || farm.cropType;
      farm.season = req.body.season || farm.season;
      farm.location = req.body.location !== undefined ? req.body.location : farm.location;

      const updatedFarm = await farm.save();
      res.json(updatedFarm);
    } else {
      res.status(404).json({ message: 'Farm not found' });
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const deleteFarm = async (req, res) => {
  try {
    const farm = await Farm.findById(req.params.id);

    if (farm && farm.userId.toString() === req.user._id.toString()) {
      await farm.deleteOne();
      res.json({ message: 'Farm removed' });
    } else {
      res.status(404).json({ message: 'Farm not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
