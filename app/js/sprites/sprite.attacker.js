/**
 * Created with JetBrains WebStorm.
 * User: Gwen
 * @project CatchTheFlowers
 * Date: 25/07/12
 * Time: 11:52
 * To change this template use File | Settings | File Templates.
 */
var AttackerNode = CGSGNodeSprite.extend(
  {
    initialize: function (x, y, map, context, parentState, id) {
      this._super(x*cellWidth, y*cellWidth, null, context);

      this.parentState = parentState;
      this.id = id;

      //name, speed, frames, sliceX, sliceY, width, height, framesPerLine
      this.addAnimation("fly", 4, 3, 0, 0, 16, 16, 1);

      this.currentPath = astar.search(map.graph.nodes, map.graph.nodes[x][y], map.targetPos, false);
    },

    start: function () {
      this.initPosAndSpeed();
      this.play("fly", null);
      this.startAnim();

      //var bindReStartAnim = this.reStartAnim.bind(this);
      //sceneGraph.getTimeline(this, "position.x").onAnimationEnd = bindReStartAnim;
    },

    initPosAndSpeed: function () {
      this.currentPos = 0;
      var x = 0;
      var y = 0;
      this.translateTo(x, y);
      this.speed = CGSGMath.fixedPoint(50);
    },

    startAnim: function () {
      console.log(this.currentPath);

      var oldX = this.position.x;
      var oldY = this.position.y;

      for (var pathIndex = 0; pathIndex < this.currentPath.length; pathIndex++) {
        var pathNode = this.currentPath[pathIndex];

        var delay = pathIndex == 0 ? 0 : this.speed * pathIndex;
        var toX =  pathNode.y*cellWidth;
        var toY =  pathNode.x*cellWidth;

        console.log(this.speed, oldX, oldY, toX, toY, delay);

        sceneGraph.animate(this, "position.x", this.speed, oldX, toX, "linear", delay, false);
        sceneGraph.animate(this, "position.y", this.speed, oldY, toY, "linear", delay, false);

        oldX = toX;
        oldY = toY;
      }

    },

    reStartAnim: function () {
      /*sceneGraph.getTimeline(this, "position.x").removeAll();
      this.initPosAndSpeed();
      this.startAnim();
      */
    }
  }
);