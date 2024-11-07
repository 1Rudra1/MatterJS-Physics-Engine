const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Mouse = Matter.Mouse;
const MouseConstraint = Matter.MouseConstraint;
const Bodies = Matter.Bodies;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;
const Constraint = Matter.Constraint;
const Events = Matter.Events;


const drawBodies = Helpers.drawBodies;
const drawConstraints = Helpers.drawConstraints;
const drawBody = Helpers.drawBody;
const drawMouse = Helpers.drawMouse;

const width = window.innerWidth;
const height = window.innerHeight;

let engine;
let allObjectsArray = [];
let dominoesArray = [];
let numDominoes = 15;
let ground;
let initialBall;
let forceApplied = false;
let pend;
let pendConstraint;
let rampdown;
let antiramp;
let bridge;
let catapult;
let square;
let boxes;
let boxes1;
let ground3;
let wall
let catapultSpacer;
let noGravity = false;
let carramp1;
let carramp2;
let carramp3;
let carramp4;
let carramp5;
var car, car2;


function setup() {
  createCanvas(6000, 3000);

  // create an engine
  engine = Engine.create();

  // add boxes
  // xx, yy, columns, rows, columnGap, rowGap
  boxes = Composites.stack(2800, 1360, 3, 4, 8, 3, function(x, y) {
    return Bodies.rectangle(x, y, 50, 50);
  });

  for (let index = 0; index < numDominoes; index++) {
      var rectangle = Bodies.rectangle(100 + index*40, 350, 15, 135, {
          frictionAir: 0.005,
      });
      allObjectsArray.push(rectangle);
      dominoesArray.push(rectangle);
  }

  initialBall = Bodies.circle(845, 10, 25, 10);
  ground = Bodies.rectangle(450, 500, 800, 10, {
    isStatic: true, 
    // angle: Math.PI * 0.06
  });

  catapultSpacer = Bodies.rectangle(2580, 1330, 10, 50, {isStatic: true });
  catapult = Bodies.rectangle(400, 520, 200, 10);
  constraint = Constraint.create({
    pointA: {x: 2670, y: 1300},
    bodyB: catapult,
    stiffness: 1,
    length: 0
  });

  if(initialBall.position.x<=2550){
    boxes1 = Composites.stack(3800, 100, 9, 9, 1, 2, function(x, y) {
      fill(255, 0, 0)
      return Bodies.rectangle(x, y, 50, 50);
    });
  }


  ground3 = Bodies.rectangle(4000, 600, 810, 30, {isStatic: true});
  wall = Bodies.rectangle(4000,100,810,30,{isStatic: true});
  rampdown = Bodies.rectangle(1150,660,650,20, {isStatic: true, angle: Math.PI * 0.15}); 
  antiramp = Bodies.rectangle(2300, 150, 650, 20, {isStatic: true, angle: Math.PI * -0.11, friction: 0.4});
  trampolineA = Bodies.rectangle(1960, 1160, 250, 70, {isStatic: true});
  ground2 = Bodies.rectangle(2850, 1560, 250, 70, {isStatic: true});
  square = Bodies.rectangle(2600,1260,40,40,{isStatic: false});
  carramp1 = Bodies.rectangle(4500, 2100, 1100, 10, {isStatic: true, angle: Math.PI * -0.05,friction: 0.4});
  carramp2 = Bodies.rectangle(3800, 1650, 800, 10, {isStatic: true, angle: Math.PI * 0.045, friction: 0.1});
  carramp3 = Bodies.rectangle(3800, 2500, 700, 10, {isStatic: true, angle: Math.PI * -0.85, friction: 0.01});
  carramp4 = Bodies.rectangle(3300,1595,200,10,{isStatic: true});
  carramp5 = Bodies.rectangle(4500,2500,200,10,{isStatic: true, friction: 2.0});
  car = Composites.car(400, 700, 100, 30, 20);
  car2 = Composites.car(700, 100, 100, 30, 20);






  trampolineA.restitution = 2;

  allObjectsArray.push(ground);

  // setup mouse
  let mouse = Mouse.create(canvas.elt);
  let mouseParams = {
    mouse: mouse,
    constraint: { stiffness: 0.05 }
  }

  mouseConstraint = MouseConstraint.create(engine, mouseParams);
  mouseConstraint.mouse.pixelRatio = pixelDensity();

  Events.on(engine, 'beforeUpdate', function() {
    var gravity = engine.world.gravity;

    if (noGravity) {
        Body.applyForce(square, square.position, {
            x: -gravity.x * gravity.scale * square.mass,
            y: -gravity.y * gravity.scale * square.mass
        });
        // Composites.applyForce(boxes,boxes.position,{
        //   x: -gravity.x * gravity.scale * boxes.mass,
        //   y: -gravity.y * gravity.scale * boxes.mass
        // });
    }
});

  
  // add all of the bodies to the world
  World.add(engine.world, allObjectsArray);
  World.add(engine.world, [initialBall, rampdown, trampolineA, antiramp, boxes, ground2, boxes1, ground3, wall, catapultSpacer,square, carramp1,carramp2,carramp3, carramp4,carramp5,car2]);
  World.add(engine.world, [catapult, constraint]);


  createBridge()

  // run the engine
  Engine.run(engine);
}

