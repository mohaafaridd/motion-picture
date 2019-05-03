const searchHelper = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const search = async (req, res) => {
  console.log('here');
  try {
    const { type, title } = req.query;

    let isLogged;

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
      isLogged = true;
    } else {
      isLogged = false;
    }

    const hasList = lists.length !== 0;

    // res.send(filteredData);
    res.render('search/results', {
      type,
      results: filteredData,
      options: lists,
      hasList,
      isLogged,
    });
  } catch (error) {
    res.status(400).send(error);
  }
};

module.exports = search;
