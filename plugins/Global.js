
window.NetId = {
    C2S_SERVER_ASK: "0003",//客户端应答
    S2C_SERVER_ASK: "0004",//服务器主动推送

    C2S_HEARTBEAT: "0005", //心跳
    S2C_HEARTBEAT: "0006", //心跳

    C2S_LOGIN: "0011",
    S2C_LOGIN: "0012",
    C2S_REGISTER: "0015",
    S2C_REGISTER: "0016",


    C2S_DAILY: "0007",
    S2C_DAILY: "0008",

    C2S_ROOM_LOG: "0009",  //房间记录列表
    S2C_ROOM_LOG: "0010",  //房间记录列表
    C2S_PLAY_GAME_LOG: "lgc1",  //房间大体记录
    S2C_PLAY_GAME_LOG: "lgs1",  //房间大体记录
    C2S_ROUND_GAME_LOG: "lgc2",  //房间单局记录
    S2C_ROUND_GAME_LOG: "lgs2",  //房间单局记录

    C2S_SHOP_ORDER: "0025",
    S2C_SHOP_ORDER: "0026",
    C2S_APPLE_TRANS: "0027",
    S2C_APPLE_TRANS: "0028",
    C2S_SHOP: "0030",
    S2C_SHOP: "0031",
    C2S_BIND_INVITE: "0032",// --邀请码
    S2C_BIND_INVITE: "0033",//
    C2S_ADVICE: "0034",// --意见反馈

    C2S_READY: "0311",	   // 准备 
    S2C_READY: "0312",	   // 准备

    C2S_ROOM_CHAT: "0315",//		--房间聊天
    S2C_ROOM_CHAT: "0316",//		--聊天广播

    C2S_LEAVE_ROOM: "0317",//		--非房主在游戏未开始时离开房间
    S2C_LEAVE_ROOM: "0318",//		--广播

    C2S_JIESAN: "0319",//		--房主未开始游戏的时候解散房间
    S2C_JIESAN: "0320",//		--房间解散广播

    C2S_APPLY_JIESAN: "0321",//		--发起解散房间，发起后，进入投票环节
    S2C_APPLY_JIESAN: "0322",//		--广播
    C2S_APPLY_JIESAN_AGREE: "0323",//		--是否同意解散放假
    S2C_APPLY_JIESAN_AGREE: "0324",//		--广播


    S2C_OUT_LINE: "0330",//玩家离线
    S2C_IN_LINE: "0331",//玩家在线
    S2C_LOAD_USER_DATA: "0500", //同步所有user schema数据
    S2C_SYNC_USER_DATA: "0501", //同步单个user sc~hema数据



    C2S_GAME_ROOM_SERVER: "0101",//申请创建一个房号
    S2C_GAME_ROOM_SERVER: "0102",//房号返回
    S2C_JOIN_ROOM_SERVER: "0103",//当前用户已经创建房间了，但该房间与当前服务器不在同一个位置，需要前端切换
    C2S_JOIN_ROOM: "0104",//加入房间

    C2S_NN_CREATE_ROOM: "0401",//牛牛创建房间
    S2C_NN_CREATE_ROOM: "0402",//牛牛创建房间返回
    S2C_NN_JOIN_ROOM: "0403",// 加入房间

    S2C_NN_JOIN_ROOM_AGAIN: "0406",//登陆时有可能会发次命令，若返回的是OK，则表示要进入房间

    S2C_NN_TABLE_USER_INFO: "0411",//加入房间时，服务器同步玩家信息
    S2C_NN_GAME_STATUS: "0412",//游戏状态

    S2C_NN_COOL_DOWN: "0417",//倒计时
    C2S_NN_GAME_START: "0418",//开始游戏
    S2C_NN_GAME_START: "0419",


    C2S_NN_QIANG_HOST: "0420",//抢庄
    S2C_NN_QIANG_HOST: "0421",
    C2S_NN_XIA_ZHU: "0422",//下注
    S2C_NN_XIA_ZHU: "0423",
    S2C_NN_SEND_POKER: "0425",   // 发牌
    C2S_NN_CALCU_NIU: "0426",//算牛
    S2C_NN_CALCU_NIU: "0427",
    S2C_NN_DING_ZHU: "0428",	// 定庄
    S2C_NN_JIESUAN: "0429",	// 结算
    C2S_NN_ROOM_MATCH: "0430",//	   --匹配模式
    S2C_NN_ROOM_MATCH: "0431",//	   --匹配模式

    C2S_BROAD_CLIENT: "0604",
    S2C_BROAD: "0605",// -- 广播



    C2S_MJ_CREATE_ROOM: "0900",//创建麻将房间
    S2C_MJ_CREATE_ROOM: "0901",
    S2C_MJ_JOIN_ROOM: "0903",//加入麻将房间的返回

    S2C_MJ_JOIN_ROOM_AGAIN: "0905",//重新加入房间

    S2C_MJ_TABLE_USER_INFO: "0906",//其他玩家加入
    S2C_MJ_GAME_START: "0907",//游戏开始

    S2C_MJ_OUT_CARD_NOTIFY: "0908",//--出牌提示
    C2S_MJ_OUT_CARD: "0909",//--玩家出牌
    S2C_MJ_OUT_CARD: "0910",//--出牌结果返回

    C2S_MJ_OPERATE_REQUEST: "0912",//--操作请求
    S2C_MJ_OPERATE_RESULT: "0913",//--操作结果
    S2C_MJ_DRAW_CARD: "0914",//--抓牌
    S2C_MJ_HU: "0915",//胡牌  
    S2C_MJ_RESULT: "0916",//大结算
    S2C_MJ_OPERATE_NOTIFY: "0917",//--刷新notify
    C2S_SSS_CREATE_ROOM: "0800",    //创建十三水房间
    S2C_SSS_CREATE_ROOM: "0801",

    S2C_SSS_JOIN_ROOM: "0803",     //加入十三水房间
    C2S_SSS_GAME_START: "0804",
    S2C_SSS_GAME_START: "0805",
    S2C_SSS_SEND_POKER:"0806",   //发牌

    C2S_SSS_JOIN_ROOM_AGAIN: "0808",
    S2C_SSS_JOIN_ROOM_AGAIN: "0809",
    S2C_SSS_TABLE_USER_INFO: "0810",



    C2S_SSS_ROOM_MATCH: "0811",
    S2C_SSS_ROOM_MATCH: "0812",
};

