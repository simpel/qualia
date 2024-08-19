export const parseDictionary = (
  input: string,
  dictionary: { [key: string]: string },
): string => {
  let output = input;

  for (const key in dictionary) {
    if (dictionary.hasOwnProperty(key)) {
      const value = dictionary[key];
      const regex = new RegExp(`{{${key}}}`, 'g');
      if (value) output = output.replace(regex, value);
    }
  }

  return output;
};
