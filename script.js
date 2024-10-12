const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
canvas.width = 300;
canvas.height = 500;

const grid = 50;
const images = [
    'https://i.imgur.com/339wcBE.png', // Fertilizer
    'https://i.imgur.com/llcQlqI.png', // Green Head
    'https://i.imgur.com/UaSzf5z.png', // Clown
    'https://i.imgur.com/C0QUUdq.png', // Pig Head
    'https://i.imgur.com/C9A5LoF.png', // Big Pig
    'https://i.imgur.com/m8hoi5S.png'  // Starry Eye
];
let materials = [];
let currentMaterial;

function loadImage(src) {
    const img = new Image();
    img.src = src;
    return img;
}

const loadedImages = images.map(loadImage);

function createMaterial() {
    return {
        x: Math.floor(Math.random() * (canvas.width / grid)) * grid,
        y: 0,
        type: 0
    };
}

function drawMaterial(material) {
    ctx.drawImage(loadedImages[material.type], material.x, material.y, grid, grid);
}

function drawMaterials() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    materials.forEach(drawMaterial);
    if (currentMaterial) drawMaterial(currentMaterial);
}

function moveMaterial(offsetX) {
    if (currentMaterial) {
        currentMaterial.x += offsetX;
        if (currentMaterial.x < 0) currentMaterial.x = 0;
        if (currentMaterial.x > canvas.width - grid) currentMaterial.x = canvas.width - grid;
    }
}

function update() {
    if (!currentMaterial) {
        currentMaterial = createMaterial();
    } else {
        currentMaterial.y += grid;
        if (currentMaterial.y >= canvas.height) {
            materials.push(currentMaterial);
            currentMaterial = null;
        }
    }

    checkCombinations();
    drawMaterials();
}

function checkCombinations() {
    const positions = {};
    materials.forEach(material => {
        const key = `${material.x},${material.y}`;
        if (!positions[key]) positions[key] = [];
        positions[key].push(material);
    });

    for (const key in positions) {
        if (positions[key].length >= 3) {
            const type = positions[key][0].type;
            const x = positions[key][0].x;
            const y = positions[key][0].y;

            if (type < 4) {
                materials = materials.filter(m => !positions[key].includes(m));
                materials.push({ x, y, type: type + 1 });
            } else if (type === 4) { // Big Pig to Starry Eye
                materials = materials.filter(m => !positions[key].includes(m));
                materials.push({ x, y, type: 5 });
            } else if (type === 5) { // Starry Eye elimination
                materials = materials.filter(m => !positions[key].includes(m));
            }
        }
    }
}

setInterval(update, 1000);

document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowLeft') {
        moveMaterial(-grid);
    } else if (event.key === 'ArrowRight') {
        moveMaterial(grid);
    }
});

canvas.addEventListener('touchstart', (event) => {
    const touchX = event.touches[0].clientX - canvas.offsetLeft;
    if (touchX < currentMaterial.x) {
        moveMaterial(-grid);
    } else {
        moveMaterial(grid);
    }
});