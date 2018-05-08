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
        audio: {
            type: cc.Node,
            default: null
        },
        sweepdelaytime : 2,
    },

    // LIFE-CYCLE CALLBACKS:

    // onLoad () {},

    start () {

    },
    onLoad: function () {
        
    },

    _loadAudio: function () {
       
        var self = this;
        //去掉**.mp3后缀
        var path = this.audio.getChildByName("track1").getComponent(cc.AudioSource).clip;
        path = path.slice(0, path.length - 6);
        //读取和弦名称
        var chordname = this.node.getChildByName("Label").getComponent(cc.Label).string;
        //读取数据文件
        cc.loader.loadRes("/data/Ukulele",function(err, data){
            if(err) {cc.error(err);}
            else {
                    var expression =new RegExp(chordname + "\\s\\d\\s\\d\\s\\d\\s\\d", "i"); //和弦名 一弦 二弦 三弦 四弦
                    var chorddata = data.match(expression);
                    if (chorddata == null){
                        for (var i = 1; i < 5; i++)
                            self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).clip = null;
                            self.node.getChildByName("Label").getComponent(cc.Label).string = "X";
                    }
                    else{
                        var datapiece = chorddata[0].split(" ");
                        //音阶转换
                        var stringscale = new Array();   //存储各弦音阶的数组
                        stringscale[0] = String(parseInt(datapiece[1]) + 10);
                        stringscale[1] = String(parseInt(datapiece[2]) + 5);
                        stringscale[2] = String(parseInt(datapiece[3]) + 1);
                        stringscale[3] = String(parseInt(datapiece[4]) + 8);
                        for (var i = 0; i < 4; i++){
                            if (stringscale[i].length === 1) stringscale[i] = "0" + stringscale[i];
                        }
                        cc.log(chordname + " " +stringscale[0] + " " + stringscale[1] + " " + stringscale[2] + " " + stringscale[3]);
                        //修改audiosource音频文件
                        // cc.log(path + stringscale[0] + ".mp3");
                        for (var i = 1; i < 5; i++)
                            // self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).clip = path + stringscale[i - 1] + ".mp3";
                            self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).clip = path + stringscale[i - 1] + ".mp3";
                         for (var i = 1; i < 5; i++)
                            cc.log(self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).clip);
                    }
            }
        });
    },

    _play: function(){
        var self = this;
        // var i = 1;
        //     this.schedule(function(i) {
        //         self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).play();
        //         i++;
        //     }, self.sweepdelaytime, 4);
        self.audio.getChildByName("track1").getComponent(cc.AudioSource).play();
        self.audio.getChildByName("track2").getComponent(cc.AudioSource).play();
        self.audio.getChildByName("track3").getComponent(cc.AudioSource).play();
        self.audio.getChildByName("track4").getComponent(cc.AudioSource).play();
        
        for (var i = 1; i < 5; i++)
            cc.log(self.audio.getChildByName("track" + i).getComponent(cc.AudioSource).clip);
    },
    onLoad: function (){
        this.node.on('mousedown', function (event) {
            this._loadAudio();
            // for(var i = 0; i < 999999999; i++);
            this._play();
        }, this);
    },

   
    // update (dt) {},
});
