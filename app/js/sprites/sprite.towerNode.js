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
    initialize: function (state, x, y, width, height, params) {
      this._super(x,y,width, height);
      this.state = state;

      this.reloadSpeed = params.reloadSpeed;
      this.radius = params.radius;
      this.speed = params.speed;
      this.projectiles = params.projectiles;
      this.damage = params.damage;

      this.realColor = params.color;
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

      var count = 0;

      for (var attackerIndex = 0; attackerIndex < this.state.attackers.length; attackerIndex++) {
        var attacker = this.state.attackers[attackerIndex];
        var towerPos = this.getAbsolutePosition();
        var attackerPos = attacker.getAbsolutePosition();
        var distance = Math.sqrt(Math.pow(attackerPos.x - towerPos.x, 2) + Math.pow(attackerPos.y - towerPos.y,2));

        if (distance <= this.radius) {
          this.state.fireBullet(towerPos, attackerIndex, this.damage, this.speed);

          count++;
        }

        if (count == this.projectiles) {
          break;
        }
      }
      this.reload();
    }
  }
);