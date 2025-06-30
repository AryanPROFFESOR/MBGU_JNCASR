// Load Matter.js modules
const Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      World = Matter.World,
      Bodies = Matter.Bodies,
      Body = Matter.Body,
      Events = Matter.Events,
      Constraint = Matter.Constraint,
      Composite = Matter.Composite;

const engine = Engine.create();
const world = engine.world;

// Create renderer
const render = Render.create({
  element: document.body,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    background: '#ffffff',
    wireframes: false,
    pixelRatio: window.devicePixelRatio
  }
});

// Create DNA bodies
const dnaBodies = [];
const connections = [];

for (let i = 0; i < 15; i++) {
  let dna = Bodies.circle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    30,
    {
      restitution: 1,
      friction: 0,
      frictionAir: 0,
      render: {
        sprite: {
          texture: "DNA_IMAGE.png",
          xScale: 0.15,
          yScale: 0.15
        }
      }
    }
  );
  dnaBodies.push(dna);
}

// Add DNA to world
World.add(world, dnaBodies);

// Walls
const walls = [
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true }),
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true }),
  Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true }),
  Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true })
];
World.add(world, walls);

// Create "connection" constraints when DNAs are close
Events.on(engine, 'afterUpdate', function () {
  connections.forEach(c => Composite.remove(world, c));
  connections.length = 0;

  for (let i = 0; i < dnaBodies.length; i++) {
    for (let j = i + 1; j < dnaBodies.length; j++) {
      let dx = dnaBodies[i].position.x - dnaBodies[j].position.x;
      let dy = dnaBodies[i].position.y - dnaBodies[j].position.y;
      let dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < 150) {
        const constraint = Constraint.create({
          bodyA: dnaBodies[i],
          bodyB: dnaBodies[j],
          length: dist,
          stiffness: 0.001,
          render: {
            visible: true,
            lineWidth: 1,
            strokeStyle: '#000000'
          }
        });
        connections.push(constraint);
        Composite.add(world, constraint);
      }
    }
  }
});

// Run engine & renderer
Engine.run(engine);
Render.run(render);

// Runner to keep it smooth
const runner = Runner.create();
Runner.run(runner, engine);

// Resize handler
window.addEventListener("resize", function () {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});
