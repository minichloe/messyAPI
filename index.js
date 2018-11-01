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
const convertTitle = str => {
  str = str

    // Remove extra whitespace
    .replace(/\s+/g, ' ')

    // Remove brackets and all characters up to length 4 inside them
    .replace(/[\[\(\{].{1,4}[\)\}\]]/g, '')

    // Remove start and trailing spaces
    .trim();

  return str;
};

// Currency converter object
const convert = {
  '£': 1.28,
  $: 1,
  '€': 1.13,
};

// Function to get budget and change to number format
const convertBudget = (str, budgets) => {
  // Get currency symbols
  const currency = str.match(/[$£€]/g)[0] || '$';

  // Check if there are multiple numbers and convert str into array to avoid duplicate code
  str = str.indexOf('-') > -1 ? str.split('-') : [str];

  // Convert all strs into numbers
  const nums = str.map(x => {
    // Remove everything not a digit and not a fullstop
    const num = Number(x.replace(/[^\d\.]/g, ''));
    if (num < 1000000) return num * 1000000;
    else return num;
  });

  // If budget was a range take the average
  const budget = nums.length === 1 ? nums[0] : (nums[0] + nums[1]) / 2;
  // Add the budget after converting to dollars
  budgets.push(budget * convert[currency]);

  const strNums = nums.map(x => {
    const str = x.toString();
    let strWithCommas = '';
    for (let i = str.length - 1, count = 1; i >= 0; i--) {
      strWithCommas = str[i] + strWithCommas;
      if (count === 3 && i < str.length - 1) strWithCommas = ',' + strWithCommas;
      count === 3 ? (count = 1) : count++;
    }
    return currency + strWithCommas;
  });
  console.log(strNums.join(' - '));
  return strNums.join(' - ');
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
      // const budget = convertBudget(film.Budget);
      const budget = film.hasOwnProperty('Budget') ? convertBudget(film.Budget, allBudgets) : null;
      // Add them to results by matching the correct entry with the index
      newResults[idx].Budget = budget || 'No data';
    });

    console.log(allBudgets);
  } catch (err) {
    console.log(err);
  }
};

sortAndPrintData();
// convertBudget(`$12-15 million`);
