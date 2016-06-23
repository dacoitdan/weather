var data = require('./data');

// Functions

function forEach(arr, callback){
	for(var i = 0; i < arr.length; i++){
		callback(arr[i]);
	}
}

function map(arr, callback){
	var result = [];
	forEach(arr, function(thing){result.push(callback(thing))});
	return result;
}

function reduce(arr, callback){
	var result = arr[0];
	array = arr.slice(1);
	forEach(array, function(thing){result = callback(result, thing)});
	return result;
}

function filter(arr, callback){
	var result = [];
	forEach(arr, function(thing){
		if(callback(thing)){
			result.push(thing);
		}
	})
	return result;
}

//

function print(location){
	printLine(location.name);
	console.log(' ' + location.weather[0].description + '.');
	console.log(' Temp: ' + toFahr(location.main.temp));
	console.log(' Lo: ' + toFahr(location.main.temp_min) + ', Hi: ' + toFahr(location.main.temp_max)); 
	console.log(' Humidity: ' + location.main.humidity + '%');
	console.log(' Wind: ' + Math.round(location.wind.speed*10)/10 + ' MPH ' + toCardinal(location.wind.deg));
	printLine();
}

function printLine(string){
	if(!string){
		string = ''
	}
	var l = 30-string.length;
		for(var i = 0; i < l; i++){
		string += '=';
	}
	console.log(string);
}

function toFahr(K){
	return Math.round(K*(9/5) - 459.67);
}

function toCardinal(deg){
	var directions = ["N", "NE", "E", "SE", "S", "SW", "W", "NW", "N"];
	if(deg < 0){
		deg = deg+360;
	}
	return directions[Math.round((deg-22.5)/45)]
}

function calcAvg(list){
	var avg = {
		"name":"Average",
		"main":{
	        "temp": 0,
	        "humidity": 0,
	        "temp_min": 0,
	       	"temp_max": 0
	    },
		"weather":[
	        {
	           "description":""
	        }
	    ],
	    "wind":{
	        "speed": 0,
	        "deg": 0
	    },
	}
	var descriptions = map(list, function(item){return item.weather[0].description}).sort();
	var rep = descriptions[0];
	var most = descriptions[0];
	var count = 1;
	var bigcount = 1;
	for(var i = 1; i < descriptions.length; i++){
		if(descriptions[i] === rep){
			count++;
		} else {
			rep = descriptions[i];
			count = 1;
		}
		if(count > bigcount){
			bigcount = count;
			most = rep;
		}
	}
	avg.weather[0].description = most;
	for(var prop in avg.main){
		avg.main[prop] = Math.round(reduce(map(list, function(item){return item.main[prop]}), function(a,b){return a + b})/data.list.length);
	}
	for(var prop in avg.wind){
		avg.wind[prop] = Math.round(reduce(map(list, function(item){return item.wind[prop]}), function(a,b){return a + b})/data.list.length);
	}
	return avg;
}

var sorted = data.list.slice();
sorted.sort(function(a, b){
	if(a.name < b.name){
		return -1;
	} else if(a.name > b.name){
		return 1;
	} else {
		return 0;
	}
})

sorted[sorted.length] = calcAvg(data.list);

forEach(sorted, print)

console.log('Lowest Temp = ' + toFahr(Math.round(reduce(map(data.list, function(item){return item.main.temp}), function(a,b){if(a < b){return a} else {return b}}))));

console.log('Highest Temp = ' + toFahr(Math.round(reduce(map(data.list, function(item){return item.main.temp}), function(a,b){if(a > b){return a} else {return b}}))));

console.log('Lowest Humidity = ' + Math.round(reduce(map(data.list, function(item){return item.main.humidity}), function(a,b){if(a < b){return a} else {return b}})));

console.log('Highest Humidity = ' + Math.round(reduce(map(data.list, function(item){return item.main.humidity}), function(a,b){if(a > b){return a} else {return b}})));

console.log('Lowest Wind Speed = ' + Math.round(reduce(map(data.list, function(item){return item.wind.speed}), function(a,b){if(a < b){return a} else {return b}})));

console.log('Highest Wind Speed = ' + Math.round(reduce(map(data.list, function(item){return item.wind.speed}), function(a,b){if(a > b){return a} else {return b}})));