window.NetIdForSend = {};
window.NetIdForSend[NetId.C2S_LOGIN] = "Login.Login_c2s";
window.NetIdForSend[NetId.C2S_GAME_ROOM_SERVER] = "Game.RoomServer_c2s";
window.NetIdForSend[NetId.C2S_NN_CREATE_ROOM] = "Game.CreateNNRoom_c2s";
window.NetIdForSend[NetId.C2S_JOIN_ROOM] = "Game.JoinRoom_c2s";
window.NetIdForSend[NetId.C2S_READY] = "Game.Ready_c2s";
window.NetIdForSend[NetId.C2S_NN_QIANG_HOST] = "Game.NNQiangHost_c2s";
window.NetIdForSend[NetId.C2S_NN_XIA_ZHU] = "Game.NNXiaZhu_c2s";
window.NetIdForSend[NetId.C2S_APPLY_JIESAN_AGREE] = "Game.JieSanRoomVote_c2s";
window.NetIdForSend[NetId.C2S_ROOM_CHAT] = "Game.RoomChat_c2s";
window.NetIdForSend[NetId.C2S_SHOP_ORDER] = "Game.ShopOrder_c2s";
window.NetIdForSend[NetId.C2S_DAILY] = "Game.Daily_c2s";
window.NetIdForSend[NetId.C2S_REGISTER] = "Login.Register_c2s";
window.NetIdForSend[NetId.C2S_NN_ROOM_MATCH] = "Game.RoomMatch_c2s";
window.NetIdForSend[NetId.C2S_APPLE_TRANS] = "Game.AppleOrder_c2s";
window.NetIdForSend[NetId.C2S_ROOM_LOG] = "Game.RoomLog_c2s";
window.NetIdForSend[NetId.C2S_BIND_INVITE] = "Game.BindInvite_c2s";
window.NetIdForSend[NetId.C2S_ADVICE] = "Game.Advice_c2s";

window.NetIdForSend[NetId.C2S_SERVER_ASK] = "Game.ServerAsk_c2s";
window.NetIdForSend[NetId.C2S_SHOP] = "Game.Shop_c2s";

//麻将协议
window.NetIdForSend[NetId.C2S_MJ_CREATE_ROOM] = "Game.CreateMJRoom_c2s";
window.NetIdForSend[NetId.C2S_MJ_OPERATE_REQUEST] = "Game.MJOperate_c2s";
window.NetIdForSend[NetId.C2S_MJ_OUT_CARD] = "Game.MJOutCard_c2s";
window.NetIdForSend[NetId.C2S_PLAY_GAME_LOG] = "Game.PlayGameLog_c2s";
window.NetIdForSend[NetId.C2S_ROUND_GAME_LOG] = "Game.RoundGameLog_c2s";

