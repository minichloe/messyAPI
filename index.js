const axios = require('axios');
const fs = require('fs');
const { addCommasAndCurrencySign, convertYear, convertBudget, convertTitle, getAverage } = require('./parse');

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
    console.log('Getting and parsing data...\n');

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

    // Get average
    const average = getAverage(allBudgets);
    // Convert to string with two decimal places
    const averageStr = average.toFixed(2);
    // Add commas and currency sign
    const convertedAverage = addCommasAndCurrencySign(averageStr);
    const finalResults = {
      Films: newResults,
      Average_Budget: convertedAverage,
    };

    console.log('Data parsed! See below:\n');
    console.log(newResults);
    console.log(`Average Budget: ${convertedAverage}\n`);

    // Create a new json file with parsed data
    generateOutput(JSON.stringify(finalResults));
  } catch (err) {
    console.log(err);
  }
};

const generateOutput = data => {
  console.log(`Generating output file ...`);
  const writeStream = fs.createWriteStream('results.json');
  writeStream.write(data, 'utf8');
  writeStream.on('finish', () => {
    console.log('Success. See results.json.');
  });
  writeStream.end();
};

sortAndPrintData();
