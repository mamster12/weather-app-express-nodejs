const request = require('request');

const geocode = (address, callback) => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
    )}.json?access_token=pk.eyJ1IjoibWFtc3RlcjEyIiwiYSI6ImNrZDhrd2pjYTAyYmoydXBneHZhanV5N3AifQ.f5XXpI82IZHz8tCs9SZ8OQ&limit=1`;

    request({ url, json: true }, (error, response) => {
        if (error) {
            callback('Unable to connect to location services!');
        } else if (response.statusCode !== 200) {
            callback(response.body.message);
        } else if (response.body.features.length === 0) {
            callback('Unable to find location, Try another search.');
        } else {
            const { center, place_name } = response.body.features[0];
            callback(error, {
                latitude: center[1],
                longitude: center[0],
                location: place_name,
            });
        }
    });
};

module.exports = geocode;
