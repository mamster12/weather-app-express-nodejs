const request = require('request');

const dailyForecast = (lat, lon, callback) => {
    const daily = {
        method: 'GET',
        url: 'https://api.climacell.co/v3/weather/forecast/daily',
        qs: {
            lat,
            lon,
            unit_system: 'si',
            start_time: 'now',
            fields: 'precipitation_probability',
            apikey: 'KEalvgH9ipDbQvxaKSovfT1zoNQ3xogB',
        },
        json: true,
    };

    request(daily, (error, { statusCode }, body) => {
        if (error) {
            callback(
                'Unable to connect to the weather services server. Please check your internet.'
            );
        } else if (statusCode !== 200) {
            callback(body.message);
        } else {
            callback(error, {
                precip: body[0].precipitation_probability.value,
            });
        }
    });
};

const weatherForecast = (lat, lon, callback) => {
    const realtime = {
        method: 'GET',
        url: 'https://api.climacell.co/v3/weather/realtime',
        qs: {
            lat,
            lon,
            unit_system: 'si',
            fields:
                'precipitation,precipitation_type,temp,feels_like,dewpoint,wind_speed,wind_gust,baro_pressure,visibility,humidity,wind_direction,sunrise,sunset,cloud_cover,cloud_ceiling,cloud_base,surface_shortwave_radiation,moon_phase,weather_code',
            apikey: 'KEalvgH9ipDbQvxaKSovfT1zoNQ3xogB',
        },
        json: true,
    };

    request(
        realtime,
        (error, { statusCode }, { message, weather_code, temp }) => {
            if (error) {
                callback(
                    'Unable to connect to the weather services server. Please check your internet.'
                );
            } else if (statusCode !== 200) {
                callback(message);
            } else {
                dailyForecast(lat, lon, (error, data) => {
                    const data_precip = error
                        ? '(--SERVER ERROR!--)'
                        : data.precip;

                    callback(
                        error,
                        `${weather_code.value.replace(
                            '_',
                            ', '
                        )}. It is currently ${
                            temp.value
                        } degrees out. There is a ${data_precip} % chance of rain today.`
                    );
                });
            }
        }
    );
};

module.exports = weatherForecast;
