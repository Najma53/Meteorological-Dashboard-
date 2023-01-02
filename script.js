

$(document).ready(function() {
	// Event Click for Search Button
	$("#search-button").on("click", function(event) {
	  event.preventDefault();
	  var city = $("#city").val();
	  if (city == "") {
		return;
	  } else {
		currentCityWeather(city);
		appendRecentSearches(city);
	  }
	});

	// Onclick listener to search list items
	$("#recent-searches-list").on("click", "li.list-group-item", function() {
	  
		var city = $(this).text();
			
	  currentCityWeather(city);
	});
  
	// Hide Elements til item is searched
	$("#city-info").hide();
	$("#forecast").hide();
  
	// Load Recent Searches from Local Storage
	RecentSearches();


	// Alert to let user know city doesnt exist from Ajax response
    $(document).ajaxError(function (event, request, settings) {
		alert("Please enter a valid city or check your spelling");
	});


	// City's Weather Info
	function currentCityWeather(city) {
	  $("#city-info").show();
	  var api_key = "42cd481ac018158be3d5352c716f948d";
	  var queryURL = `https://api.openweathermap.org/data/2.5/weather?appid=${api_key}`;
	
	  city = city;
	  
	  var unit = "metric";
	  var currentCityURL = queryURL + "&q=" + city + "&units=" + unit;

      $.ajax({
		url: currentCityURL,
		method: "GET"
	  }).then(function(response) {
		
		// City Name
		$("#city-name").text(response.name);
  
		// Today's Date - using moments to format it to british way.
		$("#date-today").text(`(${moment().format("DD/MM/YYYY")})`);
   
		// Weather Icon-There are many for same day depending on time but have link to the first one.
		$("#weather-icon").attr(
		  "src",
		  `https://openweathermap.org/img/wn/${response.weather[0].icon}.png`
		);

        // Temperature returned from response is in Celcius as metric unit were used.
		$("#temperature").text(response.main.temp + "°C");
  
		// Humidity Percentage
		$("#humidity").text(response.main.humidity + " %");
  
		// Wind Speed: MPH
		$("#wind-speed").text(response.wind.speed + " m/s");
		console.log(response)

        // 5 day forecast
		var id = response.id;
		future5DayForecast(id);
	  });
	}

    // Five Day forecast
	function future5DayForecast(id) {
        $("#forecast").show();
    
        var api_key = "42cd481ac018158be3d5352c716f948d";
        var forecastURL = `https://api.openweathermap.org/data/2.5/forecast?appid=${api_key}`;
    
        var unit = "metric";
        var futureForecastURL = forecastURL + "&id=" + id + "&units=" + unit;
    
        $.ajax({
          url: futureForecastURL,
          method: "GET"
        }).then(function(response) {
          console.log(response)


		// need to clear the five day forecast before you search next one
		//without $("#city-week-forecast").empty() code, it doesnt clear the 5 day 
		// forecas of previous search and keeps adding on to it
          $("#city-week-forecast").empty();
		  var futureCard = "";

          // Loop for five day
		for (var i = 1; i < response.list.length; i += 8) {
           
			// icon from response
            var weatherIcon = response.list[i].weather[0].icon;
    
            //To get the date information out and set it to British Format Method (Day,Month and Year)
        

          // If I didnt go through this and left it at var newDate = response.list[i].dt_txt; 
            //then it will display date in american format plus the time.
          var dateInStr = response.list[i].dt_txt;
          //dataSrr is showing as array of 2 things (date and time) in console when the data is retrieve 
		  //hence splitting the array into two date and time first with below code.
		  var dateStrArr = dateInStr.split(" ");
		  //below we are setting the date variable by picking up the date from above i.e first position in array
		  var date = dateStrArr[0];
		//   The date given is in the format of year, month and date.
		//Hence splitting again to each component separely,
		  var dateArr = date.split("-");
		  //Concating the date in the british format method.(day, month, year)
		  var newDate = dateArr[2] + "/" + dateArr[1] + "/" + dateArr[0];
          //  Creating card to hold the 5 day forecast using bootstrap cards and
			//appending the information to it from ajax function.
		
			futureCard = $(`
			<div class="card-black text-white  p-1 mr-3">
			 
			  <div class="card-body">
		   
		   
					   <h5>${newDate}</h5>
						<p><img id="weather-icon" src="https://openweathermap.org/img/wn/${weatherIcon}.png"/></p>
						<p>Temp: ${response.list[i].main.temp} °C</p>
					   <p>Humidity: ${response.list[i].main.humidity}% </p>
					   <p> Wind: ${response.list[i].wind.speed} m/s </p>
					</div>
				</div>
			<div>
		`);
   
		$("#city-week-forecast").append(futureCard);



    }
  });
}

// Add new city to Recent Searches list
var cities = [];
  
function appendRecentSearches(city) {
  $("#recent-searches").show();

  // Creating new variable to hold cities search and making new element to show
  //as listing 
  var newCity = $("<li>");
  newCity.addClass("list-group-item");
  newCity.text(city);
  // Append to List
  $("#recent-searches-list").prepend(newCity);

  var cityObj = {
    city: city
  };
  cities.push(cityObj);
  
	  // Save to localStorage
	  localStorage.setItem("searches", JSON.stringify(cities));
	}

	// Get Recent Searches from localStorage
	function RecentSearches() {
		var searches = JSON.parse(localStorage.getItem("searches"));
		if (searches != null) {
		  for (var i = 0; i < searches.length; i++) {
			return;
			
			
		  }
		
		}
	  }
	});
