$( document ).ready(function() {

  function showFood(x){
    if(x === 1){
      $("#meal1Contents").html(localStorage.getItem("meal1Contents"));
      $("#meal1Calories").text(localStorage.getItem("meal1Calories"));
    }
    if(x === 2){
      $("#meal2Contents").html(localStorage.getItem("meal2Contents"));
      $("#meal2Calories").text(localStorage.getItem("meal2Calories"));
    }
    if(x === 3){
      $("#meal3Contents").html(localStorage.getItem("meal3Contents"));
      $("#meal3Calories").text(localStorage.getItem("meal3Calories"));
    }
  }

    if("#meal1Calories".length > 0){
      $( document ).ready(function() {
        showFood(1);
        showFood(2);
        showFood(3);
        // $("#meal1Contents").html(localStorage.getItem("meal1Contents"));
        // $("#meal1Calories").text(localStorage.getItem("meal1Calories"));
        // $("#meal2Contents").html(localStorage.getItem("meal2Contents"));
        // $("#meal2Calories").text(localStorage.getItem("meal2Calories"));
        // $("#meal3Contents").html(localStorage.getItem("meal3Contents"));
        // $("#meal3Calories").text(localStorage.getItem("meal3Calories"));
        });
    }

  


  $("#submitBtn").click(function() {
    // Nutrionix API information
    var nxAppId = "993b6cd3",
    nxAppKey = "9ea228c4991a1a152c546b5487ce38a5",

    // Google API key
    gApiKey = "AIzaSyAjnWWbP30ssxxKP-jULse9lWmbR9AIaZ8",

    // array of booleans, the value of each member will tell us which meal array to push to, and when to start a new meal array
    flagArray = [false, false, false],

    // for now, use a hard number to see how the program works
    userInput = parseInt($("#calorieInput").val().trim()),

    // keep track of how many calories we have left, it will be altered as we build our meals
    maxCalories = userInput,

    // these strings when randomly selected will be placed into our query in our ajax function
    randomMealArray = ["burger", "chicken", "fish", "salad", "fries", "parfait", "frozen", "wrap", "fries", "mcrib", "big mac", "mcmuffin", "apple pie"],

    // empty arrays we will populate with our meal items
    finishedMealArray1 = [],
    finishedMealArray2 = [],
    finishedMealArray3 = [],

    // will be used to store what we selecct from randomMealArray
    randomMeal,

    // used to store items we remove from our potential search items
    splicedItem,

    // store total nutrtional info for each meal 
    finishedMeal1Calories = 0,
    finishedMeal1Protein = 0,
    finishedMeal1Carbs = 0,
    finishedMeal1Fat = 0,
    finishedMeal2Calories = 0,
    finishedMeal2Protein = 0,
    finishedMeal2Carbs = 0,
    finishedMeal2Fat = 0,
    finishedMeal3Calories = 0,
    finishedMeal3Protein = 0,
    finishedMeal3Carbs = 0,
    finishedMeal3Fat = 0;


  // random index used to choose a meal item from randomMealArray which will be used for API search 
  function chooseRandomMealArrayIndex() {
    return Math.floor(Math.random() * (randomMealArray.length));
    console.log("index for randomMealArray: " + randomMealArrayIndex);
  }


  // reset values when we start to populate a new meal array
  function resetValues() {
    randomMealArray = ["burger", "chicken", "fish", "salad", "fries", "parfait", "frozen", "wrap", "fries", "mcrib", "big mac", "mcmuffin", "apple pie"];
    maxCalories = userInput;
    console.log("randomMealArray has been repopulated, and maxCalories reset");
    console.log("----------");
  }


  //function that selects what we will use in our API Query, while deleting potential search options depending on the amount of calories we have left
  function chooseQuery() {

    if (maxCalories >= 1500) {
      // if max calories is greater than 1500, we won't remove options, thus making them stay eligible to be re-chosen
      var randomizedIndex = chooseRandomMealArrayIndex();
      console.log("randomizedIndex: " + randomizedIndex);
      randomMeal = randomMealArray[randomizedIndex];
      console.log("random meal from mealArray: " + randomMeal);
    }
    // use "ice cream" when calories are 250 or below
    else if (maxCalories <= 250) {
      randomMeal = "soda";
    } else {
      var randomizedIndex = chooseRandomMealArrayIndex();
      console.log("randomizedIndex: " + randomizedIndex);
      randomMeal = randomMealArray[randomizedIndex];
      console.log("random meal from mealArray: " + randomMeal);

      // if max calories is less than 1500, we will start to remove particular options once they are chosen     
      if ((randomMeal == "salad") || (randomMeal == "cafe") || (randomMeal == "frozen")) {
        splicedItem = randomMealArray.splice(randomizedIndex, 1);
        console.log(splicedItem + " has been removed from the randomMealArray");
        console.log("randomMealArray: ");
        console.log(randomMealArray);
      } else {
        console.log(randomMeal + " was not removed from the randomMealArray");
        console.log("randomMealArray:");
        console.log(randomMealArray);
      }
    }
  }

  // function that actually makes a request to the API, and interacts with the response
  function getFood() {

    console.log("getFood called, randomMeal is: " + randomMeal);
    console.log("maxCalories is: " + maxCalories);

    // the item_name we search for is the string randomly chosen from our pre-defined options
    // the maximum calories allowed is whatever maxCalories is
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
          "brand_id": "513fbc1283aa2dc80c000053",         
          "item_name": randomMeal
        },
        "filters": {
          "nf_calories": {
            "from": 149,
            "to": maxCalories
          }
        },
        "fields": [
          "item_name",
          "brand_id",
          "nf_calories",
          "nf_protein",
          "nf_total_carbohydrate",
          "nf_total_fat"
        ],
      })
    }).done(function(response) {

      console.log("response is:");
      console.log(response);

      // function that returns random index that will be used to choose from the array the API returns
      function chooseRandomAjaxMealIndex() {

        var length = response.hits.length;

        if (randomMeal == "fries") {
          if (length < 3) {
            length = 1;
          } else {
            length = 6;
          }
        }

        if (randomMeal == "fish") {
          length = 4;
        }

        if (randomMeal == "ice cream") {
          length = 1;
        }

        if (randomMeal == "apple pie"){
          length = 1;
        }

        return Math.floor(Math.random() * (length));
      }

      // store a random index number to choose from what API returns
      randomAjaxMealIndex = chooseRandomAjaxMealIndex();
      console.log("randomAjaxMealIndex: " + randomAjaxMealIndex);
      var mealItemName;

      // if API returns nothing for us to choose, choose a new search and choose an item from that
      if (response.hits.length === 0) {

        // console.log("that item doesn't seem to exist right now, try again");
        // chooseQuery();
        // getFood();
        // return;
      } else {
        // if ajax does return someting, store what's randomly chosen 
        mealItemName = response.hits[randomAjaxMealIndex].fields.item_name;
      }


      // store the caloric and macro information
      var mealItemCalories = response.hits[randomAjaxMealIndex].fields.nf_calories,
        mealItemProtein = response.hits[randomAjaxMealIndex].fields.nf_protein,
        mealItemCarbs = response.hits[randomAjaxMealIndex].fields.nf_total_carbohydrate,
        mealItemFat = response.hits[randomAjaxMealIndex].fields.nf_total_fat;

      // calculate total nutriton for the respective meal
      function totalNutrition(x) {
        if(x === 1){
          finishedMeal1Calories += mealItemCalories;
          finishedMeal1Protein += mealItemProtein;
          finishedMeal1Carbs += mealItemCarbs;
          finishedMeal1Fat += mealItemFat;
        }
        if(x === 2){
          finishedMeal2Calories += mealItemCalories;
          finishedMeal2Protein += mealItemProtein;
          finishedMeal2Carbs += mealItemCarbs;
          finishedMeal2Fat += mealItemFat;
        }
        if(x === 3){
          finishedMeal3Calories += mealItemCalories;
          finishedMeal3Protein += mealItemProtein;
          finishedMeal3Carbs += mealItemCarbs;
          finishedMeal3Fat += mealItemFat;
        }
      }

      // log the name and nutritional info
      console.log("item: " + mealItemName);
      console.log("calories/protein/carbs/fat of first item: " + mealItemCalories + ", " + mealItemProtein + "p/" +
        mealItemCarbs + "c/" + mealItemFat + "f");


      //subtract those calories, the new total will be used for the next search
      maxCalories -= mealItemCalories;
      console.log("Calories left now: " + maxCalories);
      console.log("--------");


      // when a meal is completed, its respective position in the flagArray will be switched to true
      // thus, if it's flag is still false, we need to keep adding to it
      // if it's true, then we check the next flagArray member, until we find a false
      // then we start pushing meal items that new array    
      if (flagArray[0] === false) {
        totalNutrition(1);
        finishedMealArray1.push(response.hits[randomAjaxMealIndex].fields);
      } else if (flagArray[1] === false) {
        totalNutrition(2);
        finishedMealArray2.push(response.hits[randomAjaxMealIndex].fields);
      } else if (flagArray[2] === false) {
        totalNutrition(3);
        finishedMealArray3.push(response.hits[randomAjaxMealIndex].fields);
      }

      // decide what item to choose next
      decideNextItem();

    }).fail(function(error) {
      console.log(error);
    });
  }

  // log the respective finished meal array and its  nutritional info
  function displayTotalNutrition(y) {

    if (y === 1) {
      temp = finishedMealArray1;
      console.log("finishedMealArray1: ");
      console.log(temp);
      console.log("finishedMeal1 nutriton:");
      console.log("total calories: " + finishedMeal1Calories);
      console.log("total protein: " + finishedMeal1Protein);
      console.log("total carbs: " + finishedMeal1Carbs);
      console.log("total fat: " + finishedMeal1Fat);
      console.log("----------");
    }
    if (y === 2) {
      temp = finishedMealArray2;
      console.log("finishedMealArray2: ");
      console.log(temp);
      console.log("finishedMeal2 nutriton:");
      console.log("total calories: " + finishedMeal2Calories);
      console.log("total protein: " + finishedMeal2Protein);
      console.log("total carbs: " + finishedMeal2Carbs);
      console.log("total fat: " + finishedMeal2Fat);
      console.log("----------");
    }
    if (y === 3) {
      temp = finishedMealArray3;
      console.log("finishedMealArray3: ");
      console.log(temp);
      console.log("finishedMeal3 nutriton:");
      console.log("total calories: " + finishedMeal3Calories);
      console.log("total protein: " + finishedMeal3Protein);
      console.log("total carbs: " + finishedMeal3Carbs);
      console.log("total fat: " + finishedMeal3Fat);
      console.log("----------");
    }
    
  }

  // function that chooses our next item if we have enough calories
  function decideNextItem() {

    function persist(){
        var temp = "",
        temp2 = "",
        temp3 = "";
        for(var i = 0; i<finishedMealArray1.length; i++){
          console.log("Persist loop started");
          console.log(finishedMealArray1[i].item_name);
          temp = temp.concat(finishedMealArray1[i].item_name, "<br>")
          
        }
        console.log("temp: " + temp)
        localStorage.setItem("meal1Contents", temp);
        localStorage.setItem("meal1Calories", finishedMeal1Calories);
        
        for(var i = 0; i<finishedMealArray2.length; i++){
          
          temp2 = temp2.concat(finishedMealArray2[i].item_name, "<br>")
          
        }
        localStorage.setItem("meal2Contents", temp2);
        localStorage.setItem("meal2Calories", finishedMeal2Calories);
        
        for(var i = 0; i<finishedMealArray3.length; i++){
          
          temp3 = temp3.concat(finishedMealArray3[i].item_name, "<br>")
          
        }
        localStorage.setItem("meal3Contents", temp3);
        localStorage.setItem("meal3Calories", finishedMeal3Calories);
    }


    if (maxCalories <= 149) {
      console.log("not enough calories left");

      // if we don't have enough calories to add another item, we modify it's respective flag, 
      // which will signal to stop modifying that meal 
      // then we move onto populating the next meal
      if (flagArray[0] === false) {
        flagArray[0] = true;
        displayTotalNutrition(1);       
        resetValues();
        chooseQuery();
        getFood();
      } else if (flagArray[1] === false) {
        flagArray[1] = true;
        displayTotalNutrition(2);
        resetValues();
        chooseQuery();
        getFood();
      }
      // if we are on the final meal, and we no long have enough calories to add another item, 
      // then log each meal and its nutritional info
      else if (flagArray[2] === false) {
        flagArray[2] = true;
        // getImageFunc(1);
        // getImageFunc(2);
        // getImageFunc(3);
        displayTotalNutrition(1);
        displayTotalNutrition(2);
        displayTotalNutrition(3);
        persist();
        
      }
      return;
    } else {
      // if we have enough calories to add more items, but less than 330, we remove "burger" as an option, to minimize API errors
      // due to searching for burgers while not having enough calories for a burger
        if (maxCalories <= 330) {
          randomMealArray.splice("burger", 1);
          console.log("burger was removed due to insufficient calories");
          randomMealArray.splice("mcrib", 1);
          console.log("mcrib was removed due to insufficient calories");
          console.log("randomMealArray is now: " + randomMealArray);
        }
        if (maxCalories <= 279) {          
          randomMealArray.splice("mcrib", 1);
          console.log("mcrib was removed due to insufficient calories");
          console.log("randomMealArray is now: " + randomMealArray);
        }

      // now that we have checked we have enough calories, choose another search and choose another item from what the search returns
      chooseQuery();
      getFood();
    }
  }


  // start our first cycle of choosing our search term and manipulating what the API returns
  chooseQuery();
  getFood();
  });

})

