// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');
const listsHelpers = require('./helpers/listsHelpers');

const view = async (req, res) => {
  try {
    const { id, type } = req.params;

    const { user } = req;

    user.isAnonymous = !!user.isAnonymous;

    if ((type !== 'tv' && type !== 'movie') || id.trim() === '') {
      throw new Error('Search error');
    }

    const link = viewHelpers.getLink(id, type);

    const request = viewHelpers.mapRequests(link);

    const result = await request;

    const data = viewHelpers.getData(result);

    const mappedData = viewHelpers.mapData([data], type)[0];

    const lists = user.isAnonymous ? [] : await listsHelpers.getListJSON(req, 'user');

    const hasList = lists.length !== 0;

    // res.send(mappedData);
    res.render('media/media', {
      media: mappedData,
      type,
      user,
      title: mappedData.title,
      options: lists,
      hasList,
      isLogged: !user.isAnonymous,
    });
  } catch (error) {
    res.status(404).redirect('/');
  }
};

module.exports = view;
