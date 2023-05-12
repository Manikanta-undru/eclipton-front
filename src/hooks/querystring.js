export const queryParse = (string) => {
  string = string.replace('?', '');
  const array = string.split('&');
  const result = {};
  for (let i = 0; i < array.length; i++) {
    const keyval = array[i].split('=');
    result[keyval[0]] = keyval[1];
  }
  return result;
};
