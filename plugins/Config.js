// 游戏全局配置

// window.ServerIp = "10.0.0.45";
window.ServerIp = "10.0.0.250";
// window.ServerIp = "10.0.109.223";
//window.ServerIp = '121.43.179.32';
//    window.ServerIp = "server1.sudagame.com";
window.ServerPort = 8888;

window.Config = {
    wxurl:'http://zpwdl.sudagame.com/',
	wxtitle:'【指牌屋】',
	wxdesc:'专业棋牌平台，包含牛牛、麻将等风靡全国的棋牌游戏。欢迎下载。',
    game:'zpw',
	bundle:'com.soda.zhipaiwu',
	update:'https://res.sudagame.com/',
};


window.WXScene ={
	WXSceneSession  : 0,        /**< 聊天界面    */
	WXSceneTimeline : 1,        /**< 朋友圈      */
	WXSceneFavorite : 2,        /**< 收藏       */
};

window.GameType ={
	NiuNiu  : 1,        /**< 牛牛    */
	Mahjong: 2,
	SSS: 3,
}

window.RoomType = new Map();
RoomType.set(GameType.NiuNiu, ['', '房主庄', '抢庄', '轮庄', '发四张抢庄']);
RoomType.set(GameType.SSS, ['', '房主庄', '抢庄', '轮庄', '发四张抢庄']);
window.MJName = new Map([
	[1,'转转麻将'],
	[2,'钦州麻将'],
	[3,'南宁麻将'],
	[4,'奈曼麻将'],
]);

// 有方言的mj_type列表
window.DialectList = [];