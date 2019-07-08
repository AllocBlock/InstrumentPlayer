// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html
var keyMap = new Map();
var keyState = [];
var pressedFrets = [[], [], [], []];
var lastPlayAudioID = [0, 0, 0, 0];
var lastFret = [0, 0, 0, 0];

var pressedMark = [];
var stringsPos = [160, 54, -54, -160];
var fretsPos = [84, 250, 400, 550, 690, 830, 965, 1090, 1220, 1336, 1448, 1560, 1666, 1762, 1862, 1946, 2030, 2114]

cc.Class({
    extends: cc.Component,

    properties: {
        letRing: false,
        mute: false,
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        // 载入音轨
        // 音频初始化
        window.audioSet = new Object();
        window.audioSet.uku = [];
        cc.loader.loadResDir("audio/Ukulele", cc.AudioClip, function (err, clips){
                window.audioSet.uku[0] = clips.slice(9); // 1弦
                window.audioSet.uku[1] = clips.slice(4); // 2弦
                window.audioSet.uku[2] = clips;          // 3弦
                window.audioSet.uku[3] = clips.slice(7); // 4弦
            }
        );

        for(var i = 0; i < 255; i++) keyState[i] = false;
        for(var i = 0; i < 4; i++)
            for(var j = 0; j < 17; j++)
                pressedFrets[i][j] = false;

        // 品位标记初始化
        var scrollViewContent = this.node.getChildByName("Board").getChildByName("Frets").getChildByName("view").getChildByName("content");
        pressedMark[0] = scrollViewContent.getChildByName("pressedMark1");
        pressedMark[1] = scrollViewContent.getChildByName("pressedMark2");
        pressedMark[2] = scrollViewContent.getChildByName("pressedMark3");
        pressedMark[3] = scrollViewContent.getChildByName("pressedMark4");
        // 键盘映射初始化

        keyMap.set(cc.macro.KEY['1'],  [1, 1]);
        keyMap.set(cc.macro.KEY['2'],  [1, 2]);
        keyMap.set(cc.macro.KEY['3'],  [1, 3]);
        keyMap.set(cc.macro.KEY['4'],  [1, 4]);
        keyMap.set(cc.macro.KEY['5'],  [1, 5]);
        keyMap.set(cc.macro.KEY['6'],  [1, 6]);
        keyMap.set(cc.macro.KEY['7'],  [1, 7]);
        keyMap.set(cc.macro.KEY['8'],  [1, 8]);
        keyMap.set(cc.macro.KEY['9'],  [1, 9]);
        keyMap.set(cc.macro.KEY['0'],  [1, 10]);
        keyMap.set(cc.macro.KEY['dash'],  [1, 11]);
        keyMap.set(cc.macro.KEY['='],     [1, 12]);
        keyMap.set(cc.macro.KEY['q'],     [2, 1]);
        keyMap.set(cc.macro.KEY['w'],     [2, 2]);
        keyMap.set(cc.macro.KEY['e'],     [2, 3]);
        keyMap.set(cc.macro.KEY['r'],     [2, 4]);
        keyMap.set(cc.macro.KEY['t'],     [2, 5]);
        keyMap.set(cc.macro.KEY['y'],     [2, 6]);
        keyMap.set(cc.macro.KEY['u'],     [2, 7]);
        keyMap.set(cc.macro.KEY['i'],     [2, 8]);
        keyMap.set(cc.macro.KEY['o'],     [2, 9]);
        keyMap.set(cc.macro.KEY['p'],     [2, 10]);
        keyMap.set(cc.macro.KEY['['],     [2, 11]);
        keyMap.set(cc.macro.KEY[']'],     [2, 12]);
        keyMap.set(cc.macro.KEY['a'],     [3, 1]);
        keyMap.set(cc.macro.KEY['s'],     [3, 2]);
        keyMap.set(cc.macro.KEY['d'],     [3, 3]);
        keyMap.set(cc.macro.KEY['f'],     [3, 4]);
        keyMap.set(cc.macro.KEY['g'],     [3, 5]);
        keyMap.set(cc.macro.KEY['h'],     [3, 6]);
        keyMap.set(cc.macro.KEY['j'],     [3, 7]);
        keyMap.set(cc.macro.KEY['k'],     [3, 8]);
        keyMap.set(cc.macro.KEY['l'],     [3, 9]);
        keyMap.set(cc.macro.KEY[';'],     [3, 10]);
        keyMap.set(cc.macro.KEY['quote'], [3, 11]);
        keyMap.set(cc.macro.KEY['z'],     [4, 1]);
        keyMap.set(cc.macro.KEY['x'],     [4, 2]);
        keyMap.set(cc.macro.KEY['c'],     [4, 3]);
        keyMap.set(cc.macro.KEY['v'],     [4, 4]);
        keyMap.set(cc.macro.KEY['b'],     [4, 5]);
        keyMap.set(cc.macro.KEY['n'],     [4, 6]);
        keyMap.set(cc.macro.KEY['m'],     [4, 7]);
        keyMap.set(cc.macro.KEY[','],     [4, 8]);
        keyMap.set(cc.macro.KEY['.'],     [4, 9]);
        keyMap.set(cc.macro.KEY['forwardslash'],     [4, 10]);


        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    start () {

    },

    onKeyDown: function (event) {
        
        if (keyState[event.keyCode] == true) return;
        keyState[event.keyCode] = true;
        console.log("KEY DOWN ", event.keyCode);

        if (keyMap.has(event.keyCode)){
            var pressedFret = keyMap.get(event.keyCode);
            pressedFrets[pressedFret[0]-1][pressedFret[1]] = true;

            var currentFret = this._findCurrentFret(pressedFret[0]);
            this._updateFretMark(pressedFret[0], currentFret);
            //this._hammer(pressedFret[0], currentFret);
            console.log("string ", pressedFret[0], " fret ", pressedFret[1], " pressed");
            return;
        }
        switch(event.keyCode){
            //case cc.macro.KEY['numlock']: 
            case 12: 
                this._play(4);
                break;
            case cc.macro.KEY['/']: 
                this._play(3);
                break;
            case cc.macro.KEY['*']: 
                this._play(2);
                break;
            case cc.macro.KEY['-']: 
                this._play(1);
                break;
        }
    },

    onKeyUp: function (event) {
        keyState[event.keyCode] = false;

        if (!keyMap.has(event.keyCode)) return;
        var releasedFret = keyMap.get(event.keyCode);

        pressedFrets[releasedFret[0]-1][releasedFret[1]] = false;
        var currentFret = this._findCurrentFret(releasedFret[0]);
        this._updateFretMark(releasedFret[0], currentFret);

        if (currentFret == releasedFret[1]) cc.audioEngine.stop(lastPlayAudioID[releasedFret[0]-1]);

        console.log("string ", releasedFret[0], " fret ", releasedFret[1], " released");
    },

    _play: function(stringNum){
        console.log("弹奏", stringNum, "弦");

        var currentFret = this._findCurrentFret(stringNum);

        lastPlayAudioID[stringNum-1] = cc.audioEngine.play(window.audioSet.uku[stringNum-1][currentFret], false, 1);
        lastFret[stringNum-1] = currentFret;
        
        
    },

    _updateFretMark: function(stringNum, currentFret){
        if (currentFret == 0){
            pressedMark[stringNum-1].x = -100;
        }
        else{
            pressedMark[stringNum-1].x = fretsPos[currentFret-1];
        }
    },

    _hammer: function(stringNum, currentFret){
        // pause和setCurrentTime不能使用！！！

        // 判断上一个音频是否已经播放完毕
        var lastPlayedTime = cc.audioEngine.getCurrentTime(lastPlayAudioID[stringNum-1]); // 传入audioID，play函数返回的
        cc.log("current ", lastPlayedTime);
        var lastTotalLen = cc.audioEngine.getDuration(lastPlayAudioID[stringNum-1]);
        if (cc.audioEngine.getState(lastPlayAudioID[stringNum-1]) == cc.audioEngine.AudioState.PLAYING && currentFret > lastFret[stringNum-1]) {
            cc.log("击弦！")
            cc.audioEngine.stop(lastPlayAudioID[stringNum-1]);
            lastPlayAudioID[stringNum-1] = cc.audioEngine.play(window.audioSet.uku[stringNum-1][currentFret]);
            cc.audioEngine.pause(lastPlayAudioID[stringNum-1]);
            cc.audioEngine.pauseAll();
            // cc.audioEngine.setCurrentTime(lastPlayAudioID[stringNum-1], lastPlayedTime);
            // cc.log("real ", cc.audioEngine.getCurrentTime(lastPlayAudioID[stringNum-1]));
            // this.scheduleOnce(function(){

            //     //cc.audioEngine.resume(lastPlayAudioID[stringNum-1]);
            //     cc.log("after ", cc.audioEngine.getCurrentTime(lastPlayAudioID[stringNum-1]));
            // }, 0.2);

            
            lastFret[stringNum-1] = currentFret;
        }
    },

    _findCurrentFret(stringNum){
        var currentFret = 0;
        for(var i = 17; i >= 0; i--){
            if (pressedFrets[stringNum-1][i] == true){
                currentFret = i;
                break;
            }
        }
        return currentFret;
    }
    // update (dt) {},
});
