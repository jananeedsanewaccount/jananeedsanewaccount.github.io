// Simple SVG-based background
const backgroundSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600">
  <!-- Sky gradient -->
  <defs>
    <linearGradient id="skyGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:#87CEEB;stop-opacity:1" />
      <stop offset="100%" style="stop-color:#E0F7FA;stop-opacity:1" />
    </linearGradient>
  </defs>
  
  <!-- Sky background -->
  <rect width="800" height="600" fill="url(#skyGradient)" />
  
  <!-- Sun -->
  <circle cx="700" cy="100" r="60" fill="#FFD700" />
  <circle cx="700" cy="100" r="50" fill="#FFEB3B" />
  
  <!-- Clouds -->
  <g fill="white" opacity="0.8">
    <ellipse cx="150" cy="120" rx="70" ry="40" />
    <ellipse cx="200" cy="100" rx="60" ry="35" />
    <ellipse cx="250" cy="130" rx="65" ry="30" />
    
    <ellipse cx="550" cy="150" rx="80" ry="30" />
    <ellipse cx="600" cy="140" rx="60" ry="25" />
    <ellipse cx="650" cy="160" rx="70" ry="35" />
  </g>
  
  <!-- Snow ground -->
  <rect x="0" y="450" width="800" height="150" fill="#FFFFFF" />
  
  <!-- Snowflakes -->
  <g fill="#E0F7FA">
    <circle cx="100" cy="480" r="5" />
    <circle cx="200" cy="520" r="4" />
    <circle cx="300" cy="490" r="6" />
    <circle cx="400" cy="510" r="5" />
    <circle cx="500" cy="480" r="4" />
    <circle cx="600" cy="530" r="6" />
    <circle cx="700" cy="500" r="5" />
  </g>
</svg>
`;

// Convert SVG to data URL
const backgroundDataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(backgroundSVG);

// Create background image
const backgroundImg = new Image();
backgroundImg.src = backgroundDataURL;

// Save the background image to the assets folder
// In a real environment, we would save this to a file, but for this simulation
// we'll use the data URL directly in the game
