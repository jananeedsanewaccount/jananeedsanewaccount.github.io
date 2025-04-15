// Game constants
const GAME_WIDTH = 800;
const GAME_HEIGHT = 600;
const PLAYER_SIZE = 60;
const PRESENT_SIZE = 40;
const PLAYER_SPEED = 5;
const GAME_DURATION = 28; // seconds
const PRESENT_COUNT = 10;

// Game variables
let canvas, ctx;
let player;
let presents = [];
let score = 0;
let timer = GAME_DURATION;
let gameState = 'start'; // start, playing, end
let timerInterval;
let highestScore = 0;

let tree = {
    x: Math.random() * GAME_WIDTH,
    y: Math.random() * GAME_HEIGHT,
    width: 50,
    height: 50,
    speed: 10,
    direction: Math.random() * 2 * Math.PI, // Direction in radians (0 to 2 * PI)
    directionChangeInterval: 680, // Time in ms to change direction
    lastDirectionChange: Date.now(),
    image: new Image()
};


tree.image.src = 'assets/birch-tree.png'; // Set the path to your tree image


// Key states
const keys = {
    ArrowUp: false,
    ArrowDown: false,
    ArrowLeft: false,
    ArrowRight: false,
    w: false,
    a: false,
    s: false,
    d: false
};

// Initialize the game
window.onload = function() {
    canvas = document.getElementById('gameCanvas');
    canvas.width = GAME_WIDTH;
    canvas.height = GAME_HEIGHT;
    ctx = canvas.getContext('2d');
    
    // Set up event listeners
    document.getElementById('start-button').addEventListener('click', startGame);
    document.getElementById('restart-button').addEventListener('click', restartGame);
    
    // Set up keyboard controls
    window.addEventListener('keydown', function(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = true;
            e.preventDefault();
        }
    });
    
    window.addEventListener('keyup', function(e) {
        if (keys.hasOwnProperty(e.key)) {
            keys[e.key] = false;
            e.preventDefault();
        }
    });
    
    // Create walrus player
    createWalrusPlayer();
};

// Create walrus player
// Create walrus player
function createWalrusPlayer() {
    player = {
        x: GAME_WIDTH / 2 - PLAYER_SIZE / 2, // Always in the center of the screen
        y: GAME_HEIGHT / 2 - PLAYER_SIZE / 2,
        width: PLAYER_SIZE,
        height: PLAYER_SIZE,
        speed: PLAYER_SPEED,
        image: new Image()
    };

    // Use the walrus image (make sure it's loaded properly)
    player.image.src = walrusDataURL;
}


// Create presents
function createPresents() {
    presents = [];
    
    for (let i = 0; i < PRESENT_COUNT; i++) {
        const present = {
            x: Math.random() * (GAME_WIDTH - PRESENT_SIZE),
            y: Math.random() * (GAME_HEIGHT - PRESENT_SIZE),
            width: PRESENT_SIZE,
            height: PRESENT_SIZE,
            collected: false,
            image: new Image()
        };
        
        // Use the present SVG image from present.js
        present.image.src = presentDataURL;
        
        // Make sure presents don't spawn on top of player
        const playerCenterX = player.x + player.width / 2;
        const playerCenterY = player.y + player.height / 2;
        const presentCenterX = present.x + present.width / 2;
        const presentCenterY = present.y + present.height / 2;
        
        const distance = Math.sqrt(
            Math.pow(playerCenterX - presentCenterX, 2) + 
            Math.pow(playerCenterY - presentCenterY, 2)
        );
        
        // If too close to player, try again
        if (distance < PLAYER_SIZE) {
            i--;
            continue;
        }
        
        // Make sure presents don't overlap with each other
        let overlap = false;
        for (let j = 0; j < presents.length; j++) {
            const otherPresent = presents[j];
            const otherPresentCenterX = otherPresent.x + otherPresent.width / 2;
            const otherPresentCenterY = otherPresent.y + otherPresent.height / 2;
            
            const distanceBetweenPresents = Math.sqrt(
                Math.pow(presentCenterX - otherPresentCenterX, 2) + 
                Math.pow(presentCenterY - otherPresentCenterY, 2)
            );
            
            if (distanceBetweenPresents < PRESENT_SIZE * 1.5) {
                overlap = true;
                break;
            }
        }
        
        if (overlap) {
            i--;
            continue;
        }
        
        presents.push(present);
    }
}

// Start the game
function startGame() {
    gameState = 'playing';
    score = 0;
    timer = GAME_DURATION;

    // Hide start screen
    document.getElementById('start-screen').style.display = 'none';

    // Create presents
    createPresents();

    // Start game loop
    requestAnimationFrame(gameLoop);

    // Delay tree movement by 1 second
    setTimeout(function() {
        treeMovementStarted = true;  // Flag to start tree movement
    }, 1000);  // 1000 milliseconds = 1 second

    // Start timer
    timerInterval = setInterval(function() {
        timer--;
        document.getElementById('timer').textContent = `Time: ${timer}s`;

        if (timer <= 0) {
            endGame();
        }
    }, 1000);

    // Update UI
    updateScore();
}



