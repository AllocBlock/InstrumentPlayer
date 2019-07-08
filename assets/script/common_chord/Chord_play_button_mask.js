// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

// var this.state = 0; // 全局变量被所有实例共有！！！！！

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
        }
    },

    // LIFE-CYCLE CALLBACKS:


    onLoad () {
        var self = this;
        this.state = 0;
        this.node.on("event_button_clicked", function (op) {
            if (op == 0 && self.state == 0) self._fadeIn();
            else if (op == 1 && self.state == 1) self._fadeOut();
        });
    },

    _fadeIn: function () {
        this.state = 1;
        /*
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
        */
        this.node.opacity = this.MaxOpacity;
    },

    _fadeOut: function () {
        this.state = 0;
        /*
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
        */
        this.node.opacity = 0;
    },
    // update (dt) {},
});
