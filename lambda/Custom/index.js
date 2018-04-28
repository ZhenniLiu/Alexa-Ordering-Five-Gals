//Build by: Zhenni Liu
//Purpose: New Media Capstone Class
//Info: A skill that allows user to place an order with the set menu and display on the restaurant end

'use strict';
const Alexa = require('alexa-sdk');
const APP_ID = 'amzn1.ask.skill.00a4c531-0254-49cc-b25a-28efadbfd1c6';
var AWS = require("aws-sdk");
//Store all menu items to 2D array
const docClient = new AWS.DynamoDB.DocumentClient();
function Create2DArray(rows) {
  var arr = [];

  for (var i=0;i<rows;i++) {
     arr[i] = [];
  }

  return arr;
}
var menuStorage = Create2DArray(15);

function getAllData(){
var params = {
            TableName: 'Menu',
            FilterExpression: "#id between :start_id and :end_id",
            ExpressionAttributeNames:{
            "#id" : "MenuID"
            },
            ExpressionAttributeValues: {
            ":start_id" : 0,
            ":end_id" : 14
            }
};

docClient.scan(params, function(err, data){
      if(err){
            //callback(err, null);
      }else{
            //callback(null, data);
            //console.log("Query succeeded.");
             data.Items.forEach(function(Menu) {
              menuStorage[Menu.MenuID].push(Menu.MenuName);
              menuStorage[Menu.MenuID].push(Menu.Description);
              menuStorage[Menu.MenuID].push(Menu.Category);
              menuStorage[Menu.MenuID].push(Menu.Price);
              menuStorage[Menu.MenuID].push(Menu.WaitTime);
              });
        }
});
}
//Menu items to 2D array

function findMenuItem(MenuArray, MenuItem){
    var status = -1;
    var stuff = "";
    for(var i=0; i<MenuArray.length; i++){
      stuff = MenuArray[i][0];
      if(stuff.toUpperCase()== MenuItem.toUpperCase()){
        status = i;
        break;
      }
    }
    return status;
}

function findCategory(MenuArray, CategoryName){
    var cateString = "";
    var stuff = "";
    for(var i=0; i<MenuArray.length; i++){
      stuff = MenuArray[i][2];
      if(stuff.toUpperCase()== CategoryName.toUpperCase()){
        cateString = cateString + MenuArray[i][0] + ", ";
      }
    }
    return cateString;
}

var orderPrices;
var orderPrice;
var orderItems;
var orderItem;
var orderTimes;
var orderTime;
var orderPersonName;
var orderNumber = 1;
var tax = 1.07;
const states = {
    STARTMODE: '_STARTMODE',
    ORDERMODE: '_ORDERMODE',
    ITEMCONFIRMMODE: '_ITEMCONFIRMMODE',
    ORDERCOMPLETEMODE: '_ORDERCOMPLETEMODE',
    GETNAMEMODE: '_GETNAMEMODE',
    RESERVATIONMODE: '_RESERVATIONMODE'
};

const newSessionHandler = {
    'LaunchRequest': function(){
      this.handler.state = states.STARTMODE;
      //var speechOutput = 'welcome to five gals!';
      var speechOutput = "<prosody pitch='high'>welcome to five gals</prosody>";
      this.emit(':ask', speechOutput);
      orderPrices = 0;
      orderPrice = 0;
      orderItems = "";
      orderItem = "";
      orderTimes = 0;
      orderTime = 0;
      orderPersonName = "";
    },
};

