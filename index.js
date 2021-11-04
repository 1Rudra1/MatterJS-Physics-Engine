const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Bodies = Matter.Bodies;
const Body = Matter.Body;

const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

let engine;

const width = window.innerWidth;
const height = window.innerHeight;

let allObjectsArray = [];
let dominoesArray = [];
let numDominoes = width/55;
let ground;
let forceApplied = false;

function setup() {
  createCanvas(width, height);

  // create an engine
  engine = Engine.create();

  for (let index = 0; index < numDominoes; index++) {
      var rectangle = Bodies.rectangle(100 + index*40, 350, 15, 135, {
          frictionAir: 0.005,
      });
      allObjectsArray.push(rectangle);
      dominoesArray.push(rectangle);
  }

  ground = Bodies.rectangle(width/2, 500, width, 10, {
    isStatic: true, 
    // angle: Math.PI * 0.06
  });

  allObjectsArray.push(ground);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05, angularStiffness: 0 }
  }
  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();
  World.add(engine.world, mouseConstraint);

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
  
  drawMouse(mouseConstraint);
  fill(255);
  textAlign(CENTER, CENTER);
  text('Amount of Force: ' + amountForce, width/2, 50);
}

document.addEventListener("keyup", force);

function force() {
    if(!forceApplied) {
        Body.applyForce( dominoesArray[0], {x: dominoesArray[0].position.x, y: dominoesArray[0].position.y - 20}, {x: 0.025 * amountForce, y: 0});
        forceApplied = true;
    }
}

let amountForce = 1;
document.addEventListener("keydown", addForce);

function addForce() {
    amountForce ++;
}
