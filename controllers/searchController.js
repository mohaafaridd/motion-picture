const searchHelper = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const search = async (req, res) => {
  try {
    const { type, title } = req.query;
    const { user } = req;

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

    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');

    const hasList = lists.length !== 0;

    // res.send(filteredData);
    res.render('search/results', {
      type,
      results: filteredData,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
      user,
    });
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

module.exports = search;
