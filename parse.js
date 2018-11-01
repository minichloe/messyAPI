// Helper functions for parsing data

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
const convertCurrency = {
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
  const nums = str.map(x => convertToNumber(x));

  // If budget was a range take the average
  const budget = getAverage(nums);
  // Add the budget after converting to dollars
  budgets.push(budget * convertCurrency[currency]);

  // Add commas and currency sign back to numbers
  const strNums = nums.map(x => {
    const str = x.toString();
    return addCommasAndCurrencySign(str, currency);
  });
  return strNums.join(' - ');
};

const convertToNumber = str => {
  str = str
    // Remove brackets and everything in them
    .replace(/[\[\(\{].+[\)\}\]]/g, '')
    // Remove everything not a digit and not a fullstop
    .replace(/[^\d\.]/g, '');

  // Convert to number
  const num = Number(str);
  // Assume everything in the thousands range is written in numerical format
  if (num < 999) return num * 1000000;
  else return num;
};

const addCommasAndCurrencySign = (str, currency = '$') => {
  let strWithCommas = '';
  for (let i = str.length - 1, count = 1; i >= 0; i--) {
    strWithCommas = str[i] + strWithCommas;
    if (count === 3 && i !== 0) strWithCommas = ',' + strWithCommas;
    count === 3 ? (count = 1) : count++;
  }
  return currency + strWithCommas;
};

const getAverage = arr => {
  const length = arr.length;
  if (length === 1) return arr[0];
  else return arr.reduce((a, b) => a + b, 0) / length;
};

module.exports = {
  addCommasAndCurrencySign,
  convertYear,
  convertBudget,
  convertTitle,
  getAverage,
};
