const autoprefixer = require("autoprefixer");
const postcssRTLCSS = require("postcss-rtlcss");

module.exports = {
  plugins: [postcssRTLCSS(), autoprefixer(), { "@tailwindcss/postcss": {} }],
};
