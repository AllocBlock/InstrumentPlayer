// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html


var MAX_index = 10;    // 最大按钮数
var MARGIN_UP = 20;         // 上边距
var BUTTON_WIDTH;
var BUTTON_HEIGHT;
var SCREEN_WIDTH;
var SCREEN_HEIGHT;
var MAX_NUM_EACH_ROW = 5;   // 一行最多的按钮个数
var BUTTON_MOVE_TIME = 0.2; // 按钮移动时间

var currentRow = 1;         // 初始化行数
var currentMode = 1;        // 初始化为播放模式


cc.Class({
    extends: cc.Component,

    properties: {
       ChordButtonPrefab: {
           type: cc.Prefab,
           default: null
       }
    },

    _loadResources: function () {
        var self = this;
        
        // 载入和弦数据文件
        cc.loader.loadRes("data/Ukulele",function(err, data){
            if(err) {cc.error(err);}
            else {
                window.chordFile = data;
            }
        }); 

        // 载入音轨
        // 音频初始化
        window.audioSet = new Object();
        cc.loader.loadResDir("audio/Ukulele", cc.AudioClip, function (err, clips){
                window.audioSet.uku = clips;
            }
        );
    },

    onLoad () {
        BUTTON_WIDTH = cc.instantiate(this.ChordButtonPrefab).width;
        BUTTON_HEIGHT = cc.instantiate(this.ChordButtonPrefab).height;
        SCREEN_WIDTH = this.node.width;
        SCREEN_HEIGHT = this.node.height;
        
        // 加载资源
        this._loadResources();

        // 初始按钮
        // window.buttonList[0] = this.ChordButtonPrefab.createNode();
        window.buttonList = [];         // 按钮列表
        window.buttonList[0] = cc.instantiate(this.ChordButtonPrefab);
        window.buttonList[0].parent = this.node;
        window.buttonList[0].setPosition(0,0);
        window.buttonList[0].index = 0;

        //事件监听
        this.node.on("event_add_button", function (){
            this._addButton();
        }, this);
        this.node.on("event_delete_button", function (buttonIndex){
            this._deleteButton(buttonIndex);
        }, this);
        this.node.on("event_button_clicked", function (buttonIndex){
            this._clickedButton(buttonIndex);
        }, this);
        this.node.on("event_select", function (event){
            this._multiSelectButton(event);
        }, this);

    },
    
    _addButton: function () {
        var self = this;
        var index = window.buttonList.length;
        if (index < MAX_index){
            //新按钮初始化
            window.buttonList[index] = cc.instantiate(this.ChordButtonPrefab);       //从prefab创建
            window.buttonList[index].parent = this.node;                             //设置父节点
            window.buttonList[index].getChildByName("Chord_Name").getComponent(cc.Label).string = "";
            window.buttonList[index].index = index;   //给按钮编号
            this._buttonAction();
        }
        else {

        }
        
    },

    _buttonAction: function () {
        /*

        var button_action = [];
        // var margin_up_real = MARGIN_UP + BUTTON_HEIGHT / 2;
        var distance_y = this.node.height / (currentRow + 1);
        var pos_y = (distance_y * (currentRow - 1)) / 2;
        var pos_x;
        for (var i = 1; i <= currentRow; i++){
            
            // cc.log("col = " + currentRow);
            var count = (i < currentRow ? MAX_NUM_EACH_ROW : window.buttonList.length % MAX_NUM_EACH_ROW);     //改行和弦个数
            if (count == 0) count = MAX_NUM_EACH_ROW;           //修正
            // cc.log("count = " + count);
            var distance_x = this.node.width / (count + 1);
            pos_x = -(distance_x * (count - 1)) / 2;
            for (var j = 1; j <= count; j++){
                
                button_action[(i - 1) * MAX_NUM_EACH_ROW + j - 1] = cc.moveTo(BUTTON_MOVE_TIME, pos_x, pos_y);
                // cc.log("num:" + ((i - 1) * MAX_NUM_EACH_ROW + j )+ "  pos:" + pos_x + "," + pos_y);   //按钮定位坐标
                // window.buttonList[(i - 1) * MAX_NUM_EACH_ROW + j - 1].setPosition(pos_x, pos_y);
                pos_x = pos_x + distance_x;
            }
            window.buttonList[window.buttonList.length - 1].setPosition((this.node.width + BUTTON_HEIGHT ) / 2, pos_y);
            pos_y = pos_y - distance_y;
        }
        //执行动作
        //这里需要先暂停添加按钮的效果
        cc.log(this.node.getChildByName("Add_Button").enable);
        this.node.getChildByName("Add_Button").enable = 0;
        for (var i = 0; i < window.buttonList.length; i++){
            window.buttonList[i].runAction(button_action[i]);
        }
        this.scheduleOnce( function () {
            this.node.getChildByName("Add_Button").enable = 1;
        }, BUTTON_MOVE_TIME);
        */

        currentRow = Math.ceil(window.buttonList.length / MAX_NUM_EACH_ROW);

        var distance_x, distance_y = SCREEN_HEIGHT / (currentRow + 1); // 竖直边距
        for (var i = 1; i <= currentRow; i++){
            
            var count = (i < currentRow ? MAX_NUM_EACH_ROW : window.buttonList.length % MAX_NUM_EACH_ROW); // 该行和弦个数
            if (count == 0) count = MAX_NUM_EACH_ROW;           //修正

            distance_x = SCREEN_WIDTH / (count + 1);
            
            var pos_y = (distance_y * (currentRow - i + 1))  - (SCREEN_HEIGHT / 2);
            for (var j = 1; j <= count; j++){
                var pos_x = (distance_x * j) - (SCREEN_WIDTH / 2);
                window.buttonList[(i - 1) * MAX_NUM_EACH_ROW + j - 1].setPosition(pos_x, pos_y);
            }
        }

    },
    _clickedButton: function (buttonIndex) {
        this.node.getChildByName("Table").emit("event_button_clicked", buttonIndex);    //丢给table的脚本处理
    },

    _deleteButton: function (buttonIndex) {
        if (buttonIndex != -1) {
            window.buttonList[buttonIndex].destroy();
            window.buttonList.splice(buttonIndex, 1);
            for(var i = buttonIndex; i < window.buttonList.length; i++){
                window.buttonList[i].index = i;
            }
            this._buttonAction();
        }
    },

    
    // update (dt) {},
    
});
