// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {
        this.node.on("mousedown", function () {
            this._Clicked();
        }, this);
    },

    _Clicked: function (){
        
        // var chord_name = this.node.getChildByName("Label").getComponent(cc.Label).string;
        this.node.parent.parent.parent.parent.emit("EditButtonClicked", {
            chord_name:this.node.getChildByName("Label").getComponent(cc.Label).string,
            path: this,
        });      //给table发送消息
    },
    // update (dt) {},
});
