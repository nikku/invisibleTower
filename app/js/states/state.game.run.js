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

var VIEWPORT = { width: 640, height: 320 };
var GRID = { x: 19, y: 9, width: 30 };

var TOWER_TYPES = [ 'BOW', 'BOMB' ];

var StateGameRun = CGSGObject.extend(
  {
    initialize: function (context, parent) {
      this.context = context;
      this.image = null;
      this.game = parent;
      this.attackers = [];

      var level = this.level = parent.loadLevel(parent.levelCode);
      var weights = this.weights = this.createWeights(level);

      this._createEnvironment();
    },

    createWeights: function(level) {
      var fields = level.fields;
      var weights = [];

      for (var i = 0; i < fields.length; i++) {
        var fieldRow = fields[i];
        var weightsRow = [];

        weights.push(weightsRow);

        for (var j = 0; j < fieldRow.length; j++) {
          weightsRow.push(fieldRow[j] ? 1 : 5000);
        }
      }

      return weights;
    },

    /**
     * called each time this state is activated
     */
    run: function () {
      this.initGame();

      this.updateScore(this.score);
      this.addAttacker("bee");
    },

    rerouteAttackers: function() {
      var map = this.getMap(),
          graph = map.graph,
          end = map.end;

      for (var i = 0, attacker; !!(attacker = this.attackers[i]); i++) {
        attacker.route(graph.nodes, end);
      }
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

    /**
     * create all the environment elements for the game
     * @private
     */
    _createEnvironment: function () {
      this.rootNode = new SkyNode(0, 0, cgsgCanvas.width, cgsgCanvas.height, this.context);

      //var floor = new FloorNode(0, 0, 1, 1);
      //this.rootNode.addChild(floor);

      //this.scoreNode = new ScorePanelNode(0, 0, 103, 18);
      //this.rootNode.addChild(this.scoreNode);

      //this.liveNode = new LivePanelNode(cgsgCanvas.width - 135, 0, 135, 18);
      //this.rootNode.addChild(this.liveNode);

      this._createGameEnvironment();

      //this._createLoseEnvironment();
    },

    updateWeight: function(x, y, weight) {
      this.weights[y][x] = weight;
      this.map = null;
    },

    getMap: function() {
      if (!this.map) {
        this.map = { weights: this.weights, start: this.level.start, end: this.level.end, graph: new Graph(this.weights) };
      }

      return this.map;
    },

    addAttacker: function(config) {

      var map = this.getMap(),
          start = map.start,
          end = map.end,
          graph = map.graph;

      var attacker = new AttackerNode(start.x * GRID.width, start.y * GRID.width, this.context, this, 1);
      attacker.setImage(this.image);
      attacker.route(graph.nodes, end);
      attacker.start();

      this.attackers.push(attacker);
      this.gridNodeOverlay.addChild(attacker);
    },

    /**
     * create gfx elements and node for the game board
     * @private
     */
    _createGameEnvironment: function () {
      this.gameNode = new CGSGNode(0, 0, 1, 1);
      this.rootNode.addChild(this.gameNode);

      this._createGameGrid(this.gameNode);
      this._createGameGridOverlay(this.gameNode);
      this._createHud(this.gameNode);
    },

    _createGameGrid: function(gameNode) {

      this.gridNode = new CGSGNode(0, 0, GRID.x * GRID.width, GRID.y * GRID.width);
      gameNode.addChild(this.gridNode);

      var fields = this.level.fields,
          start = this.level.start,
          end = this.level.end;

      for (var c = 0; c < fields.length; c++) {
        var row = fields[c];
        for (var r = 0; r < row.length; r++) {
          var cellType = row[r];
          var width = GRID.width;
          var cellNode = new CellNode(r * width, c * width, width, width);
          cellNode.color = cellType ? "fuchsia" : "lightgray";

          var buildable = (r != start.x || c != start.y) && (r != end.x || c != end.y);

          // for administrative reasons ;-)
          cellNode.cellType = cellType;
          cellNode.gridPosition = { x: r, y: c };
          cellNode.buildable = buildable;

          this.gridNode.addChild(cellNode);
        }
      }
    },

    _createGameGridOverlay: function(gameNode) {
      this.gridNodeOverlay = new CGSGNode(0, 0, GRID.x * GRID.width, GRID.y * GRID.width);
      gameNode.addChild(this.gridNodeOverlay);
    },

    _createHud: function(gameNode) {

      var self = this;

      // total display size: 640 * 320
      // grid size: 19 * 9

      this.hudNode = new CGSGNode(0, GRID.y * GRID.width, VIEWPORT.width, VIEWPORT.height - GRID.y * GRID.width);

      gameNode.addChild(this.hudNode);

      for (var i = 0; i < TOWER_TYPES.length; i++) {
        var width = GRID.width;
        var node = new CGSGNodeSquare(5 + i*width, 5, width, width);
        var towerType = TOWER_TYPES[i];

        node.globalAlpha = 0.8;
        node.color = "lightgray";

        node.onClick = function(e) {
          self.selectCreateTower(e, towerType);
        };

        this.hudNode.addChild(node);
      }
    },

    selectCreateTower: function(e, towerType) {
      this.createDragTower(towerType);
    },

    cancelCreateTower: function() {
      this.createTowerDragger._parentNode.removeChild(this.createTowerDragger);
    },

    updateCreateTowerDragger: function(e) {
      var dragger = this.createTowerDragger;

      var target = this.gridNode.pickNode({ x: e.x, y: e.y }, null, null, true, function(node) {
        return node.classType == 'CellNode';
      });

      if (target) {
        dragger.translateTo(target.position.x, target.position.y);
        if (target.tower || !target.buildable) {
          dragger.color = "red";
          dragger.target = null;
        } else {
          dragger.color = "green";
          dragger.target = target;
        }
      }
    },

    buildTower: function(node) {
      node._parentNode.detachChild(node);

      var target = node.target;
      node.target = null;

      target.addChild(node);
      node.translateTo(0, 0);

      target.tower = node;

      this.createTowerDragger = null;      
      this.map = null;

      this.rerouteAttackers();
    },

    createDragTower: function(towerType) {
      if (this.createTowerDragger) {
        this.cancelCreateTower();
      }

      var dragger = this.createTowerDragger = new CGSGNodeSquare(0, 0, 30, 30);
      dragger.color = "yellow";
      dragger.globalAlpha = 0.3;

      var self = this;

      dragger.onClick = function() {
        if (dragger.target) {
          self.buildTower(dragger);
        }
      };

      this.gridNodeOverlay.addChild(dragger);
    },

    /**
     * create gfx elements and nodes for the "you lose" board
     * @private
     */
    _createLoseEnvironment: function () {
      this.loseNode = new CGSGNode(0, 0, 1, 1);
      this.rootNode.addChild(this.loseNode);

      //Button "Go Back"
      var wButton = 130;
      var hButton = 40;
      this.buttonGoBack =
      new ButtonNode(CGSGMath.fixedPoint((cgsgCanvas.width - wButton - 10) / 2.0),
               CGSGMath.fixedPoint((cgsgCanvas.height - hButton) / 1.5), wButton, hButton, 10);
      this.loseNode.addChild(this.buttonGoBack);

      var textGoBack = new CGSGNodeText(28, 18, "Go Home");
      textGoBack.color = "#6a7a89";
      textGoBack.isClickable = false;
      this.buttonGoBack.addChild(textGoBack);
      var bindOnButtonGoBackClick = this.onButtonGoBackClick.bind(this);
      this.buttonGoBack.onClick = bindOnButtonGoBackClick;

      var textGoLose = new CGSGNodeText(145, 120, "You Lose !");
      textGoLose.color = "white";
      textGoLose.setSize(32);
      this.loseNode.addChild(textGoLose);
    },

    /**
     * Change replace the game root node with the lose root node
     */
    renderLose: function () {
      if (this.isRunning) {
        this.isRunning = false;
        this.rootNode.detachChild(this.gameNode);
        this.rootNode.addChild(this.loseNode);
      }
    },

    onButtonGoBackClick: function () {
      this.game.changeGameState(GAME_STATE.HOME);
    },

    onMouseMove: function(e) {
      if (this.createTowerDragger) {
        this.updateCreateTowerDragger(e);
      }
    },

    /**
     * init a new game
     */
    initGame: function () {
      this.rootNode.detachChild(this.loseNode);
      this.rootNode.addChild(this.gameNode);
      this.score = 0;

      /*this.nbLive = maxLive;
      this.speed = 1;

      this.nbBees = 0;
      this.nbFlowers = 0;

      for (var f = 0; f < this.flowers.length; f++) {
        this.flowers[f].isVisible = false;
      }

      this.rootNode.reStartAnim();
      currentColorLerp = 0;
      currentColorIndex = 0;
      this.isRunning = true;

      this.updateScore();
      this.liveNode.reinit();*/
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
        case 27: // esc
          if (this.createTowerDragger) {
            this.cancelCreateTower();
          } else {
            // show menu?
          }
          break;
      }

      return keynum;
    },

    onKeyUp: function (event) {
      var keynum = (window.event) ? event.keyCode : event.which;

      return keynum;
    },

    /**
     * called when the player hit a bee
     * @param event
     */
    killBee: function (event) {
      event.node.reStartAnim();
      this.nbLive = Math.max(0, this.nbLive - 1);
      this.updateLive();
    },

    /**
     * called when a flower hit the ground
     */
    killFlower: function () {
      this.nbLive = Math.max(0, this.nbLive - 1);
      this.updateLive();
    },

    /**
     * called when the player catch a flower
     * @param event
     */
    catchFlower: function (event) {
      this.score += event.node.points;
      this.nbLive = Math.min(this.nbLive + event.node.live, maxLive);

      sceneGraph.animate(event.node, "globalAlpha", 10, 1.0, 0.0, "linear", 0, true);
      sceneGraph.getTimeline(event.node, "globalAlpha").onAnimationEnd = function (event) {
        event.node.reStartAnim(1);
      }

      this.updateScore();
      this.updateLive();
    },

    /**
     * update the score panel
     */
    updateScore: function () {
      //this.scoreNode.setScore(this.score);
    },

    /**
     * Update the lives panel
     */
    updateLive: function () {
      while (this.nbLive <= maxLive && this.nbLive > this.liveNode.nbLive) {
        this.liveNode.addLive();
      }

      while (this.nbLive >= 0 && this.nbLive < this.liveNode.nbLive) {
        this.liveNode.removeLive();
      }

      if (this.nbLive <= 0) {
        this.renderLose();
      }
    }
  }
);