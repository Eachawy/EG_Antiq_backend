const autoprefixer = require("autoprefixer");
const postcssRTLCSS = require("postcss-rtlcss");
const tailwindcss = require("@tailwindcss/postcss");

module.exports = {
  plugins: [postcssRTLCSS(), autoprefixer(), tailwindcss()],
};
