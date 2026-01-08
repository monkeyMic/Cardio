"use strict";

//const { MongoClientBulkWriteCursorError } = require("mongodb");

const form = document.querySelector(".form");
const containerWorkouts = document.querySelector(".workouts");
const inputType = document.querySelector(".form__input--type");
const inputDistance = document.querySelector(".form__input--distance");
const inputDuration = document.querySelector(".form__input--duration");
const inputTemp = document.querySelector(".form__input--temp");
const inputClimb = document.querySelector(".form__input--climb");

class Workout {

    date = new Date();
    id = (Date.now() + "").slice(-10);

    constructor(coords, distance, duration) {
        this.coords = coords;
        this.distance = distance; //km
        this.duration = duration; //min
    }
}

class Running extends Workout {

    type = 'running';

    constructor(coords, distance, duration, temp) {
        super(coords, distance, duration);
        this.temp = temp;
        this.calculatePace();
    }

    calculatePace() {
        this.pace = this.duration / this.distance;
    }
}

class Cycling extends Workout {

    type = 'cycling';

    constructor(coords, distance, duration, climb) {
        super(coords, distance, duration);
        this.climb = climb;
        this.calculateSpeed();
    }

    calculateSpeed() {
        this.speed = this.distance / this.duration / 60;
    }
}

const running = new Running([60, 37], 7, 30, 25);
const cycling = new Cycling([50, 65], 18, 33, 25);
console.log(running, cycling);

class App {

    #map;
    #mapEvent;
    #workouts = [];

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

        const areNumbers = (...numbers) => {
            return numbers.every(num => Number.isFinite(num));
        }

        const areNumbersPositive = (...numbers) => {
            return numbers.every(num => num > 0);
        }



        e.preventDefault();

        const { lat, lng } = this.#mapEvent.latlng;
        let workout;

        //получить данные из формы

        const type = inputType.value;
        const distance = Number(inputDistance.value);
        const duration = Number(inputDuration.value);

        //если тренировка является пробежкой, то создать объект Running

        if (type === "running") {
            const temp = +inputTemp.value;
            //проверить, являются ли данные валидными
            if (!areNumbers(distance, duration, temp) || !areNumbersPositive(distance, duration, temp)) {
                return console.log("Enter the valid value!");
            }

            workout = new Running([lat, lng], distance, duration, temp);
            console.log(workout);

        }

        //елси тренировка является велотренировкой, то создать объект Cycling

        if (type === 'cycling') {
            const climb = +inputClimb.value;
            //проверить, являются ли данные валидными
            if (!areNumbers(distance, duration, climb) || !areNumbersPositive(distance, duration)) {
                return alert("Введите положительное число");
            }

            workout = new Cycling([lat, lng], distance, duration, climb);
            console.log(workout);

        }

        //добавить новый объект в массив тренировок
        this.#workouts.push(workout);

        //отобразить тренирвку на карте
        this.displayWokout(workout);

        //отобразить тренировку в списке

        //спрятать форму и очистить поля ввода данных
        inputDistance.value =
            inputDuration.value =
            inputTemp.value =
            inputClimb.value = "";
    }

    displayWokout(workout) {
        L.marker(workout.coords).addTo(this.#map)
            .bindPopup(L.popup({
                maxWidth: 200,
                minWidth: 100,
                autoClose: false,
                closeOnClick: false,
                className: `${workout.type}-popup`,
            }))
            .openPopup().setPopupContent("Треня");
    }
}

const app = new App();

