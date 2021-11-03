const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const drawBody = Helpers.drawBody;

let engine;

let allObjectsArray = [];
let dominoesArray = [];
let numDominoes = screen.availWidth/55;
let ground;

function setup() {
  createCanvas(screen.availWidth, screen.availHeight);

  // create an engine
  engine = Engine.create();

  for (let index = 0; index < numDominoes; index++) {
      var rectangle = Bodies.rectangle(100 + index*40, 350, 15, 135, {
          frictionAir: 0.005,
      });
      allObjectsArray.push(rectangle);
      dominoesArray.push(rectangle);
  }

  ground = Bodies.rectangle(screen.availWidth/2, 500, screen.availWidth, 10, {
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

document.getElementById("button").onclick = force;

function force() {
    console.log("Here");
    Body.applyForce( dominoesArray[0], {x: dominoesArray[0].position.x, y: dominoesArray[0].position.y - 10}, {x: 0.025, y: 0});
}