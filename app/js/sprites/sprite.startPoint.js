/**
 * Created with JetBrains WebStorm.
 * User: Gwen
 * @project CatchTheFlowers
 * Date: 25/07/12
 * Time: 11:52
 * To change this template use File | Settings | File Templates.
 */
var StartPointNode = CGSGNodeSquare.extend(
  {
    initialize: function () {
      var width = 26;
      var height = 26;
      var inset = 5;

      this._super(2, 2, width, height);
      this.classType = "StartPointNode";
      this.color = "white";
      this.lineWidth = inset;
      this.lineColor = "red";
    }
  }
);