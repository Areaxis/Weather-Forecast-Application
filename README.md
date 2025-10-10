# Weather Forecast Web Application
By Khriesezo Peseyie for the Internshala Trainings Project

Made using TailwindCSS, OpenWeatherAPI w/ Javascript and of course HTML.
## Setup
Run the **index.html** file, hosting in a secure HTTPS web service provider is preferred but not required.
## Usage
### 1. Open the website (index.html)
<img width="1920" height="930" alt="image" src="https://github.com/user-attachments/assets/6885499b-613a-4bb5-b4bb-c8bc07a4fbc8" />

### 2. Input a city name 
* By typing on the side bar
* By clicking Use Current Location, provided that permission is given
<img width="456" height="185" alt="image" src="https://github.com/user-attachments/assets/592851ea-c34f-41ec-a330-ffcfb97da903" />

### 3. Latest Weather Forecast output will be displayed below the input form
<img width="436" height="538" alt="image" src="https://github.com/user-attachments/assets/be5428c5-6353-456d-81af-be49d95fc406" />

### 4. 5-day Weather Forecast will be displayed on the main page
<img width="1920" height="928" alt="image" src="https://github.com/user-attachments/assets/7759f414-9acb-4dd2-8712-cfd25eba3aa6" />

### 5. Recent Searches will appear after atleast one input for reusing former inputs (upto 5)
<img width="467" height="259" alt="image" src="https://github.com/user-attachments/assets/0eefe9cc-6946-46f3-832c-9501d1ceab4c" />

(Recent Searches will not appear for any input done by clicking Use Current Location)
## Javascript Functionality
Used OpenWeather as the primary API for this project, the following are the functionalities added to this web application:

* Fetches real-time weather data and a 5-day forecast from OpenWeatherMap API.
* Supports city search and geolocation-based weather retrieval.
* Allows toggling between Celsius and Fahrenheit units.
* Dynamically updates UI with temperature, humidity, wind, weather description, and icons.
* Stores and displays recent searches using localStorage.
* Provides alerts for extreme temperatures (heat/cold) based on selected units.
* Applies animated weather effects (rain, snow, clouds, day/night backgrounds) for enhanced visualization.
* Implements error handling for invalid inputs or unavailable location data.
