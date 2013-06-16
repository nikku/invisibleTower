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
      this.score = 0;

      // 0 = wall, 1 = open
      var field = this.map = [
        [42,0,0,0,0,0,0,0,1,1,1,0,0,0,0,0,0,0,0],
        [1,1,1,0,0,0,0,0,1,0,1,0,0,0,0,0,0,0,0],
        [0,0,1,0,0,0,0,0,1,0,1,1,1,0,0,0,0,0,0],
        [0,0,1,1,1,1,1,1,1,0,0,0,1,1,1,1,1,1,43],
        [0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
        [0,0,0,0,1,1,0,0,0,0,0,0,0,1,1,1,0,0,0],
        [0,0,0,0,0,1,1,0,0,0,0,0,1,1,0,0,0,0,0],
        [0,0,0,0,0,0,1,1,0,0,0,0,1,0,0,0,0,0,0],
        [0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0]
      ];

      var graph = this.graph = new Graph(field);
      var start = this.start = graph.nodes[0][0];
      var end = this.end = graph.nodes[3][18];

      var map = this.map = {field : field, "graph" :  this.graph, sourcePos : start, targetPos : end};
      this._createEnvironment();
    },

    /**
     * called each time this state is activated
     */
    run: function () {
      this.initGame();

      for (var b = 0; b < this.attackers.length; b++) {
        this.attackers[b].setImage(this.image);
      }

      this.attackers[0].start();
      this.updateScore(this.score);
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

      //this.liveNode = new LivePanelNode(cgsgCanvas.width - 135, 0, 135, 18);
      //this.rootNode.addChild(this.liveNode);

      this._createGameEnvironment();

      this.scoreNode = new ScorePanelNode(570, 40, 103, 18);
      this.rootNode.addChild(this.scoreNode);

      //this._createLoseEnvironment();
    },

    /**
     * create gfx elements and node for the game board
     * @private
     */
    _createGameEnvironment: function () {
      this.gameNode = new CGSGNode(0, 0, 1, 1);
      this.rootNode.addChild(this.gameNode);

      this._createGameGrid(this.gameNode);
      this._createHud(this.gameNode);

      var bee = new AttackerNode(0, 0, this.map, this.context, this, 1, 100, 1);
      this.attackers.push(bee);

      this.gameNode.addChild(bee);
    },

    _createGameGrid: function(gameNode) {

      this.gridNode = new CGSGNode(0, 0, GRID.x * GRID.width, GRID.y * GRID.width);
      gameNode.addChild(this.gridNode);

      for (var index = 0; index < this.map.field.length; index++) {
        var row = this.map.field[index];
        for (var rowIndex = 0; rowIndex < row.length; rowIndex++) {
          var cellType = row[rowIndex];
          var width = GRID.width;
          var cellNode = new CellNode(rowIndex * width, index * width, width, width);
          cellNode.color = "lightgray";
          this.gridNode.addChild(cellNode);

          switch (cellType) {
            case 0:
              cellNode.addChild(new WallNode());
              break;
            case 42:
              cellNode.addChild(new StartPointNode());
              break;
            case 43:
              cellNode.addChild(new EndPointNode());
              break;
          }
        }
      }

      var self = this;
      var menuButton = new CGSGNodeButton(580, 10, "Menu");
      menuButton.setFixedSize(new CGSGDimension(50, 20));
      menuButton.onClick = function () {
        self.game.changeGameState(GAME_STATE.HOME);
      };

      this.gameNode.addChild(menuButton);
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
        if (target.tower) {
          dragger.color = "red";
          dragger.target = null;
        } else {
          dragger.color = "green";
          dragger.target = target;
        }
      }
    },

    buildTower: function(towerNode) {
      towerNode._parentNode.detachChild(towerNode);

      var target = towerNode.target;
      towerNode.target = null;

      target.addChild(towerNode);
      towerNode.translateTo(0, 0);
      towerNode.start();

      target.tower = towerNode;
      this.createTowerDragger = null;
    },

    createDragTower: function(towerType) {
      if (this.createTowerDragger) {
        this.cancelCreateTower();
      }

      var dragger = this.createTowerDragger = new TowerNode(this, 0, 0, 30, 30);
      dragger.color = "yellow";
      dragger.globalAlpha = 1.0;

      var self = this;

      dragger.onClick = function() {
        if (dragger.target) {
          self.buildTower(dragger);
        }
      };

      this.gridNode.addChild(dragger);
    },

    fireBullet :  function (towerPos, attackerIndex, attackValue) {
      var attacker = this.attackers[attackerIndex];

      if (attacker.isDead) {
        return;
      }

      var bullet = new CGSGNodeSquare(towerPos.x, towerPos.y, 10, 10);
      bullet.color = "yellow";
      this.gameNode.addChild(bullet);
      attacker.hurt(attackValue);

      sceneGraph.animate(bullet, "position.x", 10, towerPos.x, attacker.position.x, "linear", 0, false);
      sceneGraph.animate(bullet, "position.y", 10, towerPos.y, attacker.position.y, "linear", 0, false);

      var gameNode = this.gameNode;
      sceneGraph.getTimeline(bullet, "position.x").onAnimationEnd = function (event) {
        gameNode.removeChild(bullet);
      }
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
     * update the score panel
     */
    updateScore: function (newPoints) {
      if (newPoints) {
          this.score += newPoints;
      }
      this.scoreNode.setScore(this.score);
    }

  }
);