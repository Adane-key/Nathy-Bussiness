const en = require('../locales/en.json');
const am = require('../locales/am.json');

const dictionaries = { en, am };

function get(obj, keyPath) {
  return keyPath.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
}

function middleware(req, res, next) {
  const queryLang = req.query.lang;
  if (queryLang === 'en' || queryLang === 'am') {
    req.session.lang = queryLang;
  }
  const lang = req.session.lang === 'am' ? 'am' : 'en';
  const dict = dictionaries[lang];

  req.lang = lang;
  res.locals.lang = lang;
  res.locals.t = function (keyPath) {
    const value = get(dict, keyPath);
    if (value === null) return get(dictionaries.en, keyPath) || keyPath;
    return value;
  };
  next();
}

module.exports = { middleware };
