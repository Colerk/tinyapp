const randomstring = require("randomstring");


function generateRandomString() {
  let randomstr = randomstring.generate(6)
  return randomstr;
}

const exists = function(obj, val1, val2) {
  for (let key in obj) {
    if (obj[key][val1] === val2) {
      return obj[key];
    }
  }
}

module.exports = { generateRandomString, exists }