//  function getImageFunc(x){
//    if (x === 1){
  //      var getImage = finishedMealArray[0].item_name;
  //      if (getImage.indexOf("burger") != -1){
  //        $("#whatever").attr("src", "..images/burger.jpg");    
  //      } else if (getImage.indexOf("mcchicken") != -1){
  //          $("#whatever").attr("src", "..images/mcchicken.jpg");
  //      } else if (getImage.indexOf("fish") != -1){
  //          $("#whatever").attr("src", "..images/fish.jpg");
  //      } else if (getImage.indexOf("salad") != -1){
  //          $("#whatever").attr("src", "..images/salad.jpg");
  //      } else if (getImage.indexOf("fries") != -1){
  //          $("#whatever").attr("src", "..images/fries.jpg");
  //      } else if (getImage.indexOf("parfait") != -1){
  //          $("#whatever").attr("src", "..images/parfait.jpg");
  //      } else if (getImage.indexOf("wrap") != -1){
  //          $("#whatever").attr("src", "..images/wrap.jpg");
  //      } else if (getImage.indexOf("mcrib") != -1){
  //          $("#whatever").attr("src", "..images/mcrib.jpg");
  //      } else if (getImage.indexOf("big mac") != -1){
  //          $("#whatever").attr("src", "..images/bigMac.jpg");
  //      } else if (getImage.indexOf("mcmuffin") != -1){
  //          $("#whatever").attr("src", "..images/mcmuffin.jpg");        
  //      } else if (getImage.indexOf("apple pie") != -1){
  //          $("#whatever").attr("src", "..images/applePie.jpg");
  //      else {
  //          $("#whatever").attr("src", "..images/arches.jpg");