//十三水协议
window.NetIdForSend[NetId.C2S_SSS_CREATE_ROOM] = "SSS.SSS_CreateRoom_c2s";
window.NetIdForSend[NetId.C2S_SSS_ROOM_MATCH] = "Game.RoomMatch_c2s";

window.NetIdForRecv = {};
window.NetIdForRecv[NetId.S2C_LOGIN] = "Login.Login_s2c";
window.NetIdForRecv[NetId.S2C_LOAD_USER_DATA] = "Game.SyncUserData_s2c";
window.NetIdForRecv[NetId.S2C_SYNC_USER_DATA] = "Game.SyncUserData_s2c";
window.NetIdForRecv[NetId.S2C_GAME_ROOM_SERVER] = "Game.RoomServer_s2c";
window.NetIdForRecv[NetId.S2C_NN_CREATE_ROOM] = "Game.CreateNNRoom_s2c";
window.NetIdForRecv[NetId.S2C_JOIN_ROOM_SERVER] = "Game.JoinRoomServer_s2c";
window.NetIdForRecv[NetId.S2C_NN_TABLE_USER_INFO] = "Game.RoomUserInfo";
window.NetIdForRecv[NetId.S2C_NN_JIESUAN] = "Game.NN_JieSuan_s2c";
window.NetIdForRecv[NetId.S2C_IN_LINE] = "Game.InLine_s2c";
window.NetIdForRecv[NetId.S2C_OUT_LINE] = "Game.OutLine_s2c";
window.NetIdForRecv[NetId.S2C_NN_JOIN_ROOM_AGAIN] = "Game.NN_JoinRoomAgain_s2c";
window.NetIdForRecv[NetId.S2C_NN_JOIN_ROOM] = "Game.JoinRoom_s2c";
window.NetIdForRecv[NetId.S2C_READY] = "Game.Ready_s2c";
window.NetIdForRecv[NetId.S2C_NN_GAME_START] = "Game.NNGameStart_s2c";
window.NetIdForRecv[NetId.S2C_NN_COOL_DOWN] = "Game.NNCoolDown_s2c";
window.NetIdForRecv[NetId.S2C_NN_SEND_POKER] = "Game.NNSendPoker_s2c";
window.NetIdForRecv[NetId.S2C_NN_QIANG_HOST] = "Game.NNQiangHost_s2c";
window.NetIdForRecv[NetId.S2C_NN_XIA_ZHU] = "Game.NNXiaZhu_s2c";
window.NetIdForRecv[NetId.S2C_NN_CALCU_NIU] = "Game.NNCalcuNiu_s2c";
window.NetIdForRecv[NetId.S2C_NN_DING_ZHU] = "Game.NNDingZhuang_s2c";
window.NetIdForRecv[NetId.S2C_NN_GAME_STATUS] = "Game.NNGameStatus_s2c";
window.NetIdForRecv[NetId.S2C_LEAVE_ROOM] = "Game.LeaveGame_s2c";
window.NetIdForRecv[NetId.S2C_APPLY_JIESAN] = "Game.JieSanRoom_s2c";
window.NetIdForRecv[NetId.S2C_APPLY_JIESAN_AGREE] = "Game.JieSanRoomVote_s2c";
window.NetIdForRecv[NetId.S2C_ROOM_CHAT] = "Game.RoomChat_s2c";
window.NetIdForRecv[NetId.S2C_BROAD] = "Game.Broadcast_s2c";
window.NetIdForRecv[NetId.S2C_SHOP_ORDER] = "Game.ShopOrder_s2c";
window.NetIdForRecv[NetId.S2C_DAILY] = "Game.Daily_s2c";
window.NetIdForRecv[NetId.S2C_REGISTER] = "Login.Register_s2c";
window.NetIdForRecv[NetId.S2C_NN_ROOM_MATCH] = "Game.RoomMatch_s2c";
window.NetIdForRecv[NetId.S2C_APPLE_TRANS] = "Game.AppleOrder_s2c";
window.NetIdForRecv[NetId.S2C_ROOM_LOG] = "Game.RoomLog_s2c";
window.NetIdForRecv[NetId.S2C_BIND_INVITE] = "Game.BindInvite_s2c";

