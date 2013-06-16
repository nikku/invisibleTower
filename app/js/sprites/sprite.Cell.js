var CellNode = CGSGNodeSquare.extend({

  initialize: function (x, y, width, height, radius) {
    this._super(x, y, width, height);

    this.classType = 'CellNode';

    this.globalAlpha = 0.8;
  }
});