//        }
//    else if (x === 2){
  //      var getImage = finishedMealArray[0].item_name;
  //      if (getImage.indexOf("burger") != -1){
  //        $("#whatever").attr("src", "..images/burger.jpg");    
  //      } else if (getImage.indexOf("mcchicken") != -1){
  //          $("#whatever").attr("src", "..images/mcchicken.jpg");
  //      } else if (getImage.indexOf("fish") != -1){
  //          $("#whatever").attr("src", "..images/fish.jpg");
  //      } else if (getImage.indexOf("salad") != -1){
  //          $("#whatever").attr("src", "..images/salad.jpg");
  //      } else if (getImage.indexOf("fries") != -1){
  //          $("#whatever").attr("src", "..images/fries.jpg");
  //      } else if (getImage.indexOf("parfait") != -1){
  //          $("#whatever").attr("src", "..images/parfait.jpg");
  //      } else if (getImage.indexOf("wrap") != -1){
  //          $("#whatever").attr("src", "..images/wrap.jpg");
  //      } else if (getImage.indexOf("mcrib") != -1){
  //          $("#whatever").attr("src", "..images/mcrib.jpg");
  //      } else if (getImage.indexOf("big mac") != -1){
  //          $("#whatever").attr("src", "..images/bigMac.jpg");
  //      } else if (getImage.indexOf("mcmuffin") != -1){
  //          $("#whatever").attr("src", "..images/mcmuffin.jpg");        
  //      } else if (getImage.indexOf("apple pie") != -1){
  //          $("#whatever").attr("src", "..images/applePie.jpg");
  //      } else if (getImage.indexOf("apple pie") != -1){
  //          $("#whatever").attr("src", "..images/applePie.jpg");
  //      else {
  //          $("#whatever").attr("src", "..images/arches.jpg");
