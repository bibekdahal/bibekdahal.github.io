let canvas;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    initParticles();
}


let particles = [];

function initParticles() {
    // Create particles uniformly with random velocities
    particles = [];
    const numCols = 6;
    const numRows = 6;
    for (let i=0; i<numCols; i++) {
        for (let j=0; j<numRows; j++) {

            const x = i / numCols * canvas.width + canvas.width/numCols*0.5 * (j%2);
            const y = j / numRows * canvas.height;

            const vx = (Math.random()*2-1)/2;
            const vy = (Math.random()*2-1)/2;
            const va = (Math.random()*2-1)*1.23;
            const angle =  Math.random()*200;
            const sx = 0.7;//Math.random()*1.2;
            const sy = 0.7;//Math.random()*1.2;
            const sides = 6; //parseInt(Math.random()*(6-3)+3);
            const alpha = Math.random()*0.5;
            const valpha = 0.004*0.5;

            particles.push({
                x: x + canvas.width/numCols*0.25, y: y + canvas.height/numRows*0.25,
                vx: vx, vy: vy, angle: angle, va: va,
                sx: sx, sy: sy, sides: sides, alpha: alpha, valpha: valpha,
                connector: (i%2 == 0 || j%2 == 0)
            });
        }
    }
}

function draw() {
    const canvas = document.getElementById("the-canvas");
    const context = canvas.getContext("2d");
    context.clearRect(0, 0, canvas.width, canvas.height);

    for (let i=0; i<particles.length; i++) {
        const particle = particles[i];
        // Draw each particle
        context.beginPath();
        // context.arc(particle.x, particle.y, 5, 0, 2 * Math.PI, false);
        context.save();
        context.fillStyle = 'rgba(255,255,255,' + particle.alpha + ')';
        context.translate(particle.x, particle.y);
        context.rotate(particle.angle*Math.PI/180);
        context.scale(particle.sx, particle.sy);
        // context.fillRect(-4, -4, 8, 8);

        context.beginPath();
        context.moveTo (-4 +  8 * Math.cos(0), -4 +  8 *  Math.sin(0));
        for (let k=1; k <= particle.sides; k++) {
            context.lineTo (-4 + 8 * Math.cos(k * 2 * Math.PI / particle.sides), -4 + 8 * Math.sin(k * 2 * Math.PI / particle.sides));
        }
        context.fill();

        context.restore();

        // For connectors, connect with three nearest points
        if (particle.connector) {
            let minDist1 = canvas.width;
            let minParticle1;
            for (let j=0; j<particles.length; j++) {
                const dist = Math.abs(particles[j].x - particle.x) + Math.abs(particles[j].y - particle.y);
                if (minDist1 > dist) {
                    minDist1 = dist;
                    minParticle1 = particles[j];
                }
            }

            let minDist2 = canvas.width;
            let minParticle2;
            for (let j=0; j<particles.length; j++) {
                const dist = Math.abs(particles[j].x - particle.x) + Math.abs(particles[j].y - particle.y);
                if (minDist2 > dist && particles[j] != minParticle1) {
                    minDist2 = dist;
                    minParticle2 = particles[j];
                }
            }

            let minDist3 = canvas.width;
            let minParticle3;
            for (let j=0; j<particles.length; j++) {
                const dist = Math.abs(particles[j].x - particle.x) + Math.abs(particles[j].y - particle.y);
                if (minDist2 > dist && particles[j] != minParticle1 && particles[j] != minParticle2) {
                    minDist3 = dist;
                    minParticle3 = particles[j];
                }
            }

            context.beginPath();
            context.strokeStyle = 'rgba(255,255,255,0.1)';
            if (minParticle1) {
                context.moveTo(particle.x, particle.y);
                context.lineTo(minParticle1.x, minParticle1.y);
            }
            if (minParticle2) {
                context.moveTo(particle.x, particle.y);
                context.lineTo(minParticle2.x, minParticle2.y);
            }
            if (minParticle3) {
                context.moveTo(particle.x, particle.y);
                context.lineTo(minParticle3.x, minParticle3.y);
            }
            context.stroke();
        }

        // Animate by velocity
        particle.x += particle.vx;
        particle.y += particle.vy;
        if (particle.x < 0 || particle.x >= canvas.width)
            particle.vx *= -1;
        if (particle.y < 0 || particle.y >= canvas.height)
            particle.vy *= -1;
        particle.angle += particle.va;

        particle.alpha += particle.valpha;
        if (particle.alpha <= 0 || particle.alpha >= 0.5)
            particle.valpha *= -1;
    }

    window.setTimeout(draw, 1000/60);
}

$(document).ready(() => {
  canvas = document.getElementById("the-canvas");
  window.addEventListener('resize', resizeCanvas, false);
  resizeCanvas();
  draw();
});
