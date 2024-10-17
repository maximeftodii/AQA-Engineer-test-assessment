require('dotenv').config();

module.exports = {
  use: {
    testDir: './src/Tests',
    baseURL: process.env.BASE_URL,
    headless: true,
  },
};
