const searchHelper = require('./helpers/searchHelpers');

const search = async (req, res) => {
  try {
    const { title } = req.query;
    const { type } = req.query;

    if ((type !== 'tv' && type !== 'movie') || title.trim() === '') {
      return res.status(400).send('Error search');
    }

    // Get media array
    const mediaArray = await searchHelper.getMediaArray(req.query);

    // Get all titles
    const titles = searchHelper.getTitles(mediaArray, type);

    const links = searchHelper.getLinks(titles);

    if (links.length === 0) {
      return res.status(404).send();
    }

    const requests = searchHelper.mapRequests(links);

    const results = await Promise.all(requests);

    const data = searchHelper.getData(results);

    const filteredData = searchHelper.filterData(data);

    const mappedData = searchHelper.mapData(filteredData);

    return res.send(mappedData);
  } catch (error) {
    return res.send(error);
  }
};

module.exports = search;
