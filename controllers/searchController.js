const searchHelper = require('./helpers/searchHelpers');

const search = async (req, res) => {
  try {
    const { title, type } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      throw new Error('Search error');
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
