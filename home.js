```javascript
const menuButton = document.querySelector("#menu-button");
const nav = document.querySelector("#main-nav");

const spotlights = document.querySelector("#spotlights");

const currentWeather = document.querySelector("#current-weather");
const forecast = document.querySelector("#forecast");


/* NAVIGATION */

menuButton.addEventListener("click", () => {

    const isOpen = nav.classList.toggle("open");

    menuButton.setAttribute(
        "aria-expanded",
        isOpen
    );

    menuButton.textContent = isOpen ? "✕" : "☰";

});


/* OPENWEATHER */

const API_KEY = "YOUR_API_KEY_HERE";

const LATITUDE = -26.2041;
const LONGITUDE = 28.2594;

const CURRENT_URL =
    `https://api.openweathermap.org/data/2.5/weather?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;

const FORECAST_URL =
    `https://api.openweathermap.org/data/2.5/forecast?lat=${LATITUDE}&lon=${LONGITUDE}&units=metric&appid=${API_KEY}`;


async function loadWeather() {

    if (API_KEY === "YOUR_API_KEY_HERE") {

        currentWeather.innerHTML =
            "<p>Add your OpenWeatherMap API key to home.js.</p>";

        return;
    }

    try {

        const currentResponse =
            await fetch(CURRENT_URL);

        const forecastResponse =
            await fetch(FORECAST_URL);


        if (!currentResponse.ok ||
            !forecastResponse.ok) {

            throw new Error("Weather request failed.");
        }


        const current =
            await currentResponse.json();

        const forecastData =
            await forecastResponse.json();


        currentWeather.innerHTML = `

            <div class="weather-current">

                <img
                    src="https://openweathermap.org/img/wn/${current.weather[0].icon}@2x.png"
                    alt="${current.weather[0].description}"
                >

                <div>

                    <p class="temp">
                        ${Math.round(current.main.temp)}°C
                    </p>

                    <p>
                        ${current.weather[0].description}
                    </p>

                </div>

            </div>
        `;


        const days =
            getThreeDayForecast(
                forecastData.list
            );


        forecast.innerHTML =
            days.map(day => `

                <div class="forecast-card">

                    <h3>${day.label}</h3>

                    <p>
                        ${Math.round(day.temp)}°C
                    </p>

                    <p>
                        ${day.description}
                    </p>

                </div>

            `).join("");

    }

    catch (error) {

        console.error(error);

        currentWeather.innerHTML =
            "<p>Weather information is unavailable.</p>";
    }
}


function getThreeDayForecast(list) {

    const days = {};

    list.forEach(item => {

        const date =
            new Date(item.dt * 1000);

        const key =
            date.toISOString().split("T")[0];


        if (!days[key]) {

            days[key] = {

                date: date,

                temp: item.main.temp,

                description:
                    item.weather[0].description

            };
        }

    });


    return Object.values(days)
        .slice(0, 3)
        .map(day => ({

            label:
                day.date.toLocaleDateString(
                    "en-ZA",
                    {
                        weekday: "short"
                    }
                ),

            temp: day.temp,

            description: day.description

        }));
}


/* MEMBER SPOTLIGHTS */

async function loadSpotlights() {

    try {

        const response =
            await fetch("data/members.json");


        if (!response.ok) {

            throw new Error(
                "Members could not be loaded."
            );
        }


        const members =
            await response.json();


        const eligibleMembers =
            members.filter(
                member =>
                    member.membership === 2 ||
                    member.membership === 3
            );


        /* RANDOMIZE MEMBERS */

        for (
            let i = eligibleMembers.length - 1;
            i > 0;
            i--
        ) {

            const random =
                Math.floor(
                    Math.random() * (i + 1)
                );

            [
                eligibleMembers[i],
                eligibleMembers[random]
            ] = [
                eligibleMembers[random],
                eligibleMembers[i]
            ];
        }


        const selectedMembers =
            eligibleMembers.slice(0, 3);


        spotlights.innerHTML = "";


        selectedMembers.forEach(member => {

            const card =
                document.createElement("article");

            card.className =
                "spotlight-card";


            const membership =
                member.membership === 3
                    ? "Gold"
                    : "Silver";


            card.innerHTML = `

                <img
                    src="images/${member.image}"
                    alt="${member.name} logo"
                    loading="lazy"
                >

                <h3>
                    ${member.name}
                </h3>

                <p>
                    <strong>Phone:</strong>
                    ${member.phone}
                </p>

                <p>
                    <strong>Address:</strong>
                    ${member.address}
                </p>

                <p>
                    <strong>Membership:</strong>
                    ${membership}
                </p>

                <p>
                    <a
                        href="${member.website}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Visit Website
                    </a>
                </p>

            `;


            spotlights.appendChild(card);

        });

    }

    catch (error) {

        console.error(error);

        spotlights.innerHTML =
            "<p>Member information could not be loaded.</p>";
    }
}


/* FOOTER */

document.querySelector("#current-year").textContent =
    new Date().getFullYear();

document.querySelector("#last-modified").textContent =
    document.lastModified;



loadWeather();

loadSpotlights();
```
