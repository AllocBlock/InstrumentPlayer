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

    onLoad () {
        var instrumentInfo = {};
        instrumentInfo.name = "Ukulele";
        instrumentInfo.audioDir = "audio/Ukulele";
        instrumentInfo.stringsNum = 4;
        instrumentInfo.stringsBasic = [9, 4, 0 ,7];
        instrumentInfo.maxFret = 17;
        instrumentInfo.fretsPos = [84, 250, 400, 550, 690, 830, 965, 1090, 1220, 1336, 1448, 1560, 1666, 1762, 1862, 1946, 2030, 2114]
        instrumentInfo.keyMap = new Map();
        instrumentInfo.keyMap['1'] = [1, 1];
        instrumentInfo.keyMap['2'] = [1, 2];
        instrumentInfo.keyMap['3'] = [1, 3];
        instrumentInfo.keyMap['4'] = [1, 4];
        instrumentInfo.keyMap['5'] = [1, 5];
        instrumentInfo.keyMap['6'] = [1, 6];
        instrumentInfo.keyMap['7'] = [1, 7];
        instrumentInfo.keyMap['8'] = [1, 8];
        instrumentInfo.keyMap['9'] = [1, 9];
        instrumentInfo.keyMap['0'] = [1, 10];
        instrumentInfo.keyMap['dash'] = [1, 11];
        instrumentInfo.keyMap['='] = [1, 12];
        instrumentInfo.keyMap['q'] = [2, 1];
        instrumentInfo.keyMap['w'] = [2, 2];
        instrumentInfo.keyMap['e'] = [2, 3];
        instrumentInfo.keyMap['r'] = [2, 4];
        instrumentInfo.keyMap['t'] = [2, 5];
        instrumentInfo.keyMap['y'] = [2, 6];
        instrumentInfo.keyMap['u'] = [2, 7];
        instrumentInfo.keyMap['i'] = [2, 8];
        instrumentInfo.keyMap['o'] = [2, 9];
        instrumentInfo.keyMap['p'] = [2, 10];
        instrumentInfo.keyMap['['] = [2, 11];
        instrumentInfo.keyMap[']'] = [2, 12];
        instrumentInfo.keyMap['a'] = [3, 1];
        instrumentInfo.keyMap['s'] = [3, 2];
        instrumentInfo.keyMap['d'] = [3, 3];
        instrumentInfo.keyMap['f'] = [3, 4];
        instrumentInfo.keyMap['g'] = [3, 5];
        instrumentInfo.keyMap['h'] = [3, 6];
        instrumentInfo.keyMap['j'] = [3, 7];
        instrumentInfo.keyMap['k'] = [3, 8];
        instrumentInfo.keyMap['l'] = [3, 9];
        instrumentInfo.keyMap[';'] = [3, 10];
        instrumentInfo.keyMap['quote'] = [3, 11];
        instrumentInfo.keyMap['z'] = [4, 1];
        instrumentInfo.keyMap['x'] = [4, 2];
        instrumentInfo.keyMap['c'] = [4, 3];
        instrumentInfo.keyMap['v'] = [4, 4];
        instrumentInfo.keyMap['b'] = [4, 5];
        instrumentInfo.keyMap['n'] = [4, 6];
        instrumentInfo.keyMap['m'] = [4, 7];
        instrumentInfo.keyMap[','] = [4, 8];
        instrumentInfo.keyMap['.'] = [4, 9];
        instrumentInfo.keyMap['forwardslash'] = [4, 10];

        instrumentInfo.keyMap[12] = [0, 4];
        instrumentInfo.keyMap['/'] = [0, 3]; 
        instrumentInfo.keyMap['*'] = [0, 2]; 
        instrumentInfo.keyMap['-'] = [0, 1];

        window.instrumentInfo = instrumentInfo;
    }
});
