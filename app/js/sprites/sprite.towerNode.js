/**
 * Created with JetBrains WebStorm.
 * User: Gwen
 * @project CatchTheFlowers
 * Date: 25/07/12
 * Time: 11:52
 * To change this template use File | Settings | File Templates.
 */
var TowerNode = CGSGNodeSquare.extend(
  {
    initialize: function (state, x, y, width, height) {
      this._super(x,y,width, height);
      this.reloadSpeed = 50;
      this.state = state;
    },

    start: function () {
      this.reload();
    },

    reload : function () {
      var onReloaded = this.onReloaded.bind(this);
      sceneGraph.animate(this, "reload", 0, 0, 0, "linear", this.reloadSpeed, false)
      sceneGraph.getTimeline(this, "reload").onAnimationEnd = onReloaded;
    },

    onReloaded: function () {
      for (var attackerIndex = 0; attackerIndex < this.state.attackers.length; attackerIndex++) {
        var attacker = this.state.attackers[attackerIndex];
        console.log(attacker.position.x);
        this.state.fireBullet(this.getAbsolutePosition(), attackerIndex);
      }
      this.reload();
    }
  }
);