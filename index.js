const axios = require('axios');

// General function for http GET request
const getData = async url => {
  try {
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    console.log(err);
  }
};

const sortAndPrintData = async () => {
  try {
    // Get array of films
    const { results } = await getData(`http://oscars.yipitdata.com`);

    // Initialize array for detail URLs
    const detailURLs = [];

    // Initialize array for compiled results
    const newResults = [];

    results.forEach(x => {
      const film = x.films.filter(film => film.Winner);
      newResults.push(film);
    });

    console.log(newResults);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
