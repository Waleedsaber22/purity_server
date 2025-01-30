const defaultConfig = require("./default");
const env = process.env.NODE_ENV; // Default to 'development'

let envConfig = {};
try {
  if (env) envConfig = require(`./${env}`);
} catch (error) {
  console.warn(`No specific config found for NODE_ENV=${env}, using default.`);
}

module.exports = { ...defaultConfig, ...envConfig };
