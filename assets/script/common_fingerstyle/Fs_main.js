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
var audioSet = [];
var instrumentInfo;

cc.Class({
    extends: cc.Component,

    properties: {
        letRing: false,
        mute: false,
        pickOn: false,
        decay: 0.0
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

        instrumentInfo = window.instrumentInfo;
        // 载入音轨
        
        // cc.loader.loadResDir(instrumentInfo.audioDir, cc.AudioClip, function (err, clips){
        //         for(var i = 0; i < instrumentInfo.stringsNum; i++){
        //             audioSet[i] = clips.slice(instrumentInfo.stringsBasic[i]);
        //         }
        //         // audioSet[0] = clips.slice(9); // 1弦
        //         // audioSet[1] = clips.slice(4); // 2弦
        //         // audioSet[2] = clips;          // 3弦
        //         // audioSet[3] = clips.slice(7); // 4弦

        //     }
        // );
        // 载入音轨
        for(var i = 0; i < instrumentInfo.stringsNum; i++){ 
            (function(i){// 使用函数来防止被参数修改的问题
                cc.loader.loadResDir(instrumentInfo.audioDir, cc.AudioClip, function (err, clips){
                    audioSet[i] = clips.slice(instrumentInfo.stringsBasic[i]);
                });
            })(i);
        }

        // 键盘初始化
        for(var i = 0; i < 255; i++) keyState[i] = false;

        // 品位状态初始化
        for(var i = 0; i < instrumentInfo.stringsNum; i++)
            for(var j = 0; j < instrumentInfo.maxFret; j++)
                pressedFrets[i][j] = false;

        // 品位标记初始化
        var scrollViewContent = this.node.getChildByName("Board").getChildByName("Frets").getChildByName("view").getChildByName("content");
            // 注意命名规则
        for(var i = 0; i < instrumentInfo.stringsNum; i++)
            pressedMark[i] = scrollViewContent.getChildByName("pressedMark"+(i+1));
        
        // 键盘映射初始化

        for (var key in instrumentInfo.keyMap)
            keyMap.set(cc.macro.KEY[key],  instrumentInfo.keyMap[key]);
        keyMap.set(12,  [0, 4]); // ..
        
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        
        if (keyState[event.keyCode] == true) return;
        keyState[event.keyCode] = true;
        //console.log("KEY DOWN ", event.keyCode);

        if (keyMap.has(event.keyCode)){
            var pressedFret = keyMap.get(event.keyCode);
            if (pressedFret[0] == 0){ // 弹奏键
                this._play(pressedFret[1]);
            }
            else{
                pressedFrets[pressedFret[0]-1][pressedFret[1]] = true;
                var currentFret = this._updateState(pressedFret[0]);
                
                //console.log(pressedFret[0], "弦 第", pressedFret[1], "品，按下");
            }
        }

    },

    onKeyUp: function (event) {
        keyState[event.keyCode] = false;

        if (keyMap.has(event.keyCode)){ 
            var releasedFret = keyMap.get(event.keyCode);
            if (releasedFret[0] == 0) return;

            pressedFrets[releasedFret[0]-1][releasedFret[1]] = false;
            var currentFret = this._updateState(releasedFret[0]);

            if (!this.letRing && currentFret == releasedFret[1]) cc.audioEngine.stop(lastPlayAudioID[releasedFret[0]-1]);

            //console.log(releasedFret[0], "弦 第", releasedFret[1], "品，释放");
        }
    },

    _play: function(stringNum){
        //console.log("弹奏", stringNum, "弦");

        var currentFret = this._findCurrentFret(stringNum);

        lastPlayAudioID[stringNum-1] = cc.audioEngine.play(audioSet[stringNum-1][currentFret], false, 1);
        lastFret[stringNum-1] = currentFret;
        
    },

    _updateState: function(stringNum){
        var currentFret = this._findCurrentFret(stringNum);
        this._updateFretMark(stringNum, currentFret);
        this._hammerAndPick(stringNum, currentFret);
        return currentFret; // additional
    },

    _updateFretMark: function(stringNum, currentFret){
        if (currentFret == 0){
            pressedMark[stringNum-1].x = -100;
        }
        else{
            pressedMark[stringNum-1].x = instrumentInfo.fretsPos[currentFret-1];
        }
    },

        

    _hammerAndPick: function(stringNum, currentFret){
        //if (cc.audioEngine.getState(lastPlayAudioID[stringNum-1]) == cc.audioEngine.AudioState.PLAYING && currentFret > lastFret[stringNum-1]) {
        if (cc.audioEngine.getState(lastPlayAudioID[stringNum-1]) == cc.audioEngine.AudioState.PLAYING && currentFret != lastFret[stringNum-1]) {
            if (!this.pickOn && currentFret < lastFret[stringNum-1]) return;
            
            //cc.log(stringNum, "弦，击/勾弦！", lastFret[stringNum-1] , " -> ", currentFret);
            var lastPlayedTime = cc.audioEngine.getCurrentTime(lastPlayAudioID[stringNum-1]); // 传入audioID，play函数返回的   
            cc.audioEngine.stop(lastPlayAudioID[stringNum-1]);

            lastPlayAudioID[stringNum-1] = cc.audioEngine.play(audioSet[stringNum-1][currentFret], false, 1);
            var audioID = lastPlayAudioID[stringNum-1];
            var targetTime = lastPlayedTime;
            this._audioStateTracker = function () {
                if (cc.audioEngine.getState(audioID) != cc.audioEngine.AudioState.INITIALZING){
                    cc.audioEngine.setCurrentTime(audioID, targetTime + this.decay);
                    this.unschedule(this._audioStateTracker);
                }
            },
            this.unscheduleAllCallbacks();
            this.schedule(this._audioStateTracker, 0.0001);
            //this.schedule(this._audioStateTracker, 0.0001);
            
            lastFret[stringNum-1] = currentFret;
        }
    },

    _findCurrentFret(stringNum){
        var currentFret = 0;
        for(var i = instrumentInfo.maxFret; i >= 0; i--){
            if (pressedFrets[stringNum-1][i] == true){
                currentFret = i;
                break;
            }
        }
        return currentFret;
    }
    // update (dt) {},
});
