// Cena, câmera e renderizador
let scene = new THREE.Scene();
let camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
let renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Adicionando uma luz ambiente
let ambientLight = new THREE.AmbientLight(0x404040, 2); // Luz suave
scene.add(ambientLight);

// Adicionando uma luz direcional
let directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 5).normalize();
scene.add(directionalLight);

// Criar o Wall-E (um cubo amarelo)
let geometry = new THREE.BoxGeometry(1, 1, 1); // Forma do cubo
let material = new THREE.MeshStandardMaterial({ color: 0xFFFF00 }); // Cor amarela
let wallE = new THREE.Mesh(geometry, material);
wallE.position.set(-2, 0, 0); // Posição do Wall-E
scene.add(wallE);

// Criar a Eve (um cubo branco)
let eveMaterial = new THREE.MeshStandardMaterial({ color: 0xFFFFFF }); // Cor branca
let eve = new THREE.Mesh(geometry, eveMaterial);
eve.position.set(2, 0, 0); // Posição da Eve
scene.add(eve);

// Criar os objetos de lixo (esferas)
let trashGeometry = new THREE.SphereGeometry(0.2, 32, 32);
let trashMaterial = new THREE.MeshStandardMaterial({ color: 0x00FF00 }); // Cor verde para o lixo
let trash = new THREE.Mesh(trashGeometry, trashMaterial);

// Variáveis para controlar o jogo
let holdingTrash = false; // Se Wall-E está segurando lixo
let currentTrash = null;  // Lixo atual que Wall-E está segurando

// Função para criar lixo em posições aleatórias
function createTrash() {
    let trashCopy = trash.clone();
    trashCopy.position.set(
        Math.random() * 6 - 3, // Aleatório entre -3 e 3
        0.5, 
        Math.random() * 6 - 3 // Aleatório entre -3 e 3
    );
    scene.add(trashCopy);
}

// Criar alguns itens de lixo na cena
for (let i = 0; i < 5; i++) {
    createTrash();
}

// Definir a posição da câmera
camera.position.z = 5;

// Controle de movimento com as teclas
let moveSpeed = 0.1;
let keys = {
    left: false,
    right: false,
    up: false,
    down: false
};

window.addEventListener('keydown', (event) => {
    if (event.key === "ArrowLeft") keys.left = true;
    if (event.key === "ArrowRight") keys.right = true;
    if (event.key === "ArrowUp") keys.up = true;
    if (event.key === "ArrowDown") keys.down = true;
    if (event.key === "e" || event.key === "E") pickUpTrashOrDeliver(); // Tecla E para pegar ou entregar lixo
});

window.addEventListener('keyup', (event) => {
    if (event.key === "ArrowLeft") keys.left = false;
    if (event.key === "ArrowRight") keys.right = false;
    if (event.key === "ArrowUp") keys.up = false;
    if (event.key === "ArrowDown") keys.down = false;
});

// Função para pegar ou entregar lixo
function pickUpTrashOrDeliver() {
    if (holdingTrash) {
        // Entregar o lixo para Eve se Wall-E estiver perto
        let distanceToEve = wallE.position.distanceTo(eve.position);
        if (distanceToEve < 2) {
            holdingTrash = false;
            eve.material.color.set(0xADD8E6); // Eve brilha em azul quando recebe o lixo
            setTimeout(() => {
                eve.material.color.set(0xFFFFFF); // Volta a cor normal
            }, 300);
            scene.remove(currentTrash); // Remover lixo da cena
            createTrash(); // Criar novo lixo
        }
    } else {
        // Pegar o lixo
        let trashMeshes = scene.children.filter(child => child.geometry && child.geometry.type === 'SphereGeometry');
        trashMeshes.forEach(trash => {
            let dist = wallE.position.distanceTo(trash.position);
            if (dist < 1) {
                holdingTrash = true;
                currentTrash = trash;
                trash.position.set(wallE.position.x, wallE.position.y, wallE.position.z); // Mover o lixo para Wall-E
            }
        });
    }
}

// Função de animação
function animate() {
    requestAnimationFrame(animate);

    // Movimento do Wall-E
    if (keys.left) wallE.position.x -= moveSpeed;
    if (keys.right) wallE.position.x += moveSpeed;
    if (keys.up) wallE.position.z -= moveSpeed;
    if (keys.down) wallE.position.z += moveSpeed;

    renderer.render(scene, camera);
}

animate();
