//puzzle.mead.io.puzzle

const weatherForm = document.querySelector('form');
const searchName = document.querySelector('input');
const forecast = document.querySelector('.forecast');

weatherForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const location = searchName.value;
    forecast.classList.add('padded');
    forecast.innerHTML = '<p>Loading...</p>';

    fetch(`/weather?address=${location}`).then((response) => {
        response.json().then((data) => {
            if (data.error) {
                forecast.innerHTML = `<p>${data.error}</p>`;
            } else {
                forecast.innerHTML = `<p>${data.location}</p><p>${data.forecast}</p>`;
            }
        });
    });
});
