/**
 * Created with JetBrains WebStorm.
 * User: Gwen
 * @project CatchTheFlowers
 * Date: 25/07/12
 * Time: 11:52
 * To change this template use File | Settings | File Templates.
 */
var WallNode = CGSGNodeSquare.extend(
  {
    initialize: function () {
      this._super(0, 0, 30, 30);
      this.classType = "WallNode";
      this.globalAlpha = 1;
      this.color = "black";
      this.lineWidth = 4;
      this.lineColor = "#4c4c4c";
    }
  }
);