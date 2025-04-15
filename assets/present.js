// Simple SVG-based present
const presentSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <!-- Present box -->
  <rect x="10" y="25" width="80" height="65" fill="#FF69B4" />
  
  <!-- Lid -->
  <rect x="5" y="15" width="90" height="15" fill="#FF1493" />
  
  <!-- Ribbon vertical -->
  <rect x="45" y="5" width="10" height="85" fill="#FFFF00" />
  
  <!-- Ribbon horizontal -->
  <rect x="10" y="45" width="80" height="10" fill="#FFFF00" />
  
  <!-- Bow -->
  <circle cx="50" cy="15" r="10" fill="#FFFF00" />
  <circle cx="40" cy="10" r="8" fill="#FFFF00" />
  <circle cx="60" cy="10" r="8" fill="#FFFF00" />
</svg>
`;

// Convert SVG to data URL
const presentDataURL = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(presentSVG);

// Create present image
const presentImg = new Image();
presentImg.src = presentDataURL;

// Save the present image to the assets folder
// In a real environment, we would save this to a file, but for this simulation
// we'll use the data URL directly in the game
