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