// Get viewer component
const viewer = document.getElementById("screenshot_viewer");

const images = [
  "login.jpg",
  "dashboard.jpg",
  "profile.jpg",
  "browseHunts.jpg",
  "createHunt.jpg",
];

// Create and append all images to viewer
for (let imgName of images) {
  const img = document.createElement("img");
  img.src = "images/" + imgName;
  img.classList = "viewerImg";
  img.onclick = zoomImage;

  viewer.appendChild(img);
}

function zoomImage(e) {
  const imgPath = e.target.src;

  const background = document.createElement("div");
  background.classList = "imageViewerZoomBg";
  background.onclick = (e) => {
    background.remove();
  };

  const img = document.createElement("img");
  img.src = imgPath;
  img.classList = "imageViewerZoomImg";

  background.appendChild(img);
  document.body.appendChild(background);
}
