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
        SweepDelayTime : {
            default: 10,
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        var self = this;
        cc.log("233");
        //音频播放，-播放模式-初始化
        this.path = new Array();  //存储audioclips
        this.track = new Array();   //audioengine编号
        this.chorddata = {      //和弦信息
            name: null,
            scale: [0, 0, 0, 0],
        };
        this.playon = 1;    //开关
        cc.loader.loadResDir("audio/Ukulele", cc.AudioClip, function (err, clips){
                self.path = clips;
            }
        );
        for (var i = 0; i < 25; i++)
            cc.audioEngine.preload(self.path[i])
        

        //-编辑多选模式-初始化
        this.node.button_num;
        this.chosen = 0;

        //启用按键侦测
        this.node.on("mousedown", function (event) {
            // cc.log("---------------------------" + self.node.parent.mode);
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
            
        }, this);
        this.node.on("preload", function (event) {
            this._loadAudio();
        }, this);

    },
    start () {
        this._loadAudio();  //预加载一次，防止bug
    },

    _loadAudio: function () {
        var self = this;
        
        //读取和弦名称
        self.chorddata_name = this.node.getChildByName("Chord_Name").getComponent(cc.Label).string;
        //读取数据文件
        cc.loader.loadRes("/data/Ukulele",function(err, data){
            if(err) {cc.error(err);}
            else {
                    
                    //正则表达式匹配和弦
                    var expression =new RegExp(self.chorddata_name + "\\s\\d\\s\\d\\s\\d\\s\\d", "i"); //和弦名 一弦 二弦 三弦 四弦
                    var getchorddata = data.match(expression);
                    if (getchorddata == null){     //匹配失败
                        for (var i = 1; i < 5; i++)
                            self.node.getChildByName("Chord_Name").getComponent(cc.Label).string = " ";  //置空label
                            self.playon = 0;    //关闭播放
                    }
                    else{
                        //音阶转换
                        var datapiece = getchorddata[0].split(" ");
                        self.chorddata.scale[0] = parseInt(datapiece[1]) + 9;
                        self.chorddata.scale[1] = parseInt(datapiece[2]) + 4;
                        self.chorddata.scale[2] = parseInt(datapiece[3]);
                        self.chorddata.scale[3] = parseInt(datapiece[4]) + 7;

                        //输出和弦信息
                        // cc.log("chorddate: " + self.chorddata_name + datapiece[0] + datapiece[1] + datapiece[2] + datapiece[3]);
                        
                        //启用播放
                        self.playon = 1;    
                    }
            }
        });
    },

    _play: function(){
        var self = this;
        //停止当前播放
        //--way 1--
            for (var i = 0; i < 4; i++)
                cc.audioEngine.stop(self.track[i]);
        //--way 2--
            // cc.audioEngine.stopAll();

        //播放
        var i = 3;
            this.schedule(function(){  
                self.track[i] = cc.audioEngine.play(self.path[self.chorddata.scale[i]], false, 1);
                i--;
            }, self.SweepDelayTime / 1000, 4);  
            
    },
    

   
    // update (dt) {},
});
