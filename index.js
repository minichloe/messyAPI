const axios = require('axios');

// General function for http GET request
const getData = async url => {
  const { data } = await axios.get(url);
  return data;
};

const sortAndPrintData = async () => {
  const { results } = await getData(`http://oscars.yipitdata.com`);
  console.log(results);
};

sortAndPrintData();
