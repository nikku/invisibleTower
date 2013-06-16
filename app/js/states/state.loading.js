/**
 * Created with JetBrains WebStorm.
 * @author Gwen
 * @project CatchTheFlowers
 * @filename state.loading
 * @date 25/07/12
 * @time 14:03
 * @purpose
 *
 */
var StateLoading = CGSGObject.extend(
  {
    initialize: function (context) {

      this._createEnvironment();
    },

    _createEnvironment: function () {
      this.rootNode = new CGSGNode(0, 0, 1, 1);

      this.text = new CGSGNodeText(0, 0, "LOADING...");
      this.text.color = "#3322DE";
    },

    /**
     * called each time this state is activated
     */
    run: function () {

    },

    /**
     * called each frame
     */
    onRenderStartHandler: function () {
    },

    onKeyDown: function (event) {
      var keynum = (window.event) ? event.keyCode : event.which;
    },

    onKeyUp: function (event) {

    },

    setImage: function (image) {
    }
  }
);