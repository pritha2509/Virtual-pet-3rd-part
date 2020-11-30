var dog,sadDog,happyDog,garden,washroom, database;
var foodS,foodStock;
var fedTime,lastFed,currentTime;
var feed,addFood;
var foodObj;
var gameState,readState;
var vaccination,vaccImg;
var v=0;

var hospital;

function preload(){
sadDog=loadImage("images/Dog.png");
happyDog=loadImage("images/happy dog.png");
garden=loadImage("images/Garden.png");
livingroom=loadImage("images/Living Room.png");
washroom=loadImage("images/Wash Room.png");
bedroom=loadImage("images/Bed Room.png");
vaccImg=loadImage("images/dogVaccination.png");
vaccinetm=loadImage("images/dogVaccin.png")
hospital=loadImage("images/petHospital.jpg");
}

function setup() {
  database=firebase.database();
  createCanvas(400,500);
  
  foodObj = new Food();

  foodStock=database.ref('Food');
  foodStock.on("value",readStock);

 

  //read game state from database
  readState=database.ref('gameState');
  readState.on("value",function(data){
    gameState=data.val();
  });
   
  dog=createSprite(200,400,150,150);
  dog.addImage(happyDog);
  dog.scale=0.15;
  dog.visible=true;

  feed=createButton("Feed the dog");
  feed.position(700,95);
  feed.mousePressed(feedDog);

  addFood=createButton("Add Food");
  addFood.position(800,95);
  addFood.mousePressed(addFoods);

  Vac=createButton("Vaccination!!");
  Vac.position(650,550);
  Vac.mousePressed(vaccination);

}

function draw() {
  currentTime=hour();
  if (foodS === 0) {
    dog.addImage(dogImg);
  }
  if(frameCount%200===0 && v===1)
  {
    v=0;
    Vac.show();
  }
  fedTime=database.ref('FeedTime');
  fedTime.on("value",function(data){
    lastFed=data.val();
  });
  if(currentTime<=(lastFed+1)&&v===0){
      update("Warmup");
      foodObj.livingroom();
   }else if(currentTime===(lastFed+2)&&v===0){
    update("Playing");
      foodObj.garden();
   }
   else if(currentTime===(lastFed+3)&&v===0){
    update("Sleeping");
      foodObj.bedroom();
   }else if(currentTime>(lastFed+4) && currentTime<=(lastFed+5)&&v===0){
    update("Bathing");
      foodObj.washroom();
   }else if(v===0){
    update("Hungry")
    foodObj.display();
 
   }
   
   if(gameState!="Hungry"){
     feed.hide();
     addFood.hide();
     dog.visible=false;
   }else{
    feed.show();
    addFood.show();
   dog.visible=true;

   }
 
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}


//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  foodObj.updateFoodStock(foodObj.getFoodStock()-1);
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    FeedTime:hour(),
    gameState:"Hungry"
  })
}

//function to add food in stock
function addFoods(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}

//update gameState
function update(state){
  database.ref('/').update({
    gameState:state
  })
}

function vaccination()
{

  feed.hide();
  addFood.hide();
  Vac.hide();

  background(hospital);
 
  vaccinatn=createButton("Vaccination Schedule");
  vaccinatn.position(540,100);
  vaccinatn.mousePressed(vaccine);

  vaccinationtime=createButton("Vaccine my Dog now??");
  vaccinationtime.position(740,100);
  vaccinationtime.mousePressed(vaccinetime);


  v=1;
}


function vaccine()
{
  
  vaccinatn.hide();
  vaccinationtime.hide();

  dog.visible=false;
  background(vaccImg);
  v=1;
}
function vaccinetime()
{

  vaccinatn.hide();
  vaccinationtime.hide();


  dog.visible=false;
  background(vaccinetm);
  v=1;
}
