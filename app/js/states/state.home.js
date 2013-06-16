/**
 * Created with JetBrains WebStorm.
 * @author Gwen
 * @project CatchTheFlowers
 * @filename state.game.run
 * @date 25/07/12
 * @time 14:05
 * @purpose
 *
 */

var StateHome = CGSGObject.extend(
  {
    initialize: function (context, parent) {
      this.context = context;
      this.image = null;

      this.game = parent;

      this._createEnvironment();
    },

    /**
     * called each time this state is activated
     */
    run: function () {
      this.initGame();

    },

    /**
     * called each frame, just before the rendering process
     */
    onRenderStartHandler: function () {
      currentColorLerp += 0.001;
      if (currentColorLerp >= 1) {
        currentColorLerp = 0;
        currentColorIndex = (currentColorIndex + 1) % 4;
      }
    },

    setImage: function (image) {
      this.image = image;
    },

    _createEnvironment: function () {
      this.rootNode = new CGSGNode(0, 0, 1, 1);
      this.rootNode.isClickable = false;

      //button "Go"
      var wButton = 250;
      var hButton = 50;
      this.buttonGo =
      new ButtonNode(CGSGMath.fixedPoint((cgsgCanvas.width - wButton - 10) / 2.0),
               CGSGMath.fixedPoint((cgsgCanvas.height - hButton) / 2.5), wButton, hButton, 10);
      this.rootNode.addChild(this.buttonGo);

      var textGo = new CGSGNodeText(100, 22, "Start");
      textGo.isClickable = false;
      textGo.color = "#6a7a89";
      this.buttonGo.addChild(textGo);
      var bindOnButtonGoClick = this.onButtonGoClick.bind(this);
      this.buttonGo.onClick = bindOnButtonGoClick;
    },

    onButtonGoClick: function () {
      this.game.changeGameState(GAME_STATE.PLAY_RUN);
    },

    /**
     * init a new game
     * @param level
     */
    initGame: function (level) {
    },

    onKeyDown: function (event) {
      var keynum = (window.event) ? event.keyCode : event.which;

      switch (keynum) {
        case 32 : //Space
          break;
        case 37: //left
          break;
        case 38: //up
          break;
        case 39: //right
          break;
        case 40: //down
          break;
      }

      return keynum;
    },

    onKeyUp: function (event) {
      var keynum = (window.event) ? event.keyCode : event.which;

      return keynum;
    }
  }
);