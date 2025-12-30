"use strict";

//const { MongoClientBulkWriteCursorError } = require("mongodb");

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputTemp = document.querySelector(".form__input--temp");
const inputClimb = document.querySelector(".form__input--climb");

class App {

    #map;
    #mapEvent;

    constructor() {
        this._getPosition();

        form.addEventListener("submit", this._newWorkout.bind(this));

        inputType.addEventListener("change", this._toggleClimbField);
    };

    _getPosition() {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                this._loadMap.bind(this),
                function () {
                    alert(`Невозможно получить ваше местоположение`);
                }
            );
        };
    };

    _loadMap(position) {
        const { latitude } = position.coords;
        const { longitude } = position.coords;
        console.log(`https://www.google.com/maps/@${latitude},${longitude}`);

        const coords = [latitude, longitude];

        this.#map = L.map('map').setView(coords, 14);

        console.log(L)

        L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        }).addTo(this.#map);

        this.#map.on('click', this._showForm.bind(this));

    };

    _showForm(e) {
        this.#mapEvent = e;
        this.#mapEvent = e;
        form.classList.remove('hidden');
        inputDistance.focus();
    }

    _toggleClimbField() {
        inputClimb.closest(".form__row").classList.toggle("form__row--hidden");
        inputTemp.closest(".form__row").classList.toggle("form__row--hidden");
    };

    _newWorkout(e) {
        e.preventDefault();

        //очистка полей ввода данных
        inputDistance.value =
            inputDuration.value =
            inputTemp.value =
            inputClimb.value = "";

        //отображение маркера
        const { lat, lng } = this.#mapEvent.latlng;

        L.marker([lat, lng]).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 200,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: 'running-popup'
            }))
            .openPopup().setPopupContent("Треня");
    }
}

const app = new App();

