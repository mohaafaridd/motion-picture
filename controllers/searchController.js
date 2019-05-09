const searchHelper = require('./helpers/searchHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const search = async (req, res) => {
  try {
    const { type, title } = req.query;
    const { cachedUser } = req;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      throw new Error('Search error');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray({ type, title });

    if (mediaArray.length === 0) {
      throw new Error('Search error');
    }

    // Filtered data to fit the model
    let filteredData = searchHelper.mapData(mediaArray);

    if (!cachedUser.isAnonymous) {
      const seenList = cachedUser.seen.map(obj => obj.id);
      filteredData = filteredData.map(media => ({ ...media, seen: seenList.includes(media.id) }));
    }

    const lists = cachedUser.isAnonymous
      ? [] : await listsHelpers.getListJSON(cachedUser, cachedUser);

    const hasList = lists.length !== 0;

    // res.send(filteredData);
    res.render('search/results', {
      title: 'Search Results',
      type,
      results: filteredData,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
      cachedUser,
    });
  } catch (error) {
    res.status(400).redirect(req.header('Referer'));
  }
};

module.exports = search;
