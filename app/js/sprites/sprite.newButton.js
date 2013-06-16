/**
 * Created with JetBrains WebStorm.
 * User: Gwen
 * @project CatchTheFlowers
 * Date: 25/07/12
 * Time: 11:52
 * To change this template use File | Settings | File Templates.
 */
var NewButtonNode = CGSGNodeSquare.extend(
  {
    initialize: function (offsetX, offsetY, width, height, text) {
      var inset = 2;

      this._super(offsetX, offsetY, width, height);
      this.classType = "NewButtonNode";
      this.color = "white";
      this.lineWidth = inset;
      this.lineColor = "black";

      var textNode = new CGSGNodeText(0, 0, text);
      textNode.pickNodeMethod = CGSGPickNodeMethod.REGION;
      textNode.setSize(8);
      textNode.setTypo("Arial");
      textNode.setWrapMode(CGSGWrapMode.WORD);
      textNode.setTextAlign("center");
      textNode.setMaxWidth(width);
      textNode.setLineHeight(height);

      this.addChild(textNode);
    }
  }
);