//        }
  //  else if (x === 3){
  //      var getImage = finishedMealArray[0].item_name;
  //      if (getImage.indexOf("burger") != -1){
  //        $("#whatever").attr("src", "..images/burger.jpg");    
  //      } else if (getImage.indexOf("mcchicken") != -1){
  //          $("#whatever").attr("src", "..images/mcchicken.jpg");
  //      } else if (getImage.indexOf("fish") != -1){
  //          $("#whatever").attr("src", "..images/fish.jpg");
  //      } else if (getImage.indexOf("salad") != -1){
  //          $("#whatever").attr("src", "..images/salad.jpg");
  //      } else if (getImage.indexOf("fries") != -1){
  //          $("#whatever").attr("src", "..images/fries.jpg");
  //      } else if (getImage.indexOf("parfait") != -1){
  //          $("#whatever").attr("src", "..images/parfait.jpg");
  //      } else if (getImage.indexOf("wrap") != -1){
  //          $("#whatever").attr("src", "..images/wrap.jpg");
  //      } else if (getImage.indexOf("mcrib") != -1){
  //          $("#whatever").attr("src", "..images/mcrib.jpg");
  //      } else if (getImage.indexOf("big mac") != -1){
  //          $("#whatever").attr("src", "..images/bigMac.jpg");
  //      } else if (getImage.indexOf("mcmuffin") != -1){
  //          $("#whatever").attr("src", "..images/mcmuffin.jpg");        
  //      } else if (getImage.indexOf("apple pie") != -1){
  //          $("#whatever").attr("src", "..images/applePie.jpg");
  //      else {
  //          $("#whatever").attr("src", "..images/arches.jpg");
//        }
//  }