function restartGame() {
    // Hide end screen
    document.getElementById('end-screen').style.display = 'none';

    // Reset the walrus position to the center
    createWalrusPlayer();

    // Start new game
    startGame();
}


// End the game
function endGame() {
    gameState = 'end';
    
    // Clear timer
    clearInterval(timerInterval);
    
    // Check if current score is higher than highest score
    if (score > highestScore) {
        highestScore = score;
    }
    
    // Show end screen
    document.getElementById('end-screen').style.display = 'flex';
    document.getElementById('final-score').textContent = `you got ${score} present(s)! yay!!!!!`;
    document.getElementById('final-score').textContent += ` (fuck dem birches)`;
    
    // Add animation to birthday message
    const h1 = document.querySelector('#end-screen h1');
    const h2 = document.querySelector('#end-screen h2');
    
    h1.style.animation = 'bounce 1s ease infinite alternate';
    h2.style.animation = 'bounce 1.2s ease infinite alternate';
    
    // Add animation keyframes
    if (!document.querySelector('#bounce-animation')) {
        const style = document.createElement('style');
        style.id = 'bounce-animation';
        style.innerHTML = `
            @keyframes bounce {
                from { transform: scale(1); }
                to { transform: scale(1.1); }
            }
        `;
        document.head.appendChild(style);
    }
    
    // Add confetti
    addConfetti();
}


