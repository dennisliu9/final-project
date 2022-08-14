function randomChar(chars) {
  return chars[Math.floor(Math.random() * chars.length)];
}

function pseudoWord(minLen, maxLen) {
  // not inclusive of maxLen
  let outStr = '';
  const consonants = 'bcdfghjklmnpqrstvwxyz'.split('');
  const vowels = 'aeiou'.split('');

  const len = Math.floor(Math.random() * (maxLen - minLen)) + minLen;

  for (let i = 0; i < len; i++) {
    outStr += randomChar((i % 2 === 0) ? consonants : vowels);
  }
  outStr = outStr[0].toUpperCase() + outStr.substring(1);
  return outStr;
}

function urlGenerator(numOfWords, minLen, maxLen) {
  const outArr = [];
  for (let i = 0; i < numOfWords; i++) {
    outArr.push(pseudoWord(minLen, maxLen));
  }
  return outArr.join('-');
}

module.exports = urlGenerator;
