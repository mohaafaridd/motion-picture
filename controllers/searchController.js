const searchHelper = require('./helpers/searchHelpers');

const search = async (req, res) => {
  try {
    const { title } = req.query;
    const { type } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      return res.status(400).send('Error search');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray(req.query);

    // Filtered data to fit the model
    const filteredData = searchHelper.mapData(mediaArray);

    return res.send(filteredData);
  } catch (error) {
    return res.send(error);
  }
};

module.exports = search;
