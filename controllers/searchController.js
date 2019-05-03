const searchHelper = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const search = async (req, res) => {
  try {
    const { type, title } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      throw new Error('Search error');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray({ type, title });

    if (mediaArray.length === 0) {
      throw new Error('Search error');
    }

    // Filtered data to fit the model
    const filteredData = searchHelper.mapData(mediaArray);

    let lists = [];
    if (req.user.name !== 'Anonymous') {
      lists = await listsHelpers.getListJSON(req);
    }
    // res.send(filteredData);
    res.render('search/results', { type, results: filteredData, options: lists });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = search;
