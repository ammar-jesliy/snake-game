const gameCanvas = document.getElementById("gameCanvas");
const ctx = gameCanvas.getContext("2d");

ctx.fillStyle = "white";
ctx.fillRect(0, 0, 300, 300);

ctx.strokeStyle = "black";
ctx.lineWidth = 5;
ctx.strokeRect(0, 0, 300, 300);