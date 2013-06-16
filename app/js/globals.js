var sceneGraph = null;

var currentColorLerp = 0;
var currentColorIndex = 0;

var maxLive = 6;

var cellWidth = 30;

var LEVELS = [
  "S   xxxxxxxx       #" +
  "      xxxxx        #" +
  "        xx         #" +
  "                   #" +
  "        x          #" +
  "                   #" +
  "                  x#" +
  "x       xx       xx#" +
  "xxx    xxxx       E#"
];

var TOWER_TYPES = {
  "basic": {
    name: "basic",
    color: "lime",
    reloadSpeed: 40,
    radius: 70,
    speed: 300,
    projectiles: 1,
    damage: 55
  },
  "spread": {
    name: "spread",
    color: "fuchsia",
    reloadSpeed: 40,
    radius: 50,
    speed: 400,
    projectiles: 5,
    damage: 25
  },
  "sniper": {
    name: "sniper",
    color: "orange",
    reloadSpeed: 80,
    radius: 300,
    speed: 500,
    projectiles: 1,
    damage: 150
  }
}