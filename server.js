require('dotenv').config();
const express = require('express');
const session = require('express-session');
const path = require('path');

const i18n = require('./utils/i18n');
const { categoryIcon } = require('./utils/icons');
const publicRoutes = require('./routes/public');
const adminRoutes = require('./routes/admin');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(
  session({
    secret: process.env.SESSION_SECRET || 'hossana-market-dev-secret',
    resave: false,
    saveUninitialized: true,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 7, // 1 week
    },
  })
);

app.use(i18n.middleware);
app.use((req, res, next) => {
  res.locals.categoryIcon = categoryIcon;
  next();
});

app.locals.siteName = process.env.SITE_NAME || 'Hossana Market';

app.use('/admin', adminRoutes);
app.use('/', publicRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).render('404', { activeNav: '' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Something went wrong. Please try again.');
});

app.listen(PORT, () => {
  console.log(`Hossana Market running on port ${PORT}`);
});
