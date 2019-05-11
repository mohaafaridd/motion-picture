// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');
const mediaInfoGrapper = require('./helpers/mediaInfoGrapper');
const listsHelpers = require('./helpers/listsHelpers');

const view = async (req, res) => {
  try {
    const { id, type } = req.params;

    const { cachedUser } = req;

    cachedUser.isAnonymous = !!cachedUser.isAnonymous;

    if ((type !== 'tv' && type !== 'movie') || id.trim() === '') {
      throw new Error('Search error');
    }

    const data = await mediaInfoGrapper([{ id, type }], false);

    const lists = cachedUser.isAnonymous ? [] : await listsHelpers.getListJSON(cachedUser, cachedUser);

    const hasList = lists.length !== 0;

    res.render('media/media', {
      media: data[0],
      type,
      cachedUser,
      options: lists,
      hasList,
      isLogged: !cachedUser.isAnonymous,
    });
  } catch (error) {
    res.status(404).redirect('/');
  }
};

module.exports = view;
