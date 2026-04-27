const RTL_LANGUAGES = ['he', 'ar'];

export function getDirection(language) {
  return RTL_LANGUAGES.includes(language) ? 'rtl' : 'ltr';
}