window.NetIdForRecv[NetId.S2C_SERVER_ASK] = "Game.ServerAsk_s2c";
//麻将协议
window.NetIdForRecv[NetId.S2C_MJ_CREATE_ROOM] = "Game.JoinMJRoom_s2c";
window.NetIdForRecv[NetId.S2C_MJ_TABLE_USER_INFO] = "Game.MJRoomUserInfo";
window.NetIdForRecv[NetId.S2C_MJ_JOIN_ROOM] = "Game.JoinMJRoom_s2c";
window.NetIdForRecv[NetId.S2C_MJ_GAME_START] = "Game.MJGameStart_s2c";
window.NetIdForRecv[NetId.S2C_MJ_OUT_CARD_NOTIFY] = "Game.MJNotifyOutCard";
window.NetIdForRecv[NetId.S2C_MJ_OPERATE_RESULT] = "Game.MJOperate_s2c";
window.NetIdForRecv[NetId.S2C_MJ_OUT_CARD] = "Game.MJOutCard_s2c";
window.NetIdForRecv[NetId.S2C_MJ_DRAW_CARD] = "Game.MJNotifyDrawCard_s2c";
window.NetIdForRecv[NetId.S2C_MJ_HU] = "Game.MJHu_s2c";
window.NetIdForRecv[NetId.S2C_MJ_JOIN_ROOM_AGAIN] = "Game.JoinMJRoomAgain_s2c";
window.NetIdForRecv[NetId.S2C_MJ_RESULT] = "Game.MJEndResult_s2c";
window.NetIdForRecv[NetId.S2C_MJ_GAME_LOG] = "Game.MJGameLog_s2c";

window.NetIdForRecv[NetId.S2C_PLAY_GAME_LOG] = "Game.PlayGameLog_s2c";
window.NetIdForRecv[NetId.S2C_ROUND_GAME_LOG] = "Game.RoundGameLog_s2c";
window.NetIdForRecv[NetId.S2C_SHOP] = "Game.Shop_s2c";
window.NetIdForRecv[NetId.S2C_MJ_OPERATE_NOTIFY] = "Game.MJOperateNotify";

//创建十三水房间
window.NetIdForRecv[NetId.S2C_SSS_CREATE_ROOM] = "SSS.SSS_CreateRoom_s2c";
window.NetIdForRecv[NetId.S2C_SSS_TABLE_USER_INFO] = "SSS.SSS_RoomUserInfo";
//加入十三水房间
window.NetIdForRecv[NetId.S2C_SSS_JOIN_ROOM] = "SSS.SSS_JoinRoom";
window.NetIdForRecv[NetId.S2C_SSS_JOIN_ROOM_AGAIN] = "SSS.SSS_JoinRoomAgain";
window.NetIdForRecv[NetId.S2C_SSS_GAME_START] = "SSS.SSS_GameStart_s2c";

//window.NetIdForRecv[NetId.S2C_SSS_SEND_POKER] = "Game.NNSendPoker_s2c";

window, NetIdForRecv[NetId.S2C_SSS_ROOM_MATCH] = "Game.RoomMatch_s2c";

window.ErrNo = {};

ErrNo.OK = "ok"

//公共错误
ErrNo.CARD_NOT_ENOUGH = "e0";// 房卡不足
ErrNo.GOLD_NOT_ENOUGH = "e1";//	-- 房卡不足

//登陆相关错误
ErrNo.FROZEN = "10";// 封号
ErrNo.ACCOUNT = "11";// -- 账号相关错误
ErrNo.PASSWORD = "12";// -- 密码相关错误
ErrNo.SDK_AUTH = "13";// -- 认证错误
ErrNo.SAVE_ACCOUNT = "14";// -- 保存账户失败
ErrNo.LOGIN_ERROR = "15";// -- 登陆相关其他的错误

//注册账号错误
ErrNo.REGISTER_ERROR = "20";

//游戏房间相关
ErrNo.CREATE_ROOM = "r1";//	-- 创建房间错误
ErrNo.JOIN_ROOM = "r2";//	-- 加入房间错误
ErrNo.ROOM_NOT_EXISTS = "r3";//-- 房间不存在
ErrNo.ROOM_FULL = "r4";//	-- 房间满了
ErrNo.ROOM_START = "r5";//	-- 房间已经开始

//领取日常错误
ErrNo.DAILY_ERROR = "d0";//


ErrNo.WAIT_FOR_MATCH = "o0";//	-- 正在匹配
ErrNo.IN_LIST_MATCH = "o1";//  -- 已经在匹配队列中
ErrNo.NO_ROOM_MATCH = "o2";

//离开房间原因
ErrNo.LEAVE_ROOM_SELF = "L1";//  -- 自己离开房间
ErrNo.LEAVE_ROOM_OUT_LINE = "L2";//  -- 掉线被踢
ErrNo.LEAVE_ROOM_NO_GOLD = "L3";//  -- 钱不够被踢
ErrNo.LEAVE_ROOM_WHEN_PALYING = "L4";//  -- 牌局正在进行中的时候，玩家主动退出