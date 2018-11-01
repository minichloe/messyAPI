const axios = require('axios');
const { convertYear, convertBudget, convertTitle } = require('./parse');

// General function for http GET request
const getData = url =>
  new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(result => resolve(result.data))
      .catch(err => reject(err));
  });

const sortAndPrintData = async () => {
  try {
    // Get array of films
    const { results } = await getData(`http://oscars.yipitdata.com`);

    // Initialize array for detail URLs
    const detailURLs = [];

    // Initialize array for compiled results
    const newResults = [];

    results.forEach(x => {
      // Initialize empty object to save wanted data from films
      const oscarWinningFilm = {};

      // Filter and set film to single winning film
      const film = x.films.filter(film => film.Winner)[0];

      // Set film year, title
      oscarWinningFilm.Year = convertYear(x.year);
      oscarWinningFilm.Title = convertTitle(film.Film);
      newResults.push(oscarWinningFilm);

      // Add details URL to array to get budget
      detailURLs.push(getData(film['Detail URL']));
    });

    // Get all the details from detailsURL API
    const budgets = await Promise.all(detailURLs);
    const allBudgets = [];

    // Map through the budgets
    budgets.forEach((film, idx) => {
      // Convert budget into numerical format
      const budget = film.hasOwnProperty('Budget') ? convertBudget(film.Budget, allBudgets) : null;
      // Add them to results by matching the correct entry with the index
      newResults[idx].Budget = budget || 'No data';
    });

    console.log(newResults);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
// convertBudget(`$12-15 million`);
