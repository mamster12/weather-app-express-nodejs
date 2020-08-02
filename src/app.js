const express = require('express');
const app = express();
const path = require('path');
const hbs = require('hbs');

//utils for API requests
const geocode = require('./utils/geocode');
const weatherForecast = require('./utils/weatherForecast');

// define paths for Express config
const publicDirectoryPath = path.join(__dirname, '../public');
const viewsPath = path.join(__dirname, '../templates/views');
const partiaslPath = path.join(__dirname, '../templates/partials');

// tell express to setup handlebars engine
app.set('view engine', 'hbs');

//point express to custome views directory
app.set('views', viewsPath);

//hbs partials setup
hbs.registerPartials(partiaslPath);

// set up static directory to serve
app.use(express.static(publicDirectoryPath));

app.get('', (req, res) => {
    res.render('index', {
        title: 'Weather',
        name: 'Mac Villegas',
    });
});

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About',
        name: 'Mac Villegas',
        description:
            'Simple weather forecast web app that uses Mapbox API for Geolocation and Climacell API for Weather Forecast.',
    });
});

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You must provide a search term',
        });
    }
    console.log(req.query.search);
    res.send({
        products: [],
    });
});
app.get('/help', (req, res) => {
    res.render('help', {
        title: 'Help',
        text: 'send email to mcvilleanrapsody@gmail.com for HELP.',
        name: 'Mac Villegas',
    });
});

app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You must provide an address',
        });
    }
    // Query to Geocode and Weather API
    geocode(req.query.address, (error, data) => {
        if (error) {
            return res.send({
                error,
            });
        } else {
            const { latitude, longitude, location } = data;
            weatherForecast(latitude, longitude, (error, forecastData) => {
                if (error) {
                    return res.send({
                        error,
                    });
                }
                res.send({
                    location,
                    forecast: forecastData,
                    address: req.query.address,
                });
            });
        }
    });
});

app.get('/help/*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Mac villegas',
        text: 'Help Article not found.',
    });
});

app.get('*', (req, res) => {
    res.render('error', {
        title: '404',
        name: 'Mac villegas',
        text: 'Page not found.',
    });
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Server is listening on port ${port}`);
});
