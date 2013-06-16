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
    initialize: function () {
      var width = 26;
      var height = 26;
      var inset = 5;

      this._super(2, 2, width, height);
      this.classType = "TowerNode";
      this.color = "white";
      this.lineWidth = inset;
      this.lineColor = "black";

      var insetA = new CGSGNodeSquare(inset, inset, width - 2 * inset, height - 2* inset);
      insetA.color = 'lightgrey';
      insetA.lineWidth = inset;
      insetA.lineColor = "darkgrey";
      this.addChild(insetA);

      var insetB = new CGSGNodeSquare(inset, inset, 6, 6);
      insetB.color = 'white';
      insetA.addChild(insetB);
    }
  }
);