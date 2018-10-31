const axios = require('axios');

// General function for http GET request
const getData = url => axios.get(url);

// Function to remove unwanted data from year string
const convertYear = str => {
  str = str

    // Remove all whitespace
    .replace(/\s/g, '')

    // Remove brackets and all characters inside them
    .replace(/[\[\(\{].+[\)\}\]]/g, '');

  return str;
};

// Function to remove unwanted data from title string
convertTitle = str => {
  str = str

    // Remove extra whitespace
    .replace(/\s+/g, ' ')

    // Remove brackets and all characters up to length 4 inside them
    .replace(/[\[\(\{].{1,4}[\)\}\]]/g, '')

    // Remove start and trailing spaces
    .trim();

  return str;
};

// Function to get budget and change to number format
const getBudget = async url => {};

const sortAndPrintData = async () => {
  try {
    // Get array of films
    const { data } = await getData(`http://oscars.yipitdata.com`);
    const results = data.results;

    // Initialize array for detail URLs
    const detailURLs = [];

    // Initialize array for compiled results
    const newResults = [];

    results.forEach(x => {
      // Initialize empty object to save wanted data from films
      const oscarWinningFilm = {};
      const film = x.films.filter(film => film.Winner)[0];
      // Set film year, title, and budget
      oscarWinningFilm.Year = convertYear(x.year);
      oscarWinningFilm.Title = convertTitle(film.Film);
      newResults.push(oscarWinningFilm);

      //
    });

    console.log(newResults);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
