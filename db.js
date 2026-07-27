const fs = require('fs');
const path = require('path');

const DATA_DIR = path.join(__dirname, '..', 'data');

function filePath(name) {
  return path.join(DATA_DIR, `${name}.json`);
}

function readData(name) {
  try {
    const raw = fs.readFileSync(filePath(name), 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return [];
  }
}

function writeData(name, data) {
  fs.writeFileSync(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
}

const CATEGORY_IDS = ['land', 'house', 'car', 'sound', 'decoration'];

function isValidCategory(id) {
  return CATEGORY_IDS.includes(id);
}

function getCategories() {
  return readData('categories');
}

function getCategory(id) {
  return getCategories().find((c) => c.id === id);
}

function getLocations() {
  return readData('locations');
}

function getLocation(id) {
  return getLocations().find((l) => l.id === id);
}

function getListings(category) {
  if (!isValidCategory(category)) return [];
  return readData(category);
}

function getListing(category, id) {
  return getListings(category).find((l) => l.id === id);
}

function saveListings(category, listings) {
  if (!isValidCategory(category)) return;
  writeData(category, listings);
}

function getBookings() {
  return readData('bookings');
}

function saveBookings(bookings) {
  writeData('bookings', bookings);
}

module.exports = {
  CATEGORY_IDS,
  isValidCategory,
  getCategories,
  getCategory,
  getLocations,
  getLocation,
  getListings,
  getListing,
  saveListings,
  getBookings,
  saveBookings,
  readData,
  writeData,
};
