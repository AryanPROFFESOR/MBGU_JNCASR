
const { Engine, Render, World, Bodies, Body } = Matter;

const engine = Engine.create();
const world = engine.world;

const canvas = document.createElement("canvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
document.body.appendChild(canvas);

const render = Render.create({
  canvas: canvas,
  engine: engine,
  options: {
    width: window.innerWidth,
    height: window.innerHeight,
    wireframes: false,
    background: "transparent"
  }
});

const dnas = [];
const numDNAs = 20; // more DNAs

for (let i = 0; i < numDNAs; i++) {
  const body = Bodies.rectangle(
    Math.random() * window.innerWidth,
    Math.random() * window.innerHeight,
    80,
    80,
    {
      render: {
        sprite: {
          texture: 'DNA_IMAGE.png',
          xScale: 0.2,
          yScale: 0.2
        }
      },
      restitution: 1,
      friction: 0,
      frictionAir: 0.001
    }
  );
  Body.setVelocity(body, {
    x: (Math.random() - 0.5) * 10,
    y: (Math.random() - 0.5) * 10
  });
  dnas.push(body);
}

World.add(world, dnas);

const walls = [
  Bodies.rectangle(window.innerWidth / 2, 0, window.innerWidth, 10, { isStatic: true }),
  Bodies.rectangle(window.innerWidth / 2, window.innerHeight, window.innerWidth, 10, { isStatic: true }),
  Bodies.rectangle(0, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true }),
  Bodies.rectangle(window.innerWidth, window.innerHeight / 2, 10, window.innerHeight, { isStatic: true })
];
World.add(world, walls);

Engine.run(engine);
Render.run(render);

window.addEventListener('resize', () => {
  render.canvas.width = window.innerWidth;
  render.canvas.height = window.innerHeight;
});
