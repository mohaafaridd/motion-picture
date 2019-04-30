const axios = require('axios');
const { mapData } = require('./helpers/searchHelpers');

const view = async (req, res) => {
  try {
    const { title } = req.query;
    const link = `http://www.omdbapi.com/?apikey=${process.env.OMDB_API_KEY}&t=${encodeURIComponent(title)}`;
    let request = await axios.get(link);
    request = [request.data];
    const response = mapData(request);
    res.send(response);
  } catch (error) {
    res.send(error);
  }
};

module.exports = view;
