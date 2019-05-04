// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');

const view = async (req, res) => {
  try {
    const { id, type } = req.params;

    if ((type !== 'tv' && type !== 'movie') || id.trim() === '') {
      throw new Error('Search error');
    }

    const link = viewHelpers.getLink(id, type);

    const request = viewHelpers.mapRequests(link);

    const result = await request;

    const data = viewHelpers.getData(result);

    const mappedData = viewHelpers.mapData([data], type)[0];

    // res.send(mappedData);
    res.render('media/media', { media: mappedData, type });
  } catch (error) {
    res.status(404).redirect('/');
  }
};

module.exports = view;
