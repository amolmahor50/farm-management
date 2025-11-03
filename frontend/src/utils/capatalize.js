//  Capitalize helper
export const capitalize = (str = "") =>
  str.length ? str.charAt(0).toUpperCase() + str.slice(1).toLowerCase() : str;