// Add confetti effect
function addConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.className = 'confetti-container';
    document.getElementById('end-screen').appendChild(confettiContainer);
    
    // Create confetti pieces
    const colors = ['#ff4d4d', '#ffcc00', '#66ff66', '#66ccff', '#cc66ff'];
    const confettiCount = 100;
    
    for (let i = 0; i < confettiCount; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.animationDelay = Math.random() * 3 + 's';
        confetti.style.animationDuration = Math.random() * 2 + 3 + 's';
        confettiContainer.appendChild(confetti);
    }
    
    // Add confetti styles
    if (!document.querySelector('#confetti-styles')) {
        const style = document.createElement('style');
        style.id = 'confetti-styles';
        style.innerHTML = `
            .confetti-container {
                position: absolute;
                width: 100%;
                height: 100%;
                overflow: hidden;
                z-index: -1;
            }
            
            .confetti {
                position: absolute;
                width: 10px;
                height: 10px;
                opacity: 0.7;
                top: -10px;
                animation: confetti-fall linear forwards;
            }
            
            @keyframes confetti-fall {
                0% {
                    transform: translateY(-10px) rotate(0deg);
                    opacity: 0;
                }
                10% {
                    opacity: 1;
                }
                100% {
                    transform: translateY(600px) rotate(360deg);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = `Score: ${score}`;
}

// Game loop
// Game loop
function gameLoop() {
    if (gameState !== 'playing') return;

    // Clear canvas
    ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

    // Update player position
    updatePlayerPosition();

    // Move the tree
    updateTreePosition();

    // Check for collisions with presents
    checkPresentCollisions();

    // Check for collision with tree
    checkTreeCollision();

    // Draw game
    drawGame();

    // Continue game loop
    requestAnimationFrame(gameLoop);
}


// Move the tree randomly
// Move the tree in a straight path, changing direction periodically
function updateTreePosition() {
    const now = Date.now();
    
    // Change direction at intervals
    if (now - tree.lastDirectionChange > tree.directionChangeInterval) {
        tree.direction = Math.random() * 2 * Math.PI; // Random new direction
        tree.lastDirectionChange = now;
    }

    // Update position based on the current direction
    tree.x += Math.cos(tree.direction) * tree.speed;
    tree.y += Math.sin(tree.direction) * tree.speed;

    // Ensure the tree stays within the canvas boundaries
    if (tree.x < 0) tree.x = 0;
    if (tree.x + tree.width > GAME_WIDTH) tree.x = GAME_WIDTH - tree.width;
    if (tree.y < 0) tree.y = 0;
    if (tree.y + tree.height > GAME_HEIGHT) tree.y = GAME_HEIGHT - tree.height;
}


// Check if walrus collides with the tree
function checkTreeCollision() {
    if (isColliding(player, tree)) {
        endGame();
    }
}

// Update player position based on key presses
function updatePlayerPosition() {
    // Vertical movement
    if ((keys.ArrowUp || keys.w) && player.y > 0) {
        player.y -= player.speed;
    }
    if ((keys.ArrowDown || keys.s) && player.y < GAME_HEIGHT - player.height) {
        player.y += player.speed;
    }
    
    // Horizontal movement
    if ((keys.ArrowLeft || keys.a) && player.x > 0) {
        player.x -= player.speed;
    }
    if ((keys.ArrowRight || keys.d) && player.x < GAME_WIDTH - player.width) {
        player.x += player.speed;
    }
}

// Check for collisions with presents
function checkPresentCollisions() {
    presents.forEach(present => {
        if (!present.collected && isColliding(player, present)) {
            present.collected = true;
            score++;
            updateScore();
            
            // Play collection sound (if we had one)
            // playSound('collect');
            
            // Spawn a new present in a random location
            spawnNewPresent();
        }
    });
}

// Spawn a new present in a random location
function spawnNewPresent() {
    // Create a new present
    const present = {
        x: Math.random() * (GAME_WIDTH - PRESENT_SIZE),
        y: Math.random() * (GAME_HEIGHT - PRESENT_SIZE),
        width: PRESENT_SIZE,
        height: PRESENT_SIZE,
        collected: false,
        image: new Image()
    };
    
    // Use the present SVG image from present.js
    present.image.src = presentDataURL;
    
    // Make sure present doesn't spawn on top of player
    const playerCenterX = player.x + player.width / 2;
    const playerCenterY = player.y + player.height / 2;
    const presentCenterX = present.x + present.width / 2;
    const presentCenterY = present.y + present.height / 2;
    
    const distance = Math.sqrt(
        Math.pow(playerCenterX - presentCenterX, 2) + 
        Math.pow(playerCenterY - presentCenterY, 2)
    );
    
    // If too close to player, adjust position
    if (distance < PLAYER_SIZE * 1.5) {
        // Try a different position on the opposite side of the screen
        present.x = GAME_WIDTH - present.x - PRESENT_SIZE;
        present.y = GAME_HEIGHT - present.y - PRESENT_SIZE;
    }
    
    // Add the new present to the array
    presents.push(present);
}

// Check if two objects are colliding
function isColliding(obj1, obj2) {
    return obj1.x < obj2.x + obj2.width &&
           obj1.x + obj1.width > obj2.x &&
           obj1.y < obj2.y + obj2.height &&
           obj1.y + obj1.height > obj2.y;
}
// Draw the tree
function drawTree() {
    if (tree.image.complete) {
        ctx.drawImage(tree.image, tree.x, tree.y, tree.width, tree.height);
    } else {
        // Fallback to a simple rectangle if the image isn't loaded
        ctx.fillStyle = 'green';
        ctx.fillRect(tree.x, tree.y, tree.width, tree.height);
    }
}


function drawGame() {
    // Draw background
    if (backgroundImg.complete) {
        ctx.drawImage(backgroundImg, 0, 0, GAME_WIDTH, GAME_HEIGHT);
    } else {
        ctx.fillStyle = '#e6f7ff';
        ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
    }
    
    // Draw presents
    presents.forEach(present => {
        if (!present.collected) {
            if (present.image.complete) {
                ctx.drawImage(present.image, present.x, present.y, present.width, present.height);
            } else {
                // Fallback if image not loaded
                ctx.fillStyle = '#ff69b4';
                ctx.fillRect(present.x, present.y, present.width, present.height);
                ctx.strokeStyle = '#ff1493';
                ctx.lineWidth = 2;
                ctx.strokeRect(present.x, present.y, present.width, present.height);
                
                // Draw bow
                ctx.fillStyle = '#ff1493';
                ctx.fillRect(present.x + present.width/2 - 5, present.y, 10, present.height);
                ctx.fillRect(present.x, present.y + present.height/2 - 5, present.width, 10);
            }
        }
    });

    // Draw the tree
    drawTree();
    
    // Draw player
    if (player.image.complete) {
        ctx.drawImage(player.image, player.x, player.y, player.width, player.height);
    } else {
        // Fallback if image not loaded
        ctx.fillStyle = '#a67c52';
        ctx.beginPath();
        ctx.arc(player.x + player.width/2, player.y + player.height/2, player.width/2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw face
        ctx.fillStyle = 'white';
        ctx.beginPath();
        ctx.arc(player.x + player.width/3, player.y + player.height/3, 5, 0, Math.PI * 2);
        ctx.arc(player.x + player.width*2/3, player.y + player.height/3, 5, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.fillStyle = 'black';
        ctx.beginPath();
        ctx.arc(player.x + player.width/3, player.y + player.height/3, 2, 0, Math.PI * 2);
        ctx.arc(player.x + player.width*2/3, player.y + player.height/3, 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Draw tusks
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(player.x + player.width/3, player.y + player.height/2);
        ctx.lineTo(player.x + player.width/4, player.y + player.height*2/3);
        ctx.moveTo(player.x + player.width*2/3, player.y + player.height/2);
        ctx.lineTo(player.x + player.width*3/4, player.y + player.height*2/3);
        ctx.stroke();
    }
}
