const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;

const drawBody = Helpers.drawBody;

let engine;

let allObjectsArray = [];
let dominoesArray = [];
let numDominoes = 13;
let boxA;
let boxB;
let ground;

function setup() {
  createCanvas(800, 600);

  // create an engine
  engine = Engine.create();

  for (let index = 0; index < numDominoes; index++) {
      var rectangle = Bodies.rectangle(100 + index*50, 400, 10, 80);
      allObjectsArray.push(rectangle);
      dominoesArray.push(rectangle);
  }

  boxA = Bodies.rectangle(400, 400, 10, 80);
  boxB = Bodies.rectangle(300, 400, 10, 80);
  ground = Bodies.rectangle(400, 500, 810, 10, {
    isStatic: true, 
    // angle: Math.PI * 0.06
  });

  allObjectsArray.push(ground);

  // add all of the bodies to the world
  World.add(engine.world, allObjectsArray);

  // run the engine
  Engine.run(engine);
}

function draw() {
  background(0);

  fill(255);
//   drawBody(boxA);
//   drawBody(boxB);

  dominoesArray.forEach(element => {
      drawBody(element);
  });

  fill(128);
  drawBody(ground);
}