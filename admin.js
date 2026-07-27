const express = require('express');
const bcrypt = require('bcryptjs');
const { v4: uuidv4 } = require('uuid');
const router = express.Router();
const db = require('../utils/db');
const { requireAdmin } = require('../middleware/auth');

// Hash the admin password once at startup from the env var.
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD_HASH = bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'admin123', 10);

router.get('/login', (req, res) => {
  if (req.session.isAdmin) return res.redirect('/admin');
  res.render('admin/login', { error: null, activeNav: 'admin' });
});

router.post('/login', (req, res) => {
  const { username, password } = req.body;
  const validUsername = username === ADMIN_USERNAME;
  const validPassword = bcrypt.compareSync(password || '', ADMIN_PASSWORD_HASH);

  if (validUsername && validPassword) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'invalid', activeNav: 'admin' });
});

router.post('/logout', (req, res) => {
  req.session.isAdmin = false;
  res.redirect('/admin/login');
});

router.use(requireAdmin);

router.get('/', (req, res) => {
  const bookings = db.getBookings();
  const categories = db.getCategories();
  const totalListings = categories.reduce((sum, c) => sum + db.getListings(c.id).length, 0);

  const stats = {
    totalBookings: bookings.length,
    pending: bookings.filter((b) => b.status === 'pending').length,
    confirmed: bookings.filter((b) => b.status === 'confirmed').length,
    totalListings,
  };

  const recentBookings = bookings
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 5);

  res.render('admin/dashboard', { stats, recentBookings, activeNav: 'admin' });
});

// ---- Bookings ----
router.get('/bookings', (req, res) => {
  const bookings = db
    .getBookings()
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  res.render('admin/bookings', { bookings, activeNav: 'admin' });
});

router.post('/bookings/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  const bookings = db.getBookings();
  const booking = bookings.find((b) => b.id === id);
  if (booking && ['pending', 'confirmed', 'rejected'].includes(status)) {
    booking.status = status;
    db.saveBookings(bookings);
  }
  res.redirect('/admin/bookings');
});

// ---- Listings ----
router.get('/listings/:category', (req, res, next) => {
  const { category } = req.params;
  if (!db.isValidCategory(category)) return next();
  const categoryDef = db.getCategory(category);
  const listings = db
    .getListings(category)
    .slice()
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const locations = db.getLocations();
  res.render('admin/listings', { categoryDef, listings, locations, activeNav: 'admin' });
});

router.get('/listings/:category/new', (req, res, next) => {
  const { category } = req.params;
  if (!db.isValidCategory(category)) return next();
  const categoryDef = db.getCategory(category);
  const locations = db.getLocations();
  res.render('admin/listing-form', {
    categoryDef,
    locations,
    listing: null,
    activeNav: 'admin',
  });
});

router.post('/listings/:category/new', (req, res, next) => {
  const { category } = req.params;
  if (!db.isValidCategory(category)) return next();

  const listings = db.getListings(category);
  const newListing = {
    id: `${category}-${uuidv4().slice(0, 8)}`,
    category,
    type: req.body.type,
    titleEn: req.body.titleEn,
    titleAm: req.body.titleAm,
    descEn: req.body.descEn,
    descAm: req.body.descAm,
    price: Number(req.body.price) || 0,
    currency: 'ETB',
    priceUnit: req.body.priceUnit,
    locationId: req.body.locationId,
    contactPhone: req.body.contactPhone,
    status: req.body.status || 'available',
    createdAt: new Date().toISOString(),
  };
  listings.push(newListing);
  db.saveListings(category, listings);
  res.redirect(`/admin/listings/${category}`);
});

router.get('/listings/:category/:id/edit', (req, res, next) => {
  const { category, id } = req.params;
  if (!db.isValidCategory(category)) return next();
  const listing = db.getListing(category, id);
  if (!listing) return next();
  const categoryDef = db.getCategory(category);
  const locations = db.getLocations();
  res.render('admin/listing-form', { categoryDef, locations, listing, activeNav: 'admin' });
});

router.post('/listings/:category/:id/edit', (req, res, next) => {
  const { category, id } = req.params;
  if (!db.isValidCategory(category)) return next();

  const listings = db.getListings(category);
  const listing = listings.find((l) => l.id === id);
  if (!listing) return next();

  listing.type = req.body.type;
  listing.titleEn = req.body.titleEn;
  listing.titleAm = req.body.titleAm;
  listing.descEn = req.body.descEn;
  listing.descAm = req.body.descAm;
  listing.price = Number(req.body.price) || 0;
  listing.priceUnit = req.body.priceUnit;
  listing.locationId = req.body.locationId;
  listing.contactPhone = req.body.contactPhone;
  listing.status = req.body.status || 'available';

  db.saveListings(category, listings);
  res.redirect(`/admin/listings/${category}`);
});

router.post('/listings/:category/:id/delete', (req, res, next) => {
  const { category, id } = req.params;
  if (!db.isValidCategory(category)) return next();

  let listings = db.getListings(category);
  listings = listings.filter((l) => l.id !== id);
  db.saveListings(category, listings);
  res.redirect(`/admin/listings/${category}`);
});

// ---- Locations ----
router.get('/locations', (req, res) => {
  const locations = db.getLocations();
  res.render('admin/locations', { locations, activeNav: 'admin' });
});

router.post('/locations/add', (req, res) => {
  const locations = db.getLocations();
  const { nameEn, nameAm } = req.body;
  if (nameEn && nameAm) {
    locations.push({ id: `loc-${uuidv4().slice(0, 8)}`, nameEn, nameAm });
    db.writeData('locations', locations);
  }
  res.redirect('/admin/locations');
});

router.post('/locations/:id/edit', (req, res) => {
  const { id } = req.params;
  const locations = db.getLocations();
  const location = locations.find((l) => l.id === id);
  if (location) {
    location.nameEn = req.body.nameEn;
    location.nameAm = req.body.nameAm;
    db.writeData('locations', locations);
  }
  res.redirect('/admin/locations');
});

router.post('/locations/:id/delete', (req, res) => {
  const { id } = req.params;
  let locations = db.getLocations();
  locations = locations.filter((l) => l.id !== id);
  db.writeData('locations', locations);
  res.redirect('/admin/locations');
});

module.exports = router;
