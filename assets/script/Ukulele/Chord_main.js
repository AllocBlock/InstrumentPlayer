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
       ChordButtonPrefab: {
           type: cc.Prefab,
           default: null
       }
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.node.mode = 1;  //初始化为播放模式
        //和弦按钮初始化
        this.chordlist = new Array();
        // this.chordlist[0] = this.ChordButtonPrefab.createNode();
        this.chordlist[0] = cc.instantiate(this.ChordButtonPrefab);
        this.chordlist[0].parent = this.node;
        this.chordlist[0].setPosition(0,0);
        this.chordlist[0].button_num = 1;
        this.button_count = this.chordlist.length;          //按钮数统计
        this.button_max = 10;                               //最大按钮数
        cc.log("buttoncount=" + this.button_count);
        this.margin_up = 20;                                //上边距
        this.max = 5;                                       //一行最多的按钮个数
        this.col = 1;                                       //初始化行数
        this.button_width = cc.instantiate(this.ChordButtonPrefab).width;
        this.button_height = cc.instantiate(this.ChordButtonPrefab).height;
        
        //编辑模式初始化
        this.node.select = -1;   //未选中任何
        this.button_move_time = 0.2;
        //事件监听
        this.node.on("Add_Chord", function (event){
            this._addChord();
        }, this);
        this.node.on("EditSelectEvent", function (event){
            this._editChord();
        }, this);
        this.node.on("SelectEvent", function (event){
            this._multiSelectChord(event);
        }, this);
        
    },
    
    _addChord: function () {
        var self = this;
        if (this.button_count < this.button_max){
            //新按钮初始化
            this.chordlist[this.button_count] = cc.instantiate(this.ChordButtonPrefab);     //从prefab创建
            this.chordlist[this.button_count].parent = this.node;       //设置父节点
            this.chordlist[this.button_count].getChildByName("Chord_Name").getComponent(cc.Label).string = " ";
            this.chordlist[this.button_count].button_num = this.button_count + 1;   //给按钮编号
            this.button_count++;            //计数器增加
            this.col = Math.ceil(this.button_count / this.max);
            this._buttonArrange();
        }
        else {

        }
        
    },

    _editChord: function (event) {
        this.node.getChildByName("Table").emit("EditSelectEvent", null);    //丢给table的脚本处理
    },

    _deleteChord: function () {
        
    },

    _buttonArrange: function () {
        var button_action = new Array();
        // var margin_up_real = this.margin_up + this.button_height / 2;
        var distance_y = this.node.height / (this.col + 1);
        var pos_y = (distance_y * (this.col - 1)) / 2;
        var pos_x;
        for (var i = 1; i <= this.col; i++){
            
            // cc.log("col = " + this.col);
            var count = (i < this.col ? this.max : this.button_count % this.max);     //改行和弦个数
            if (count == 0) count = this.max;           //修正
            // cc.log("count = " + count);
            var distance_x = this.node.width / (count + 1);
            pos_x = -(distance_x * (count - 1)) / 2;
            for (var j = 1; j <= count; j++){
                
                button_action[(i - 1) * this.max + j - 1] = cc.moveTo(this.button_move_time, pos_x, pos_y);
                // cc.log("num:" + ((i - 1) * this.max + j )+ "  pos:" + pos_x + "," + pos_y);   //按钮定位坐标
                // this.chordlist[(i - 1) * this.max + j - 1].setPosition(pos_x, pos_y);
                pos_x = pos_x + distance_x;
            }
            this.chordlist[this.button_count - 1].setPosition((this.node.width + this.button_height ) / 2, pos_y);
            pos_y = pos_y - distance_y;
        }
        //执行动作
        //这里需要先暂停添加按钮的效果
        cc.log(this.node.getChildByName("Add_Button").enable);
        this.node.getChildByName("Add_Button").enable = 0;
        for (var i = 0; i < this.button_count; i++){
            this.chordlist[i].runAction(button_action[i]);
        }
        this.scheduleOnce( function () {
            this.node.getChildByName("Add_Button").enable = 1;
        }, this.button_move_time);
    },
    // update (dt) {},
});
