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
        EditChordPrefab:{
            type: cc.Prefab,
            default: null
        },
        TableMoveTime: 0.3,
        ButtonInterval: 10,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        var self = this;
        //载入和弦数据文件
        cc.loader.loadRes("/data/Ukulele",function(err, data){
            if(err) {cc.error(err);}
            else {
                    self._createButtonList(data);
            }
        });
       
    
    },

    start () {
        this.node.show = 1;                 //设置默认模式为打开菜单

        if (this.node.show == 1){
            this.node.parent.mode = 2;      //打开菜单后切换为编辑模式
            //重置选择状态
            this.select_editbutton = -1;
            this.node.parent.select = -1;
        }
        else if (this.node.show == 0){
            this.node.parent.mode = 1;      //关闭菜单后切换为播放模式
        }
        var self = this;

        var button = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Button);
        var buttonsprite = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Sprite);
            // button.enabled = 1;
        this._loadButtonPic(this.node.show);

        this.select_editbutton = -1;         //默认无对应和弦
        this.node.on("EditSelectEvent", function (event){
            this._editButton();              //监听选择事件
        }, this);
        this.node.on("EditButtonClicked", function (event){
            this._editButtonClicked(event.detail.chord_name, event.detail.path);
        }, this);
        
    },

    _createButtonList: function (data) {
        var self = this;
        //正则表达式匹配和弦
        var expression =new RegExp("[CDEFGA#bm]+\\s\\d\\s\\d\\s\\d\\s\\d", "gi"); //和弦名 一弦 二弦 三弦 四弦 (全局匹配+大小写不敏感)
        var getchorddata = data.match(expression);      //存储匹配到的字符串
        this.node.chord_namelist = new Array();               //和弦列表
        this.node.chord_buttonlist = new Array();             //按钮数组
        //获取和弦列表
        for(var i = 0; i < getchorddata.length; i++){
            this.node.chord_namelist[i] = (getchorddata[i].split(" "))[0];    //分离出和弦名称
        }
        //创建按钮列表
        var margin_lr = (self.ButtonInterval + cc.instantiate(self.EditChordPrefab).width) / 2;     //左右边距
        var point_interval = self.ButtonInterval +  cc.instantiate(self.EditChordPrefab).width;     //按钮中心之间的间隔
        var node_path = self.node.getChildByName("Chord_List").getChildByName("view").getChildByName("content");    //content节点地址
        node_path.width = this.node.chord_namelist.length * (self.ButtonInterval + cc.instantiate(this.EditChordPrefab).width);      //content内容宽度
        
        for (var i = 0; i < this.node.chord_namelist.length; i++){
            this.node.chord_buttonlist[i] = new cc.instantiate(self.EditChordPrefab);     //拷贝，创建按钮
            this.node.chord_buttonlist[i].parent = node_path;                             //设置父节点
            this.node.chord_buttonlist[i].getChildByName("Label").getComponent(cc.Label).string = this.node.chord_namelist[i];  //设置按钮和弦名称
            this.node.chord_buttonlist[i].setPosition(margin_lr + point_interval * i, node_path.height / 2);          //设置按钮位置
        }
        
    },
    _editButton: function (){
        var selected_chord = this.node.parent.getComponent("Chord_main").chordlist[this.node.parent.select - 1].getChildByName("Chord_Name").getComponent(cc.Label);
        // cc.log(selected_chord.string);
        this.select_editbutton = null;
        for(var i = 0; i < this.node.chord_namelist.length; i++){
            if (this.node.chord_namelist[i] == selected_chord.string){
                this.select_editbutton = this.node.chord_buttonlist[i];
            }
        }
        if (this.select_editbutton != null){
            this.select_editbutton.getComponent(cc.Button).interactable = false;
            this.scheduleOnce(function () {
                this.select_editbutton.getComponent(cc.Button).interactable = true;
            }, 0.3);
        }
    },
    _editButtonClicked: function (new_chord_name, button_path) {
        if (this.node.parent.select != -1){
            var selected_chord = this.node.parent.getComponent("Chord_main").chordlist[this.node.parent.select - 1].getChildByName("Chord_Name").getComponent(cc.Label);
            var selected_button = this.node.parent.getComponent("Chord_main").chordlist[this.node.parent.select - 1];
            // cc.log("button no." + this.node.parent.select + " will turn to " + new_chord_name);
            // button_path.getChildByName("Chord_Name").getComponent(cc.Label).string = new_chord_name;
            //改变播放按钮的和弦名称
            selected_chord.string = new_chord_name;
            //预加载，防止bug
            selected_button.emit("preload", null);
            //改变编辑按钮的样式
        }
        
    },

    _loadButtonPic: function (set) {
        //set为0，改为上箭头；set为1,改为下箭头
        set = set * 4;
        var button = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Button);
        var buttonsprite = this.node.getChildByName("Show_and_Hide_Button").getComponent(cc.Sprite);
        var atlas = this.node.getChildByName("Show_and_Hide_Button").getComponent("Chord_Show_and_Hide_Button").Arrow;
        buttonsprite.spriteFrame = atlas[0 + set];
        button.normalSprite = atlas[0 + set];
        button.pressedSprite = atlas[1 + set];
        button.hoverSprite = atlas[2 + set];
        button.disabledSprite = atlas[3 + set];
    },

    _pauseAllButton: function () {
        var self = this;
        //暂时禁用
        for (var i = 0; i < this.node.children.length; i++){
            var list = this.node.children[i].getComponents(cc.Button);
            for (var j = 0; j < list.length; j++){
                list[j].enabled = 0;
            }
        }
        //面板到位后，重新启用
        this.scheduleOnce (function() {
            for (var i = 0; i < self.node.children.length; i++){
                var list = self.node.children[i].getComponents(cc.Button);
                for (var j = 0; j < list.length; j++){
                    list[j].enabled = 1;
                }
            }
        }, this.TableMoveTime);
    },

    showAndHide: function () {
        if (this.node.show == 1){
            this.node.show = 0;
            this.node.parent.mode = 1;      //关闭菜单后切换为播放模式
            //重置选择状态
            this.select_editbutton = -1;
            this.node.parent.select = -1;
            //更改图片      
            this._loadButtonPic(this.node.show);
            //移动面板
            var action = cc.moveBy(this.TableMoveTime, 0, -this.node.height);
            this.node.runAction(action);
            //暂时关闭交互
            this._pauseAllButton();
        }
        else if (this.node.show == 0){
            this.node.show = 1;
            this.node.parent.mode = 2;      //打开菜单后切换为编辑模式
            //更改图片
            this._loadButtonPic(this.node.show);
            //移动面板
            var action = cc.moveBy(this.TableMoveTime, 0, this.node.height);
            this.node.runAction(action);
            //暂时关闭交互
            this._pauseAllButton();
        }
        
    },

    deleteButton: function () {
        if (this.node.parent.mode = 2){
            
        }
        else if (this.node.parent.mode = 3){

        }
    },
    update () {
        this.node.setLocalZOrder(1);
    },
    // update (dt) {},
});
