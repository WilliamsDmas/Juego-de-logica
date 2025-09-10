

//usamos p5.js para el lienzo interactivo
let nodes = [];
let selectedNode = null;
function setup() {
    let canvas = createCanvas(800, 600);
    canvas.parent('gameCanvas');
    //crear  nodos: alamacenes (azules) y clientes (rojos)
    nodes.push({x: 100, y: 100, type: 'almacen', label: 'A1'});
    nodes.push({x: 500, y: 300, type: 'cliente', label: 'C1'});
    nodes.push({x: 300, y: 200, type: 'cliente', label: 'C2'});

}
function draw() {
    background(220);
    //dibujar conecciones entre nodos
    for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
        if (nodes[i].type === 'almacen' && nodes[j].type === 'cliente')
            stroke(0);
            line(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
        }
    }
    //dibujar nodos
    for (let node of nodes) {
        fill(node.type === 'almacen' ? 'blue' : 'red');
        ellipse(node.x, node.y, 30, 30);
        fill(0);
        text(node.label, node.x - 10, node.y - 20);
    }
    //calcula costo total(distancia euclidiana como proxy)
    let totalCost = 0;
    for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
            if (nodes[i].type === 'almacen' && nodes[j].type === 'cliente') {
                totalCost += dist(nodes[i].x, nodes[i].y, nodes[j].x, nodes[j].y);
            }
        }
    }
    document.getElementById('totalCost').textContent = totalCost.toFixed(2);
}
function mousePressed() {
    for (let node of nodes) {
        if (dist(mouseX, mouseY, node.x, node.y) < 15) {
            selectedNode = node;
            break;
        }
    }
}
function mouseDragged() {
    if (selectedNode) {
        selectedNode.x = mouseX;
        selectedNode.y = mouseY;
    }
}
function mouseReleased() {
    selectedNode = null;
}
//reiniciar el juego
document.getElementById('resetButton').addEventListener('click', () => {
    nodes = [
        {x: 100, y: 100, type: 'almacen', label: 'A1'},
        {x: 500, y: 300, type: 'cliente', label: 'C1'},
        {x: 300, y: 200, type: 'cliente', label: 'C2'}
    ]
});