function createBridge(){
  // add bridge
  const group = Body.nextGroup(true);
  const rects = Composites.stack(1500, 800, 10, 1, 10, 10, function(x, y) {
      return Bodies.rectangle(x, y, 50, 60, { collisionFilter: { group: group } });
  });
  bridge = Composites.chain(rects, 0.3, 0, -0.5, 0, {stiffness: 1.4, length: 3.0, render: {type: 'line'}});
  World.add(engine.world, [bridge]);

  // left and right fix point of bridge
  Composite.add(rects, Constraint.create({
    pointA: {x: 1380, y: 780},
    bodyB: rects.bodies[0],
    pointB: {x: -0, y: 0},
    stiffness: 0.1
  }));
  Composite.add(rects, Constraint.create({
    pointA: {x: 2200, y: 1200},
    bodyB: rects.bodies[rects.bodies.length-1],
    pointB: {x: 5, y: 4},
    stiffness: 0.02
  }));
}


function getCar(xx, yy, width, height, wheelSize) {
  var Body = Matter.Body,
      Bodies = Matter.Bodies,
      Composite = Matter.Composite,
      Constraint = Matter.Constraint;

  var group = Body.nextGroup(true),
      wheelBase = 20,
      wheelAOffset = -width * 0.5 + wheelBase,
      wheelBOffset = width * 0.5 - wheelBase,
      wheelYOffset = 0;

  var car = Composite.create({ label: 'Car' }),
      body = Bodies.rectangle(xx, yy, width, height, { 
          collisionFilter: {
              group: group
          },
          chamfer: {
              radius: height * 0.5
          },
          density: 0.0002
      });

  var wheelA = Bodies.circle(xx + wheelAOffset, yy + wheelYOffset, wheelSize, { 
      collisionFilter: {
          group: group
      },
      friction: 0.8
  });
              
  var wheelB = Bodies.circle(xx + wheelBOffset, yy + wheelYOffset, wheelSize, { 
      collisionFilter: {
          group: group
      },
      friction: 0.8
  });
              
  var axelA = Constraint.create({
      bodyB: body,
      pointB: { x: wheelAOffset, y: wheelYOffset },
      bodyA: wheelA,
      stiffness: 1,
      length: 0
  });
                  
  var axelB = Constraint.create({
      bodyB: body,
      pointB: { x: wheelBOffset, y: wheelYOffset },
      bodyA: wheelB,
      stiffness: 1,
      length: 0
  });
  
  Composite.addBody(car, body);
  Composite.addBody(car, wheelA);
  Composite.addBody(car, wheelB);
  Composite.addConstraint(car, axelA);
  Composite.addConstraint(car, axelB);

  return car;
};

function draw() {
  background(0);

  dominoesArray.forEach(element => {
      drawBody(element);
  });

  drawBodies(boxes.bodies);
  drawBodies(bridge.bodies);
  stroke(128);
  strokeWeight(2);
  drawConstraints(bridge.constraints);

  fill(128);
  drawBody(ground);
  drawBody(ground2);
  drawMouse(mouseConstraint);
  drawBody(initialBall);
  drawBody(rampdown);
  drawBody(trampolineA);
  drawBody(antiramp);
  drawBody(catapult);
  drawBody(catapultSpacer);
  drawBody(square);
  drawBody(carramp1);
  drawBody(carramp2);
  drawBody(carramp3);
  drawBody(carramp4);


  stroke(128);
  strokeWeight(1);
  fill(255, 0, 0);
  drawBodies(boxes1.bodies);
  noStroke();

  fill(128);
  drawBody(ground3);
  drawBody(wall);


  // console.error(Matter.setStatic(square,false));
  if(initialBall.position.x>=2000 && initialBall.position.x<=2550){
    engine.world.gravity.y = -1.5;
    noGravity = true;
    // Matter.Body.setMass(square,0);
    // Matter.Body.setStatic(square,true);
  }
  else{
    engine.world.gravity.y = 0.9;
    // Matter.Body.setStatic(square,false);
    // Matter.Body.setMass(square,1);
  } 
}

document.addEventListener("keyup", force);

function force() {
    if(!forceApplied) {
        Body.applyForce( dominoesArray[0], {x: dominoesArray[0].position.x, y: dominoesArray[0].position.y}, {x: 0.025 * amountForce, y: 0});
        forceApplied = true;
    }
}

let amountForce = 1;
document.addEventListener("keydown", addForce);

function addForce() {
    amountForce ++;
}
