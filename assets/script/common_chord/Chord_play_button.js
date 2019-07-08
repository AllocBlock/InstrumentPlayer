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


    onLoad () {
        var self = this;
        //音频播放，-播放模式-初始化
        self.track = new Array();   //audioengine编号
        self.chorddata = {      //和弦信息
            name: null,
            scale: [0, 0, 0, 0],
        };
        self.playon = 1;    //开关
        
        

        //-编辑多选模式-初始化
        this.node.button_num;
        this.chosen = 0;

        //启用按键侦测
        this.node.on("touchstart", function (event) {
            // cc.log("---------------------------" + self.node.parent.mode);
            /*
            if (self.node.parent.mode == 1){        //播放模式
                this._loadAudio();
                if (self.playon == 1) this._play();
            }
            else if (this.node.parent.mode == 2){    //编辑模式
                cc.log("select: Button No." + this.node.button_num);
                this.node.parent.select = this.node.button_num;  //选择按钮状态
                this.node.parent.emit("EditSelectEvent", null);
            }
            else if (this.node.parent.mode == 3){    //编辑多选模式
                this.node.getChildByName("Button_Mask").emit("Chord_Button_Clicked", null);
                if (this.node.parent.select == this.node.button_num){
                    cc.log("unselect: Button No." + this.node.button_num);
                    this.node.parent.select = -1;  //取消选择状态
                    this.node.parent.emit("SelectEvent", "unselect");
                }
                else{
                    if (this.node.parent.select != -1) cc.log("unselect: Button No." + this.node.parent.select);
                    cc.log("select: Button No." + this.node.button_num);
                    this.node.parent.select = this.node.button_num; //设为选中状态
                    this.node.parent.emit("SelectEvent", "re_select");
                }
                
            }
            */
            this.node.parent.emit("event_button_clicked", this.node.index, this.node.getChildByName("Chord_Name").getComponent(cc.Label).string);
            
        }, this);
        this.node.on("preload", function (event) {
            this._loadAudio();
        }, this);

    },
    start () {
        
    },

    
    

   
    // update (dt) {},
});
