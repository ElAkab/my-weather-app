import { createIcons, icons } from "lucide";
createIcons({ icons }); // Initialise tous les icônes disponibles

const APIkey = "4c8d18e73474c9fea08ef453b4549c7a";

let searchInput = document.getElementById("search");
let validationBtn = document.getElementById("validation");
let weatherContainer = document.getElementById("weather-container");
let image = document.getElementById("weather-image");
let city = document.getElementById("city");
let temperature = document.getElementById("temperature");
let humidity = document.getElementById("humidity");
let wind = document.getElementById("wind");

let humidityTitle = document.getElementById("humidity-title");
let windTitle = document.getElementById("wind-title");
let allSvg = document.querySelectorAll("svg");

validationBtn.addEventListener("click", () => {
	console.log("Button clicked");

	let searchValue = searchInput.value.trim();
	if (searchValue) {
		console.log("City founded : " + searchValue);
		getWeather(searchValue);
	} else {
		console.log("Error.. sorry...");
	}
});

async function getWeather(city) {
	try {
		const URL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIkey}&units=metric`;

		let request = await fetch(URL);
		if (!request.ok || !city) {
			throw new Error("Error " + request.status + ": " + request.statusText);
		}
		const JSON = await request.json();
		console.log(JSON);

		showData(JSON);
		weatherContainer.classList.remove("max-h-0");
		weatherContainer.classList.add("max-h-[600px]", "opacity-100");
	} catch (error) {
		console.error("Failed to fetch weather data:", error);
		showError("City not found");
	}
}

function showData(data) {
	const elements = [image, temperature, city, humidity, wind];

	// Appliquer fade-out
	elements.forEach((el) => {
		el.classList.remove("fade-in");
		el.classList.add("fade-out");
	});

	setTimeout(() => {
		// Mettre à jour le contenu après le fade-out
		city.textContent = data.name;
		temperature.textContent = `${data.main.temp}°C`;
		humidity.textContent = `${data.main.humidity}%`;
		wind.textContent = `${data.wind.speed}km/h`;

		switch (data.weather[0].main) {
			case "Clear":
				image.src = "/img/clear.png";
				break;
			case "Clouds":
				image.src = "/img/clouds.png";
				break;
			case "Mist":
				image.src = "/img/mist.png";
				break;
			case "Rain":
				image.src = "/img/rain.png";
				break;
			case "Snow":
				image.src = "/img/snow.png";
				break;
			default:
				image.src = "/img/404.png";
		}

		// Appliquer fade-in
		elements.forEach((el) => {
			el.classList.remove("fade-out");
			el.classList.add("fade-in");
		});
	}, 300); // 300ms = durée du fade-out

	if (
		humidityTitle.classList.contains("opacity-0") ||
		windTitle.classList.contains("opacity-0")
	) {
		humidityTitle.classList.remove("opacity-0");
		windTitle.classList.remove("opacity-0");
		humidityTitle.classList.add("opacity-100");
		windTitle.classList.add("opacity-100");
		allSvg.forEach((one) => {
			one.classList.remove("opacity-0");
			one.classList.add("opacity-100");
		});
	}
}

if ("geolocation" in navigator) {
	// 	const option = {
	//   enableHighAccuracy: true,
	//   timeout: 5000,
	//   maximumAge: 0
	// };
	console.log(navigator);

	const option = {
		enableHighAccuracy: true,
		timeout: 5000, // In milliseconds
		maximumAge: 0, // 0 = location data should not be cached
	};

	function error() {
		console.log("Error : geolocation's request has been denied :/..");
	}

	navigator.geolocation.getCurrentPosition(
		(position) => {
			const lat = position.coords.latitude;
			const lon = position.coords.longitude;

			async function getWeather(lat, lon) {
				try {
					const URL = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${APIkey}&units=metric`;
					let request = await fetch(URL);

					if (!request.ok) {
						throw new Error(
							"Error : " + request.status + " " + request.statusText
						);
					}
					const JSON = await request.json();
					console.log(JSON);

					showData(JSON);
					weatherContainer.classList.remove("max-h-0");
					weatherContainer.classList.add("max-h-[600px]", "opacity-100");
				} catch (error) {
					console.error("Failed to fetch weather data:", error);
					showError("City not found");
				}
			}
			getWeather(lat, lon);
		},
		error,
		option
	);
}

function showError(message = "Something went wrong") {
	image.src = "./public/img/404.png";
	city.textContent = message;
	temperature.textContent = "";
	humidity.textContent = "";
	wind.textContent = "";
	weatherContainer.classList.remove("opacity-0");
	weatherContainer.classList.add("max-h-[300px]", "opacity-100");
	if ((humidityTitle !== "" || windTitle !== "") && allSvg) {
		humidityTitle.classList.add("opacity-0");
		windTitle.classList.add("opacity-0");
		allSvg.forEach((one) => one.classList.add("opacity-0"));
	} else {
		humidityTitle = "Humidity";
		windTitle = "Wind speed";
		allSvg.forEach((one) => one.classList.remove("opacity-0"));
		allSvg.forEach((one) => one.classList("opacity-100"));
	}
}
