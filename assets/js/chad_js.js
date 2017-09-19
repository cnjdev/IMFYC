// Nutrionix API information
var nxAppId = "e1023908";
var nxAppKey = "b27da09f2dfe35098a3ba4733fd361e8";
// Google API key
var gApiKey = "AIzaSyAjnWWbP30ssxxKP-jULse9lWmbR9AIaZ8";
// holds the length of the response array ajax returns
var length;
// variable to hold output of chooseRandomMealArrayIndex
var randomMealArrayIndex;
//function that gives us a random number we will use on our randomMealArray
function chooseRandomMealArrayIndex (){
		randomMealArrayIndex = Math.floor(Math.random()*(4));
		console.log("index for mealArray: " + randomMealArrayIndex);
	}
// in the future, var userInput = $("#calories").val().trim();
// for now, use 1000 to see how the program works
var userInput = 1000;
var flag = true;
//variable that will hold a random index to choose a member in the array ajax returns
var randomAjaxMealIndex;
//array we will use to build our meals, these strings when randomly selected will be placed into our query in our ajax function
var randomMealArray = ["burger", "chicken", "salad", "french fries"];
//when item from ajax array is chosen, push to the finishedMealArray
var finishedMealArray = [];
//get a random index based on the randomMealArray size
chooseRandomMealArrayIndex();
//variable that picks that member in the randomMealArray
var randomMeal = randomMealArray[randomMealArrayIndex];
console.log("random meal from mealArray: " + randomMeal);

for (var i = 0; i < 2; i++){
$.ajax({
        url: "https://api.nutritionix.com/v1_1/search",
        method: "POST",
        headers: {
            "Content-Type": 'application/json'
        },
        data: JSON.stringify({
          "appId": nxAppId,
          "appKey": nxAppKey,
          "queries": {
          	"brand_name": "mcdonald",
          	"item_name": randomMeal
          },
          "filters": {
          	"nf_calories": {
          	"from": 100,
          	"to": userInput
          	}
          },
          "fields": [
    			"item_name",
    			"nf_calories",
    			"nf_protein",
    			"nf_total_carbohydrate",
    			"nf_total_fat"   			
  				],
        })
  	}).done(function(response){
  		//function that outputs random index based on size of array ajax returns
  			function chooseRandomAjaxMealIndex(){
					length = response.hits.length;
					return Math.floor(Math.random()*(length));
				}
        console.log(response);
        //variable that holds chooseRandomAjaxMealIndex call
       	randomAjaxMealIndex = chooseRandomAjaxMealIndex();
       	console.log("randomAjaxMealIndex: " + randomAjaxMealIndex);
       	//variable that stores the name of the random item chosen from the array that ajax returns
       	var firstItemName = response.hits[randomAjaxMealIndex].fields.item_name;
       	finishedMealArray.push(response.hits[randomAjaxMealIndex].fields);
        //variable that holds the caloric value of firstItemName
        var firstItemCalories = response.hits[randomAjaxMealIndex].fields.nf_calories;
        var firstItemProtein = response.hits[randomAjaxMealIndex].fields.nf_protein;
        var firstItemCarbs = response.hits[randomAjaxMealIndex].fields.nf_total_carbohydrate;
        var firstItemFat = response.hits[randomAjaxMealIndex].fields.nf_total_fat;
        console.log("first item: " + firstItemName);
        console.log("calories/protein/carbs/fat of first item: " + firstItemCalories + ", " + firstItemProtein + "p/"
        	+ firstItemCarbs + "c/" + firstItemFat + "f");
        //subtract those calories from the user inputted value
        userInput -= firstItemCalories;
        console.log("Calories left now: " + userInput);
        console.log("finishedMealArray: ");
       	console.log(finishedMealArray);
        if (userInput<=100){
        	flag = false; 
        }
        
    }).fail(function(error){
        console.log(error);
    });
}






