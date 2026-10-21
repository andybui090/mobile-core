export const filterBadWords = (inputString: string, badWordsArray: string[]) => {
  badWordsArray.forEach(badWord => {
    const regex = new RegExp(badWord.trim(), 'gi');
    inputString = inputString.replace(regex, '*'.repeat(badWord.length));
  });
  return inputString;
};
