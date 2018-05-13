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
        FadeinTime:{
            default: 0.5
        },
        FadeoutTime:{
            default: 0.5
        },
        MaxOpacity: {
            default: 100
        },
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        var self = this;
        this.current = 0;   //默认不显示
        this.node.on("Chord_Button_Clicked", function (event) {
            if (self.current == 0){
                self._FadeIn();
            }
            else if (self.current == 1){
                self._FadeOut();
            }
          });
    },

    _FadeIn: function () {
        var self = this;
        this.current = 1;
        var current_opacity = self.node.opacity;
        var i = current_opacity;
        this.FadeIn_callback = function(){  
            if (this.current == 0) this.unschedule(this.FadeIn_callback);
            self.node.opacity = i;
            i++;
            // cc.log("++++++++");      //透明度增加
        }
        this.schedule(this.FadeIn_callback, self.FadeinTime / (self.MaxOpacity - current_opacity), self.MaxOpacity - current_opacity); 
    },

    _FadeOut: function () {
        var self = this;
        this.current = 0;
        // var i = self.MaxOpacity;
        var current_opacity = self.node.opacity;
        var i = current_opacity;
        this.FadeOut_callback = function(){  
            if (this.current == 1) this.unschedule(this.FadeOut_callback);
            self.node.opacity = i;
            i--;
            // cc.log("--------");      //透明度减少
        }
        this.schedule(this.FadeOut_callback, self.FadeoutTime / current_opacity, current_opacity);  
        
    },
    // update (dt) {},
});
