const axios = require('axios');

// Helper object for checking if brackets exist in string
const brackets = {
  '{': '}',
  '[': ']',
  '(': ')',
};

// General function for http GET request
const getData = url => axios.get(url);

// Function to remove unwanted data from strings
const convertData = (str, type = 'title') => {
  // Remove extra whitespace
  str = str.replace(/\s+/g, ' ');

  // Split string into array separated by spaces
  const arr = str.split(' ');

  // Filter out parts that start with brackets
  arr = arr.filter(str => !brackets.hasOwnProperty(str[0]));

  // Convert back to string depending on data
  const delimiter = type === 'title' ? ' ' : '';
  return arr.join(delimiter);
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
      oscarWinningFilm.Year = convertData(x.year, 'year');
      oscarWinningFilm.Title = convertData(film.Film);
      newResults.push(oscarWinningFilm);

      //
    });

    console.log(newResults);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
