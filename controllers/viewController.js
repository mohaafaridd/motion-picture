// const axios = require('axios');
const viewHelpers = require('./helpers/viewHelpers');

const view = async (req, res) => {
  try {
    const { id } = req.query;

    const link = viewHelpers.getLink(id);

    const request = viewHelpers.mapRequests(link);

    const result = await request;

    const data = viewHelpers.getData(result);

    const mappedData = viewHelpers.mapData([data]);

    // Get all titles
    // const Ids = searchHelper.getIds(mediaArray);

    // const links = searchHelper.getLinks(titles);

    // if (links.length === 0) {
    //   return res.status(404).send();
    // }

    // const requests = searchHelper.mapRequests(links);

    // const results = await Promise.all(requests);

    // const data = searchHelper.getData(results);

    // const filteredData = searchHelper.filterData(data);

    // const mappedData = searchHelper.mapData(filteredData);
    res.send(mappedData);
  } catch (error) {
    res.send(error);
  }
};

module.exports = view;
