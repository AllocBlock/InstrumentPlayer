// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

var BUTTON_WIDTH;
var BUTTON_HEIGHT;


var tableState = 1; // 默认模式为打开菜单
var selectedButtonIndex = -1;         //默认无对应和弦
var chordMapList = new Map(); // 和弦映射表
var chordButtonList = []; // 按钮数组

cc.Class({
    extends: cc.Component,

    properties: {
        EditChordPrefab:{
            type: cc.Prefab,
            default: null
        },
        TableMoveTime: 0.3,
        SweepDelayTime : 50,
        ButtonInterval: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    start () {
        var self = this;
        BUTTON_WIDTH = cc.instantiate(this.EditChordPrefab).width;
        BUTTON_HEIGHT = cc.instantiate(this.EditChordPrefab).height;

        this._createButtonList(window.chordFile);

        var button = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Button);
        var buttonsprite = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Sprite);
            // button.enabled = 1;
        this._loadButtonPic(tableState);

        this.node.on("event_button_clicked", function (buttonIndex){
            this._clickedButton(buttonIndex);              //监听选择事件
        }, this);
        this.node.on("event_chord_clicked", function (chordName){
            this._editButtonClicked(chordName);
        }, this);
        this.node.on("event_add_button", function (){  // 来自Chord_add.js
            this.node.parent.emit("event_add_button");
        }, this);
        this.node.on("event_delete_button", function (){
            this.node.parent.emit("event_delete_button", selectedButtonIndex);
            selectedButtonIndex = -1;
        }, this);
        
    },

    _createButtonList: function (data) {
        var self = this;
        //正则表达式匹配和弦
        var expression = new RegExp("[CDEFGA#bmsu247]+\\s\\d\\s\\d\\s\\d\\s\\d", "gi"); //和弦名 一弦 二弦 三弦 四弦 (全局匹配+大小写不敏感)
        var chordData = data.text.match(expression);      //存储匹配到的字符串
        
        //获取和弦列表
        for(var i = 0; i < chordData.length; i++){
            var line = chordData[i].split(" ");
            chordMapList[line[0]] = line.slice(1, 5);    //分离出和弦名称
        }

        //创建按钮列表
        var margin = (self.ButtonInterval + BUTTON_WIDTH) / 2;     //左右边距
        var padding = self.ButtonInterval +  BUTTON_WIDTH;     //按钮中心之间的间隔
        var nContent = self.node.getChildByName("Chord_List").getChildByName("view").getChildByName("content");    //content节点地址
        nContent.width = chordData.length * (self.ButtonInterval + BUTTON_WIDTH);      //content内容宽度
        cc.log("宽度 ", nContent.width);

        var i = 0;
        for (var key in chordMapList){
            chordButtonList[i] = new cc.instantiate(self.EditChordPrefab);     //拷贝，创建按钮
            chordButtonList[i].parent = nContent;                             //设置父节点
            chordButtonList[i].getChildByName("Label").getComponent(cc.Label).string = key;  //设置按钮和弦名称
            chordButtonList[i].setPosition(margin + padding * i, nContent.height / 2);
            i++;
        }
    },

        _play: function(chordName){
            var self = this;

            if (chordName == "") return; // 新按钮的和弦为空
            //停止当前播放
            //--way 1--
                // for (var i = 0; i < 25; i++)
                //     cc.audioEngine.stop(window.audioSet.uku[i]);
            //--way 2--
                cc.audioEngine.stopAll();


            // 转换音调
            var chord = chordMapList[chordName];
            var fret = [];
            fret[0] = parseInt(chord[0]) + 9;
            fret[1] = parseInt(chord[1]) + 4;
            fret[2] = parseInt(chord[2]);
            fret[3] = parseInt(chord[3]) + 7;
            
            cc.log("和弦", chordName, chord[0], " ", chord[1], " ", chord[2], " ", chord[3])
            //播放
            var i = 3;
                this.schedule(function(){  
                    cc.audioEngine.play(window.audioSet.uku[fret[i]], false, 1);
                    i--;
                }, this.SweepDelayTime / 1000, 4);  
                
        },
    _clickedButton: function (buttonIndex){
        var clickedButton = window.buttonList[buttonIndex];
        if (tableState == 0){ // 播放模式
            this._play(clickedButton.getChildByName("Chord_Name").getComponent(cc.Label).string);
        }
        else if (tableState == 1){ // 编辑模式
            
            if (selectedButtonIndex != -1) window.buttonList[selectedButtonIndex].getChildByName("Button_Mask").emit("event_button_clicked", 1);
            if (buttonIndex == selectedButtonIndex){ // 取消选中
                cc.log("取消选择");
                selectedButtonIndex = -1;
            }
            else{
                cc.log("选中按钮", buttonIndex);
                selectedButtonIndex = buttonIndex;
                clickedButton.getChildByName("Button_Mask").emit("event_button_clicked", 0);
            }
        }
        // 暂时禁用
        // if (selectedButtonIndex != null){
        //     selectedButtonIndex.getComponent(cc.Button).interactable = false;
        //     this.scheduleOnce(function () {
        //         selectedButtonIndex.getComponent(cc.Button).interactable = true;
        //     }, 0.3);
        // }
    },

    _editButtonClicked: function (chordName) {
        if (selectedButtonIndex != -1){
            cc.log("将按钮", selectedButtonIndex, "和弦改变为", chordName);
            var selectedButton = window.buttonList[selectedButtonIndex];            // cc.log("button no." + this.node.parent.select + " will turn to " + new_chord_name);
            //改变播放按钮的和弦名称
            selectedButton.getChildByName("Chord_Name").getComponent(cc.Label).string = chordName;
            //预加载，防止bug
            //selected_button.emit("preload", null);
            //改变编辑按钮的样式
        }
        
    },

    _loadButtonPic: function (set) {
        //set为0，改为上箭头；set为1,改为下箭头
        set = set * 4;
        var button = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Button);
        //var buttonsprite = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Sprite);
        //var atlas = button.Arrow;
        //buttonsprite.spriteFrame = atlas[0 + set];
        //button.normalSprite = atlas[0 + set];
        //button.pressedSprite = atlas[1 + set];
        //button.hoverSprite = atlas[2 + set];
        //button.disabledSprite = atlas[3 + set];
    },

    _pauseAllButton: function () {  // 面板运动时暂时禁用所有按钮
        var self = this;
        //暂时禁用
        for (var i = 0; i < chordButtonList.length; i++){
            chordButtonList[i].enabled = 0;
        }
        //面板到位后，重新启用
        this.scheduleOnce (function() {
            for (var i = 0; i < chordButtonList.length; i++){
                chordButtonList[i].enabled = 1;
            }
        }, this.TableMoveTime);
    },

    showAndHide: function () {
        if (tableState == 1){
            tableState = 0;
            //重置选择状态
            if (selectedButtonIndex != -1) window.buttonList[selectedButtonIndex].getChildByName("Button_Mask").emit("event_button_clicked", 1);
            selectedButtonIndex = -1;
            //移动面板
            var action = cc.moveBy(this.TableMoveTime, 0, -this.node.height);
        }
        else if (tableState == 0){
            tableState = 1;
            //移动面板
            var action = cc.moveBy(this.TableMoveTime, 0, this.node.height);
        }

        //更改图片      
        this._loadButtonPic(tableState);
        
        this.node.runAction(action);
        //暂时关闭交互
        this._pauseAllButton();
        
    },

    update () {
        //this.node.setLocalZOrder(1);
    },
    
});
