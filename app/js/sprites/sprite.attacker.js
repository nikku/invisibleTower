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
    initialize: function (x, y, context, parentState, id, hitpoints, scorePoints) {
      this._super(x*cellWidth, y*cellWidth, null, context);

      this.parentState = parentState;
      this.id = id;
      this.hitpoints = hitpoints;
      this.scorePoints = scorePoints;
      this.isDead = false;

      //name, speed, frames, sliceX, sliceY, width, height, framesPerLine
      this.addAnimation("fly", 4, 3, 0, 0, 16, 16, 1);
    },

    route: function(graph, to) {

      var x = Math.round(this.position.x / GRID.width),
          y = Math.round(this.position.y / GRID.width);

      this.currentPath = astar.search(graph, graph[y][x], graph[to.y][to.x], false);
      
      sceneGraph.getTimeline(this, "position.x").removeAll();
      sceneGraph.getTimeline(this, "position.y").removeAll();

      this.startAnim();
    },

    start: function () {
      this.initPosAndSpeed();
      this.play("fly", null);
      
      //var bindReStartAnim = this.reStartAnim.bind(this);
      //sceneGraph.getTimeline(this, "position.x").onAnimationEnd = bindReStartAnim;
    },

    initPosAndSpeed: function () {
      this.speed = CGSGMath.fixedPoint(50);
    },

    startAnim: function () {

      var oldX = this.position.x;
      var oldY = this.position.y;

      for (var pathIndex = 0; pathIndex < this.currentPath.length; pathIndex++) {
        var pathNode = this.currentPath[pathIndex];

        var delay = pathIndex == 0 ? 0 : this.speed * pathIndex;
        var toX =  pathNode.y*cellWidth;
        var toY =  pathNode.x*cellWidth;

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
    },

    hurt : function (attackValue) {
      this.hitpoints -= attackValue;
      if (this.hitpoints <= 0) {
        this.kill();
      }
    },

    kill : function () {
      this.isDead = true;
      this.parentState.updateScore(this.scorePoints);
      this._parentNode.removeChild(this);
    }
  }
);