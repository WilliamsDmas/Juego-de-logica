
let nodes = [];
let selectedNode = null;
let currentLevel = 0;
let totalCost = 0;
let targetCost = 0;
let levelComplete = false;
let particles = [];

const levels = [
    {
        name: "Conceptos Básicos",
        warehouses: [{ x: 100, y: 100, label: 'A1' }],
        clients: [
            { x: 500, y: 300, label: 'C1' },
            { x: 300, y: 500, label: 'C2' }
        ],
        target: 450
    },
    {
        name: "Distribución Central",
        warehouses: [{ x: 100, y: 100, label: 'A1' }],
        clients: [
            { x: 100, y: 500, label: 'C1' },
            { x: 700, y: 500, label: 'C2' },
            { x: 400, y: 100, label: 'C3' },
            { x: 700, y: 100, label: 'C4' }
        ],
        target: 950
    },
    {
        name: "Red Compleja",
        warehouses: [
            { x: 100, y: 100, label: 'A1' },
            { x: 700, y: 500, label: 'A2' }
        ],
        clients: [
            { x: 200, y: 300, label: 'C1' },
            { x: 400, y: 200, label: 'C2' },
            { x: 600, y: 400, label: 'C3' },
            { x: 400, y: 500, label: 'C4' },
            { x: 100, y: 500, label: 'C5' }
        ],
        target: 800
    },
    {
        name: "Corredor Industrial",
        warehouses: [
            { x: 400, y: 100, label: 'A1' }
        ],
        clients: [
            { x: 100, y: 200, label: 'C1' },
            { x: 100, y: 400, label: 'C2' },
            { x: 700, y: 200, label: 'C3' },
            { x: 700, y: 400, label: 'C4' },
            { x: 400, y: 300, label: 'C5' },
            { x: 400, y: 500, label: 'C6' }
        ],
        target: 1150
    },
    {
        name: "Expansión Metropolitana",
        warehouses: [
            { x: 200, y: 300, label: 'A1' },
            { x: 600, y: 300, label: 'A2' }
        ],
        clients: [
            { x: 100, y: 100, label: 'C1' },
            { x: 100, y: 500, label: 'C2' },
            { x: 350, y: 100, label: 'C3' },
            { x: 350, y: 500, label: 'C4' },
            { x: 450, y: 100, label: 'C5' },
            { x: 450, y: 500, label: 'C6' },
            { x: 700, y: 100, label: 'C7' },
            { x: 700, y: 500, label: 'C8' }
        ],
        target: 1450
    },
    {
        name: "El Gran Desafío Logístico",
        warehouses: [
            { x: 100, y: 100, label: 'A1' },
            { x: 400, y: 300, label: 'A2' },
            { x: 700, y: 500, label: 'A3' }
        ],
        clients: [
            { x: 100, y: 300, label: 'C1' },
            { x: 100, y: 500, label: 'C2' },
            { x: 300, y: 100, label: 'C3' },
            { x: 300, y: 500, label: 'C4' },
            { x: 500, y: 100, label: 'C5' },
            { x: 500, y: 500, label: 'C6' },
            { x: 700, y: 100, label: 'C7' },
            { x: 700, y: 300, label: 'C8' },
            { x: 400, y: 100, label: 'C9' },
            { x: 400, y: 500, label: 'C10' }
        ],
        target: 1650
    }
];

function setup() {
    const container = document.getElementById('canvas-wrapper');
    const canvas = createCanvas(800, 600);
    canvas.parent('canvas-wrapper');
    initLevel(0);
}

function initLevel(index) {
    currentLevel = index;
    levelComplete = false;
    nodes = [];

    const lvl = levels[index];

    // Add warehouses
    lvl.warehouses.forEach(w => {
        nodes.push({ ...w, type: 'warehouse', color: '#00d2ff' });
    });

    // Add clients
    lvl.clients.forEach(c => {
        nodes.push({ ...c, type: 'client', color: '#ff4b2b' });
    });

    targetCost = lvl.target;
    document.getElementById('levelDisplay').textContent = index + 1;
    // Add level name display
    const levelTitle = document.querySelector('.logo span') || { textContent: '' };
    // Wait, let's just update the sub-logo or add a new element
    document.querySelector('.sub-logo').textContent = lvl.name;

    document.getElementById('targetCost').textContent = targetCost.toFixed(0);
    document.getElementById('nextLevelBtn').style.display = 'none';
    document.getElementById('victory-modal').style.display = 'none';
}

function draw() {
    clear();
    background(15, 23, 42, 0); // Transparent to show CSS background

    // Draw active connections with glow
    drawConnections();

    // Draw nodes
    for (let node of nodes) {
        drawNode(node);
    }

    // Update Score
    calculateScore();

    // Draw particles
    updateParticles();

    // Check for "victory" nearby
    if (totalCost <= targetCost * 1.05 && !levelComplete) {
        showVictory();
    }
}

