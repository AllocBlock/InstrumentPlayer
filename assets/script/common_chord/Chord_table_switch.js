// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var tableState = 1;

cc.Class({
    extends: cc.Component,

    properties: {
        upArrow:{
            type: cc.SpriteFrame,
            default: []
        },
        downArrow:{
            type: cc.SpriteFrame,
            default: []
        },
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
    },

    switchSprite: function(){
        var button = this.node.getComponent(cc.Button);
        var buttonsprite = this.node.getComponent(cc.Sprite);

        if (tableState == 1){
            tableState = 0;
            buttonsprite.spriteFrame = this.upArrow[0];
            button.normalSprite = this.upArrow[0];
            button.pressedSprite = this.upArrow[1];
            button.hoverSprite = this.upArrow[2];
            button.disabledSprite = this.upArrow[3];
        }
        else if (tableState == 0){
            tableState = 1;
            buttonsprite.spriteFrame = this.downArrow[0];
            button.normalSprite = this.downArrow[0];
            button.pressedSprite = this.downArrow[1];
            button.hoverSprite = this.downArrow[2];
            button.disabledSprite = this.downArrow[3];
        }

    }

    // update (dt) {},
});
