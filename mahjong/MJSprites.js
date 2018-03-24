/**
0x01,0x02,0x03,0x04,0x05,0x06,0x07,0x08,0x09,  万
0x11,0x12,0x13,0x14,0x15,0x16,0x17,0x18,0x19,  筒
0x21,0x22,0x23,0x24,0x25,0x26,0x27,0x28,0x29,  条
0x31      --  东风
0x32      --  南风
0x33      --  西风
0x34      --  北风
0x41      --  中
0x42      --  发
0x43      --  白

 */
cc.Class({
    extends: cc.Component,

    properties: {
        leftAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        rightAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        bottomAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        bottomFoldAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        emptyAtlas: {
            default: null,
            type: cc.SpriteAtlas
        },

        myEmpty: {
            default: null,
            type: cc.SpriteFrame
        },

        redLaizi: {
            default: null,
            type: cc.SpriteAtlas
        }
    },

    // use this for initialization
    onLoad: function () {
        if (cc.mgr.mj) {
            cc.mgr.mj.mjSprites = this;
        }


        this.spriteMap = new Map();
        for (let i = 1; i < 10; i++) {
            this.spriteMap.set('0x0' + i, 'character_' + i);
        }

        for (let i = 1; i < 10; i++) {
            this.spriteMap.set('0x1' + i, 'dot_' + i);
        }

        for (let i = 1; i < 10; i++) {
            this.spriteMap.set('0x2' + i, 'bamboo_' + i);
        }

        this.spriteMap.set('0x31', 'wind_east');
        this.spriteMap.set('0x32', 'wind_south');
        this.spriteMap.set('0x33', 'wind_west');
        this.spriteMap.set('0x34', 'wind_north');

        this.spriteMap.set('0x41', 'red');
        this.spriteMap.set('0x42', 'green');
        this.spriteMap.set('0x43', 'white');
    },

    getSpriteFrame: function (side, mjid) {
        if (mjid == 255) {
            return this.getEmptySpriteFrame(side);
        }
        let hex = cc.utils.dec2HexStr(mjid);
        let frameName = this.spriteMap.get(hex);
        frameName = side + frameName;

        if (cc.mgr.mj && cc.mgr.mj.isLaizi() && frameName.indexOf('red') != -1) {
            return this.redLaizi.getSpriteFrame(frameName);
        }

        if (side == "M_") {
            return this.bottomAtlas.getSpriteFrame(frameName);
        }
        else if (side == "B_") {
            return this.bottomFoldAtlas.getSpriteFrame(frameName);
        }
        else if (side == "L_") {
            return this.leftAtlas.getSpriteFrame(frameName);
        }
        else if (side == "R_") {
            return this.rightAtlas.getSpriteFrame(frameName);
        }
    },

    getEmptySpriteFrame: function (side) {
        if (side == "M_") {
            return this.myEmpty;
        }
        else if (side == "B_") {
            //return this.emptyAtlas.getSpriteFrame('e_mj_b_up');
            return this.myEmpty;
        }
        else if (side == "L_") {
            return this.emptyAtlas.getSpriteFrame('e_mj_b_left');
        }
        else if (side == "R_") {
            return this.emptyAtlas.getSpriteFrame('e_mj_b_right');
        }
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
