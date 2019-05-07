// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const view = async (req, res) => {
  try {
    const { id, type } = req.params;

    const { cachedUser } = req;

    cachedUser.isAnonymous = !!cachedUser.isAnonymous;

    if ((type !== 'tv' && type !== 'movie') || id.trim() === '') {
      throw new Error('Search error');
    }

    const link = viewHelpers.getLink(id, type);

    const request = viewHelpers.mapRequests(link);

    const result = await request;

    const data = viewHelpers.getData(result);

    const mappedData = viewHelpers.mapData([data], type)[0];

    const lists = cachedUser.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');

    const hasList = lists.length !== 0;

    // res.send(mappedData);
    res.render('media/media', {
      media: mappedData,
      type,
      cachedUser,
      title: mappedData.title,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
    });
  } catch (error) {
    res.status(404).redirect('/');
  }
};

module.exports = view;
