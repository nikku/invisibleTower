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

      for (var i = 0; i < 6; i++) {
        for (var j = 0; j < 6; j++) {
          var brick = new CGSGNodeSquare(i * 5, j * 5, 5, 5);

          if (i % 2 == 0) {
            if (j % 2 == 0) {
              brick.color = "black";
            } else {
              brick.color = "#4c4c4c";
            }
          } else {
            if (j % 2 == 0) {
              brick.color = "#4c4c4c";
            } else {
              brick.color = "black";
            }
          }

          this.addChild(brick);
        }
      }
    }
  }
);