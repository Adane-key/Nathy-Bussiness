const express = require('express');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../utils/db');

router.get('/', (req, res) => {
  const categories = db.getCategories();
  res.render('home', { categories, activeNav: 'home' });
});

router.get('/lang/:code', (req, res) => {
  const code = req.params.code;
  if (code === 'en' || code === 'am') {
    req.session.lang = code;
  }
  const back = req.get('Referer') || '/';
  res.redirect(back);
});

router.get('/:category', (req, res, next) => {
  const { category } = req.params;
  if (!db.isValidCategory(category)) return next();

  const categoryDef = db.getCategory(category);
  const locations = db.getLocations();
  let listings = db.getListings(category);

  const { location, type } = req.query;
  if (location) {
    listings = listings.filter((l) => l.locationId === location);
  }
  if (type) {
    listings = listings.filter((l) => l.type === type);
  }

  listings = listings.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.render('category', {
    categoryDef,
    listings,
    locations,
    selectedLocation: location || '',
    selectedType: type || '',
    activeNav: category,
  });
});

router.get('/:category/:id', (req, res, next) => {
  const { category, id } = req.params;
  if (!db.isValidCategory(category)) return next();

  const listing = db.getListing(category, id);
  if (!listing) return next();

  const categoryDef = db.getCategory(category);
  const location = db.getLocation(listing.locationId);

  res.render('listing', { listing, categoryDef, location, activeNav: category });
});

router.post('/:category/:id/book', (req, res, next) => {
  const { category, id } = req.params;
  if (!db.isValidCategory(category)) return next();

  const listing = db.getListing(category, id);
  if (!listing) return next();

  const { customerName, customerPhone, message } = req.body;
  if (!customerName || !customerPhone) {
    return res.redirect(`/${category}/${id}`);
  }

  const bookings = db.getBookings();
  const booking = {
    id: uuidv4(),
    listingId: listing.id,
    category,
    listingTitleEn: listing.titleEn,
    listingTitleAm: listing.titleAm,
    customerName,
    customerPhone,
    message: message || '',
    status: 'pending',
    createdAt: new Date().toISOString(),
  };
  bookings.push(booking);
  db.saveBookings(bookings);

  res.render('booking-success', { booking, activeNav: category });
});

module.exports = router;
