// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');

const view = async (req, res) => {
  try {
    const { id, type } = req.query;

    const link = viewHelpers.getLink(id, type);

    const request = viewHelpers.mapRequests(link);

    const result = await request;

    const data = viewHelpers.getData(result);

    const mappedData = viewHelpers.mapData([data])[0];

    res.send(mappedData);
  } catch (error) {
    res.send(error);
  }
};

module.exports = view;