const startHandlers = Alexa.CreateStateHandler(states.STARTMODE,{
  'AskToOrderIntent': function(){
    this.emit(':ask', 'Would you like to place an order from Five Gals?');
  },
  'PlaceOrderIntent': function(){
    this.handler.state = states.ORDERMODE;
    this.emit(':ask', 'Okay, what would you like to order?');
  },
  'GetMenuIntent': function(){
      this.emit(':ask', 'You can ask for all pizzas, all sides, all drinks, or all desserts');
  },
  'GetAllPizzaIntent': function(){
      //var pizzaString = findCategory(menuStorage, "pizzas");
      var pizzaString = "We have Cheese Pizza, Pepperoni Pizza, White Pizza, Meat Lovers, and Veggie Pizza. All of our pizzas are ten inches personal pizzas.";
      this.emit(':ask', pizzaString);
  },
  'GetAllSideIntent': function(){
      //var sideString = findCategory(menuStorage, "sides");
      var sideString = "We have Breadsticks, Caesar Salad, and Greek Salad.";
      this.emit(':ask', sideString);
  },
  'GetAllDrinkIntent': function(){
      //var drinkString = findCategory(menuStorage, "drinks");
      //Coke Zero won't work for voice
      var drinkString = "We have Coke, Diet Coke, Sprite, and Water.";
      this.emit(':ask', drinkString);
  },
  'GetAllDessertIntent': function(){
      //var dessertString = findCategory(menuStorage, "dessert");
      var dessertString = "We have Cinnamon Sticks and Mini Cannolis."
      this.emit(':ask', dessertString);
  },
  'GetFoodInfoIntent': function(){
      const foodItem = this.event.request.intent.slots.food.value;
      const checker = findMenuItem(menuStorage,foodItem);
      if(checker >= 0){
        var orderDescription = menuStorage[checker][1];
        this.emit(':ask',orderDescription);
      }
      else{
          this.emit(':ask',foodItem + ' is not in our menu');
      }
  },
  'GetFoodPriceIntent': function(){
      const foodItem = this.event.request.intent.slots.food.value;
      const checker = findMenuItem(menuStorage,foodItem);
      if(checker >= 0){
        var foodPrice = menuStorage[checker][3];
        this.emit(':ask',foodItem + ' is $' + foodPrice);
      }
      else{
        this.emit(':ask',foodItem + ' is not in our menu');
      }
  },
  // 'MakeReservationIntent': function(){
  //   this.handler.state = states.RESERVATIONMODE;
  //   this.emit(':ask', 'Welcome to five gals table reservation, how many people would you like to reserve the table for');
  // },
  'SpecialOfDayIntent': function(){
    this.emit(':ask', 'sorry, we currently do not have any specials');
  },
  'AddressIntent': function(){
    this.emit(':ask', 'we are located at the fourth floor of the journalism building at 154 Hooper Street, Athens, Georgia');
  },
  'HoursIntent': function(){
    this.emit(':ask', 'we are open Sunday through Thursday 10AM to 10PM and Friday through Saturday 11AM to 11PM');
  },
  'AMAZON.YesIntent': function(){
    this.emitWithState('PlaceOrderIntent');
  },
  'AMAZON.NoIntent': function(){
    this.emit(':ask','okay');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask','you can ask for the menu, place an order, and more');
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell','have a nice day'); 
  },
  'Unhandled': function() {
    const message = "Sorry, I didn't get that. You can ask for help by saying 'help'";
    this.emit(':ask', message, message);
  }
});
const orderHandlers = Alexa.CreateStateHandler(states.ORDERMODE, {
  'PlaceOrderIntent': function(){
    this.emit(':ask', 'okay, what would you like to order');
  },
  'OrderingIntent': function(){
    this.handler.state = states.ORDERMODE;
    const foodItem = this.event.request.intent.slots.food.value;
    const checker = findMenuItem(menuStorage,foodItem);
    if(checker >= 0){
      this.emit(':ask','You want ' +menuStorage[checker][0]+ ' is that correct');
      orderItem = menuStorage[checker][0];
      orderPrice = menuStorage[checker][3];
      orderTime = menuStorage[checker][4];
    }
    else{
      var Pizza = "pizza";
      if(foodItem.toUpperCase()== Pizza.toUpperCase()){
          this.emit(':ask', "what kind of pizzas would you like. You can say 'all pizzas' to get a list of our current pizzas");
      }else{
          this.emit(':ask','We do not have ' + foodItem);
      }
    }
  },
  'GetMenuIntent': function(){
      this.emit(':ask', 'You can ask for all pizzas, all sides, all drinks, or all desserts');
  },
  'GetAllPizzaIntent': function(){
      //var pizzaString = findCategory(menuStorage, "pizzas");
      var pizzaString = "We have Cheese Pizza, Pepperoni Pizza, White Pizza, Meat Lovers, and Veggie Pizza. All of our pizzas are ten inch personal pizzas.";
      this.emit(':ask', pizzaString);
  },
  'GetAllSideIntent': function(){
      //var sideString = findCategory(menuStorage, "sides");
      var sideString = "We have Breadsticks, Caesar Salad, and Greek Salad.";
      this.emit(':ask', sideString);
  },
  'GetAllDrinkIntent': function(){
      //var drinkString = findCategory(menuStorage, "drinks");
      //Coke Zero won't work for voice
      var drinkString = "We have Coke, Diet Coke, Sprite, and Water.";
      this.emit(':ask', drinkString);
  },
  'GetAllDessertIntent': function(){
      //var dessertString = findCategory(menuStorage, "dessert");
      var dessertString = "We have Cinnamon Sticks and Mini Cannolis."
      this.emit(':ask', dessertString);
  },
  'GetFoodInfoIntent': function(){
      const foodItem = this.event.request.intent.slots.food.value;
      const checker = findMenuItem(menuStorage,foodItem);
      if(checker >= 0){
        var orderDescription = menuStorage[checker][1];
        this.emit(':ask',orderDescription);
      }
      else{
        this.emit(':ask',foodItem + ' is not in our menu');
      }
  },
  'GetFoodPriceIntent': function(){
      const foodItem = this.event.request.intent.slots.food.value;
      const checker = findMenuItem(menuStorage,foodItem);
      if(checker >= 0){
        var foodPrice = menuStorage[checker][3];
        this.emit(':ask',foodItem + ' is $' + foodPrice);
      }
      else{
        this.emit(':ask',foodItem + ' is not in our menu');
      }
  },
  'AMAZON.YesIntent': function(){
    //itemIndex++;
    orderItems = orderItems + orderItem + ", ";
    orderPrices = orderPrices + orderPrice;
    orderTimes = orderTimes + orderTime;
    this.handler.state = states.ITEMCONFIRMMODE;
    this.emit(':ask','Okay, would you like to order anything else');
  },
  'AMAZON.NoIntent': function(){
    this.emit(':ask','Okay, what would you like');
  },
  'AMAZON.HelpIntent': function(){
    this.emit(':ask',"you can place an order by saying 'i want to order' or ask for the menu by saying 'what is on the menu'");
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day'); 
  },
  'Unhandled': function() {
    const message = "Sorry, I didn't get that. You can ask for help by saying 'help'";
    this.emit(':ask', message, message);
  }
});
const itemConfirmHandlers = Alexa.CreateStateHandler(states.ITEMCONFIRMMODE,{
  'OrderingIntent': function(){
    this.handler.state = states.ORDERMODE;
    const foodItem = this.event.request.intent.slots.food.value;
    const checker = findMenuItem(menuStorage,foodItem);
    if(checker >= 0){
      this.emit(':ask','You want ' +menuStorage[checker][0]+ ' is that correct');
      orderItem = menuStorage[checker][0];
      orderPrice = menuStorage[checker][3];
      orderTime = menuStorage[checker][4];
    }
    else{
      this.emit(':ask','We do not have ' + foodItem);
    }
  },
  'AMAZON.YesIntent': function(){
    this.handler.state = states.ORDERMODE;
    this.emit(':ask','okay, what else would you like');
  },
  'AMAZON.NoIntent': function(){
    this.emitWithState('DoneOrderingIntent');
  },
  'DoneOrderingIntent': function(){
    this.handler.state = states.ORDERCOMPLETEMODE;
    var speechOutput = "Okay, you've ordered "+orderItems+ ". Your total price is $"+(orderPrices*tax).toFixed(2)+". The estimated pick up time is "+orderTimes+" minutes <break time='.5s'/>and the order number is "+orderNumber+ ". Is everything correct?";
    this.emit(':ask', speechOutput);
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day'); 
  },
  'Unhandled': function() {
    const message = "Sorry, I didn't get that.";
    this.emit(':ask', message, message);
  }
});
const orderCompleteHandlers = Alexa.CreateStateHandler(states.ORDERCOMPLETEMODE,{
 'AMAZON.YesIntent': function(){
    this.handler.state = states.GETNAMEMODE;
    this.emit(':ask','What is the name for your order?');
    // var docClient = new AWS.DynamoDB.DocumentClient();
    // var params = {
    //   TableName: "Orders",
    //   Item:{
    //       "itemid": orderNumber,
    //       "numToShow": orderNumber,
    //       "orderToShow": orderItems,
    //       "priceToShow": orderPrices,
    //   }
    // };
    // docClient.put(params, (() => {
    //   this.emit(':tell', 'Thanks for ordering from five gals, your order has been placed');
    // }));
    // orderNumber++;
    // if(orderNumber>50){
    //   orderNumber = 1;
    // }
  },
  'AMAZON.NoIntent': function(){
    this.handler.state = states.STARTMODE;
    this.emit(':ask', 'Your order has been cancelled. You may place an order by saying I want to order or ask for help by saying help');
    orderPrices = 0;
    orderPrice = 0;
    orderItems = "";
    orderItem = "";
    orderTimes = 0;
    orderTime = 0;
  },
  'AMAZON.CancelIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day');
  },
  'AMAZON.StopIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day'); 
  },
  'Unhandled': function() {
    const message = 'Sorry, I did not get that';
    this.emit(':ask', message, message);
  }
});
const nameHandlers = Alexa.CreateStateHandler(states.GETNAMEMODE,{
    'GetNameIntent': function(){
        const personName = this.event.request.intent.slots.name.value;
        this.emit(':ask', 'Your name is '+personName+', is that correct?');
        orderPersonName = personName;
    },
    'NameConfirmHandler': function(){
        this.emit(':ask', 'Okay, what is the name for your order?');
    },
    'AMAZON.YesIntent': function(){
        var docClient = new AWS.DynamoDB.DocumentClient();
        var params = {
          TableName: "Orders",
            Item:{
              "itemid": orderNumber,
              "numToShow": orderNumber,
              "orderToShow": orderItems,
              "priceToShow": orderPrices,
              "nameToShow": orderPersonName
          }
        };
        docClient.put(params, (() => {
          this.emit(':tell', orderPersonName+", thank you for ordering from Five Gals. Your order has been placed.");
        }));
        orderNumber++;
        if(orderNumber>50){
          orderNumber = 1;
        }
    },
    'AMAZON.NoIntent': function(){
        this.emitWithState('NameConfirmHandler');
    },
    'AMAZON.CancelIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day');
    },
    'AMAZON.StopIntent': function(){
    this.emit(':tell','thank you for choosing five gals, have a nice day'); 
    },
    'Unhandled': function() {
    const message = "Sorry, I didn't get that.";
    this.emit(':ask', message, message);
    }
});
// const reservationHandlers = Alexa.CreateStateHandler(states.RESERVATIONMODE,{
//   'NumberReserveIntent': function(){
//       //var numPeople = this.event.request.intent.slots.AMAZON.NUMBER.value;
//       var numPeople = 4;
//       this.emit(':ask', 'what is the date and time you would like the reservation for ' +numPeople+ ' people.');
//   },
//   'DateTimeReserveIntent': function(){
//       const date = this.event.request.intent.slots.AMAZON.date;
//       const time = this.event.request.intent.slots.AMAZON.time;
//       this.emit(':ask','Your reservation is on '+date+' at '+time);
//   }
// });
exports.handler = function (event, context){
    getAllData();
    //setTimeout for all alexa handlers so we can retrieve data from dynamodb
    setTimeout(function(){
    const alexa = Alexa.handler(event, context);
    alexa.APP_ID = APP_ID;
    alexa.registerHandlers(newSessionHandler,startHandlers,orderHandlers, itemConfirmHandlers,orderCompleteHandlers,nameHandlers);
    alexa.execute();
    },10);
};