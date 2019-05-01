const searchHelper = require('./helpers/searchHelpers');

const search = async (req, res) => {
  try {
    const { type, title } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      throw new Error('Search error');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray({ type, title });

    // Filtered data to fit the model
    const filteredData = searchHelper.mapData(mediaArray);

    res.send(filteredData);
  } catch (error) {
    res.send(error);
  }
};

module.exports = search;