function drawConnections() {
    strokeWeight(2);
    for (let i = 0; i < nodes.length; i++) {
        if (nodes[i].type === 'warehouse') {
            for (let j = 0; j < nodes.length; j++) {
                if (nodes[j].type === 'client') {
                    // Check if this warehouse is the closest to this client (for multi-warehouse levels)
                    if (isClosestWarehouse(nodes[i], nodes[j])) {
                        let d = dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);

                        // Connection color based on distance
                        let opacity = map(d, 0, 800, 255, 50);
                        stroke(0, 210, 255, opacity);

                        // Animated pulse line
                        line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);

                        // Draw moving pulse
                        let pulsePos = (frameCount * 0.02) % 1;
                        let px = lerp(nodes[i].x, nodes[j].x, pulsePos);
                        let py = lerp(nodes[i].y, nodes[j].y, pulsePos);
                        noStroke();
                        fill(0, 210, 255, 200);
                        circle(px, py, 4);
                    }
                }
            }
        }
    }
}

function isClosestWarehouse(warehouse, client) {
    let d = dist(warehouse.x, warehouse.y, client.x, client.y);
    for (let other of nodes) {
        if (other.type === 'warehouse' && other !== warehouse) {
            if (dist(other.x, other.y, client.x, client.y) < d) {
                return false;
            }
        }
    }
    return true;
}

function drawNode(node) {
    push();
    // Shadow/Glow
    drawingContext.shadowBlur = 15;
    drawingContext.shadowColor = node.color;

    fill(node.color);
    noStroke();
    circle(node.x, node.y, node === selectedNode ? 40 : 30);

    // Icon/Letter
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(12);
    textStyle(BOLD);
    text(node.label, node.x, node.y);

    // Label above
    fill(255, 150);
    textSize(10);
    text(node.type === 'warehouse' ? 'ALMACÉN' : 'CLIENTE', node.x, node.y - 25);
    pop();
}

function calculateScore() {
    let currentTotal = 0;

    // For each client, find distance to closest warehouse
    const clients = nodes.filter(n => n.type === 'client');
    const warehouses = nodes.filter(n => n.type === 'warehouse');

    clients.forEach(c => {
        let minDist = Infinity;
        warehouses.forEach(w => {
            let d = dist(c.x, c.y, w.x, w.y);
            if (d < minDist) minDist = d;
        });
        currentTotal += minDist;
    });

    totalCost = currentTotal;
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);

    // Color logic for cost
    const costElement = document.getElementById('totalCost');
    if (totalCost <= targetCost * 1.05) {
        costElement.style.color = '#4ade80'; // Success green
    } else if (totalCost <= targetCost * 1.5) {
        costElement.style.color = '#fbbf24'; // Warning yellow
    } else {
        costElement.style.color = '#00d2ff'; // Default primary
    }
}

function mousePressed() {
    for (let node of nodes) {
        if (node.type === 'warehouse' && dist(mouseX, mouseY, node.x, node.y) < 25) {
            selectedNode = node;
            spawnParticles(node.x, node.y, node.color);
            break;
        }
    }
}

function mouseDragged() {
    if (selectedNode) {
        selectedNode.x = constrain(mouseX, 0, width);
        selectedNode.y = constrain(mouseY, 0, height);
        if (frameCount % 5 === 0) spawnParticles(selectedNode.x, selectedNode.y, selectedNode.color);
    }
}

function mouseReleased() {
    selectedNode = null;
}

function showVictory() {
    levelComplete = true;
    const score = Math.max(0, Math.min(100, Math.round((targetCost / totalCost) * 100)));
    document.getElementById('finalScore').textContent = score;
    document.getElementById('victory-modal').style.display = 'flex';
    document.getElementById('nextLevelBtn').style.display = 'block';

    // Big explosion
    for (let i = 0; i < 50; i++) spawnParticles(width / 2, height / 2, '#00d2ff');
}

// Particle System
function spawnParticles(x, y, color) {
    for (let i = 0; i < 5; i++) {
        particles.push({
            x: x,
            y: y,
            vx: random(-2, 2),
            vy: random(-2, 2),
            alpha: 255,
            color: color,
            size: random(2, 6)
        });
    }
}

function updateParticles() {
    for (let i = particles.length - 1; i >= 0; i--) {
        let p = particles[i];
        p.x += p.vx;
        p.y += p.vy;
        p.alpha -= 5;
        if (p.alpha <= 0) {
            particles.splice(i, 1);
        } else {
            noStroke();
            let c = color(p.color);
            c.setAlpha(p.alpha);
            fill(c);
            circle(p.x, p.y, p.size);
        }
    }
}

// Event Listeners
document.getElementById('resetBtn').addEventListener('click', () => {
    initLevel(currentLevel);
});

document.getElementById('nextLevelBtn').addEventListener('click', () => {
    if (currentLevel < levels.length - 1) {
        initLevel(currentLevel + 1);
    } else {
        alert("¡Felicidades! Has completado todos los niveles.");
        initLevel(0);
    }
});

document.getElementById('modalNextBtn').addEventListener('click', () => {
    document.getElementById('nextLevelBtn').click();
});
