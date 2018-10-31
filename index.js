const axios = require('axios');

// General function for http GET request
const getData = url =>
  new Promise((resolve, reject) => {
    axios
      .get(url)
      .then(result => resolve(result.data))
      .catch(err => reject(err));
  });

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

    const budgets = await Promise.all(detailURLs);
    budgets.map((film, idx) => {
      const budget = film.Budget;
      newResults[idx].Budget = budget;
      return budget;
    });

    console.log(newResults);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
