# Oscars YipitData

Node.js application to retrieve oscars data from YipiData API.

## Assumptions

1. Data collected is used for presenting on a website much like Wikipedia (looping and presenting each year-title-budget combination)
2. All brackets and parentheses were useless information. (The oscar number can be obtained by getting the array index + 1)
3. Budgets without any currency sign defaulted to $
4. The entire dataset is needed so I opted for efficiency in obtaining all the data and order, over parsing the results one by one and printing them.

## Approach

1. Looping through the results to get the films in each year
2. Looping through the array of films each year to get the winning film
3. Putting helper functions in a separate file `parse.js` for cleaner code
   - I initially wanted to write a more general function to parse both the year and the title but chose to use two separate functions over submitting multiple arguments and multiple if/else statements
   - I chose to cause a side effect for converting the budget (pushing the budget into an allBudgets array) so I wouldn't have to parse the string twice
   - Instead of parsing the budget twice for calculating the average and for printing, I chose to remove all commas and add them back later for easier calculation
4. Creating a new object and array to store parsed data
5. Saving all the details urls and using Promise.all to perform all GET requests simultaneously. This is so the results will be printed in order and the average budget would not be calculated until all films budgets are submitted.
6. I chose to not submit a film's budget for the average budget if there was no budget key in its details url, as there wasn't enough time to parse each missing budget's Wikipedia page.
7. I decided to present the results in an array with key value pairs for year-title-budget instead of using the year or title as a key. Ultimately this depends on how the data will be used but conventionally I assume the data will be printed on a website instead of used for quick look up.
8. I decided to export the resulting data as a json file for any future use.

## Prerequisites

1. NPM is installed. If using yarn, change the command in package.json to `"start": "yarn index.js"`


## Set up and run

1. `npm i` or `yarn install`.
2. `npm run start`
3. See results.json.
