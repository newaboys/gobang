<template>
    <div class="main">
        <a-spin :tip="spinData.tip" :spinning="spinData.spinning">
            <a-layout>
                <a-layout-header class="top tb">
                    <div class="playerP p1">
                        <svg-icon :name="flagColor[currentPlayer]" class="player"
                                  :class="{active:playing===currentPlayer && playing,[currentPlayer]:true}"></svg-icon>
                        <div class="player_name">{{playerNames[currentPlayer]}}</div>
                    </div>
                    <a-progress type="circle" :percent="percent[currentPlayer]" :width="40" strokeColor="red"
                                :format="()=>second[currentPlayer]"/>
                </a-layout-header>
                <a-layout-content>
                    <div class="left">
                        <Crose v-for="i in nums"
                               :key="i"
                               @putFlag="putFlag"
                               :index="i"
                               :change-position="changePosition"
                               :result="result"
                               :flagColor="flagColor"
                               :lastFlagIndex="lastFlagIndex"
                               :status="statusArr[i]"
                               :rowLength="rowLength"
                               :currPlayer="arrs[i]"></Crose>

                        <transition name="fade">
                        <div class="modal" v-if="result.flag==='end'">
                             <a-result  :title="resultMsg.title"
                                      :sub-title="resultMsg.subTitle" class="result">
                                <template #icon>
                                    <svg-icon :name="result.winner === currentPlayer?'victory':'fail'"
                                              :style="{height: '70px',width: '70px',color:result.winner === currentPlayer?'':'yellow'}"></svg-icon>
                                </template>
                                <template #extra>
                                    <a-button type="primary" @click="goOn()">
                                        继续
                                    </a-button>
                                </template>
                            </a-result>
                        </div>
                        </transition>
                        <a-drawer v-if="drawerVisible" class="drawer"
                                  title="信息"
                                  placement="top"
                                  :closable="false"
                                  :visible="drawerVisible"
                                  :size="{value:'default'}"
                                  :get-container="false"
                                  height="200px"
                                  :style="{ position: 'absolute'}"
                        >
                            <a-result :title="msgTitle">
                                <template #icon>
                                </template>
                                <template #extra>
                                    <a-button type="primary" @click="goOn('yes')">
                                        是
                                    </a-button>
                                    <a-button type="primary" @click="goOn('no')">
                                        否
                                    </a-button>
                                </template>
                            </a-result>
                        </a-drawer>
                    </div>
                </a-layout-content>
                <a-layout-header class="footer tb">
                    <a-progress type="circle" :percent="percent[otherPlayer]" :width="40" strokeColor="red"
                                :format="()=>second[otherPlayer]"/>
                    <div class="playerP p2">
                        <div class="player_name">{{playerNames[otherPlayer]}}</div>
                        <svg-icon :name="flagColor[otherPlayer]" class="player"
                                  :class="{active:playing===otherPlayer && playing,[otherPlayer]:true}"></svg-icon>
                    </div>
                </a-layout-header>
            </a-layout>
        </a-spin>
        <div class="right">
            <a-card style="width: 300px" class="curr_player" :bordered="false">
                <div class="curr_player_right">

                </div>
            </a-card>
        </div>
    </div>
</template>

<script>
    import Crose from './crose.vue'

    export default {
        name: 'five',
        components: {
            Crose
        },
        created() {
            for (let i = 0; i < this.nums; i++) {
                this.arrs.push("");
                this.statusArr.push(false);
            }
        },
        data() {
            return {
                nums: 360,
                userId: "",
                statusArr: [],
                arrs: [],
                currentPlayer: "",//本机的玩家标识
                otherPlayer: "",//另外一个玩家标识
                playing: '',//当前的玩家标识
                players: ['player1', 'player2'],
                playersRecords: {'player1': [], 'player2': []},
                lastFlagIndex: -1,
                changePosition: -1,
                uuids: {
                    'player1': '',
                    'player2': ''
                },
                flagColor:{
                    'player1': 'white',
                    'player2': 'black'
                },
                playerNames: {
                    'player1': '',
                    'player2': ''
                },
                rowLength: 20,
                drawerVisible: false,
                msgTitle: "",
                warStatus: "",
                warDict: {
                    waitting_battle: "等待对方接受对局...",
                    battle_refused: "对方已拒绝对局",
                    battle_accepted: "对方已接受对局"
                },
                second: {
                    'player1': 60,
                    'player2': 60,
                },
                percent: {
                    'player1': -1,
                    'player2': -1,
                },
                timer: null
            }
        },
        computed: {
            result() {
                // return {winner: "player1", flag: 'end', arr: []};
                let self = this;
                let res = {winner: "", flag: 'next', arr: []};
                Object.keys(this.playersRecords).forEach(key => {
                    if (res.flag === "end") return;
                    let indexArr = [];//index数组
                    let xArr = [];//x数组
                    let yArr = [];//y数组
                    let xToy = {[key]: []};//用于判断纵向连续
                    let arrsItalic = [];//45°计算
                    if (self.playersRecords[key].length < 5) return;
                    self.playersRecords[key].forEach(sub => {
                        indexArr.push(sub.index);
                        xArr.push(sub.x);
                        yArr.push(sub.y);
                        if (xToy[key][sub.x] != null) {
                            xToy[key][sub.x].push(sub.y);
                        } else {
                            xToy[key][sub.x] = [sub.y];
                        }
                        xToy[key][sub.x + '' + sub.y] = sub.index;
                        xToy[key][sub.x].sort((a, b) => a - b);
                        if (((sub.y - 1) * this.rowLength + sub.x) === sub.index) {
                            arrsItalic.push(sub.index);
                        }
                    });
                    indexArr.sort((a, b) => a - b);
                    //横向
                    res = this.calcWinner(indexArr, key);
                    if (res.flag === 'end') {
                        return;
                    }
                    //纵向
                    for (let i = 0; i < Object.keys(xToy[key]).length; i++) {
                        let subKey = Object.keys(xToy[key])[i];
                        let tempArr = xToy[key][subKey];
                        res = this.calcWinner(tempArr, key);
                        if (res.flag === 'end') {
                            res.arr.forEach((y, i) => {
                                res.arr[i] = xToy[key][subKey + '' + y];
                            });
                            break;
                        }
                    }
                    if (res.flag === 'end') {
                        return;
                    }
                    //斜向
                    res = this.calcWinnerItalic(indexArr, key);
                });
                if(this.second[this.currentPlayer] <= 0){
                    res = {winner: this.otherPlayer, flag: 'end', arr: []};
                }
                if(this.second[this.otherPlayer] <= 0){
                    res = {winner: this.currentPlayer, flag: 'end', arr: []};
                }
                return res;
            },
            resultMsg() {
                let title, subTitle;
                if (this.currentPlayer === this.result.winner) {
                    title = "胜利";
                    subTitle = "恭喜你！，" + this.playerNames[this.currentPlayer];
                } else {
                    title = "失败";
                    subTitle = this.playerNames[this.currentPlayer] + "，你获得了一坨屎！！";
                }
                if(this.second[this.currentPlayer] <= 0){
                    title = "你已超时";
                    subTitle = "失败！，" + this.playerNames[this.currentPlayer];
                }
                if(this.second[this.otherPlayer] <= 0){
                    title = "对方超时";
                    subTitle = "胜利！，躺赢！";
                }
                return {
                    title: title,
                    subTitle: subTitle
                }
            },
            spinData() {
                let tip, spinning;
                if (this.currentPlayer) {
                    spinning = false;
                    if (this.warStatus === "waitting_battle") {
                        tip = this.warDict[this.warStatus];
                        spinning = true;
                    }
                } else {
                    spinning = true;
                    tip = "对手正在准备中...";
                }
                return {
                    tip: tip,
                    spinning: spinning
                }
            },

        },
        watch: {
            playing: {
                immediate: true,
                handler(val) {
                    if (val === this.playing && val !== ""  ) {
                        this.second[this.playing] = 60;
                        this.percent[this.playing] = 100;
                        if (this.timer) {
                            clearInterval(this.timer);
                        }
                        let times = 60000;
                        let self = this;
                        this.timer = setInterval(function () {
                            times -= 100;
                            if (times % 1000 === 0) {
                                self.second[self.playing] -= 1;
                            }
                            if (self.second[self.playing] <= 0) {
                                self.second[self.playing] = 0;
                                self.percent[self.playing] = 0;
                                clearInterval(self.timer);
                            } else {
                                self.percent[self.playing] -= 0.16;
                            }
                        }, 100);
                    }
                }

            }
        },
        mounted() {
            let self = this;
            this.ws.init({
                onOpen: function (e) {
                    //第一次链接  后端存储ws并返回 唯一标识
                    self.ws.send({
                        uuid: '',
                        params: [{cmd: 'first_connect', playerName: self.$route.query.playerName}]
                    });
                },
                onMessage: function (e) {
                    let msgJSON = JSON.parse(e.data);
                    let {cmd, from, to} = msgJSON;
                    if (cmd === 'update') {
                        let {data} = msgJSON;
                        data.forEach(item => {
                            self[item.key] = item.val;
                        });
                    } else if (cmd === 'talk') {
                        let {data} = msgJSON;
                        if (data.status === "yes") {//同意对战
                            self.msgTitle = "";
                            self.drawerVisible = false;
                            self.warStatus = "";
                            self.reset();
                            self.ws.send({
                                uuid: self.uuids[self.currentPlayer],
                                params: [{
                                    cmd: 'method',
                                    to: [self.uuids[self.otherPlayer]],
                                    data: [{key: "reset", params: []}]
                                },
                                    {
                                        cmd: 'update',
                                        to: [self.uuids[self.otherPlayer]],
                                        data: [{key: "drawerVisible", val: false}, {key: "warStatus", val: ""}]
                                    }]
                            });
                        } else {//拒绝对战
                            self.ws.send({
                                uuid: self.uuids[self.currentPlayer],
                                params: [{
                                    cmd: 'update',
                                    to: [self.uuids[self.otherPlayer]],
                                    data: [{key: "warStatus", val: "battle_refused"}]
                                }]
                            });
                        }
                    } else if (cmd === 'method') {
                        let {data} = msgJSON;
                        data.forEach(item => {
                            self[item.key]();
                        });
                    }
                }
            });
        },
        methods: {
            format(pl) {
                return this.second[this.playing];
            },
            /***
             ** 放置旗子事件
             **/
            putFlag(i, x, y) {
                if (this.result.flag === "end" || this.playing !== this.currentPlayer) return;
                if (this.statusArr[i]) {
                    return;
                }
                this.statusArr[i] = true;
                this.arrs[i] = this.playing;
                this.lastFlagIndex = i;
                let item = {index: i, x: x, y: y};
                this.playersRecords[this.arrs[i]].push(item);
                this.playersRecords[this.arrs[i]].sort(sub => {
                    return sub.index - sub.index > 0;
                });
                this.playing === this.players[0] ? this.playing = this.players[1] : this.playing = this.players[0];
                clearInterval(this.timer);
                this.second[this.currentPlayer] = 60;
                this.percent[this.currentPlayer] = 0;
                //通知另外选手更新
                this.ws.send({
                    uuid: this.uuids[this.currentPlayer],
                    params: [
                        {
                            cmd: "update",
                            data: [
                                {key: "playing", val: this.playing},
                                {key: "statusArr", val: this.statusArr},
                                {key: "arrs", val: this.arrs},
                                {key: "playersRecords", val: this.playersRecords},
                                {key: "lastFlagIndex", val: this.lastFlagIndex},
                                {key: "second", val: this.second},
                                {key: "percent", val: this.percent},
                            ],
                            to: [this.uuids[this.otherPlayer]]
                        }
                    ]
                });
            },
            /**
             * 计算哪一个是赢家  45°方向
             * **/
            calcWinnerItalic(arrs, key) {
                let successArr = [];//记录五子连珠的索引
                let arrFlag = arrs.some((item, index) => {
                    let nums1 = 0;
                    let nums2 = 0;
                    successArr = [];
                    for (let i = 1; i < 5; i++) {
                        let val1 = item + (this.rowLength + 1) * i;
                        successArr.push(item);
                        if (arrs.includes(val1)) {
                            nums1++;
                            successArr.push(val1);
                        }
                        let val2 = item + (this.rowLength - 1) * i;
                        if (arrs.includes(val2)) {
                            nums2++;
                            successArr.push(val2);
                        }
                    }
                    return nums1 === 4 || nums2 === 4;
                });
                if (arrFlag) {
                    return {winner: key, flag: 'end', arr: successArr};
                }
                return {winner: "", flag: 'next', arr: []}
            },
            /**
             * 计算哪一个是赢家  横向
             * **/
            calcWinner(arrs, key) {
                let start = 0;
                let end = 5;
                let arrFlag = false;
                let successArr = [];//记录五子连珠的索引
                while (end <= arrs.length && !arrFlag) {
                    let tempA = arrs.slice(start, end);
                    if ((tempA[4] - tempA[0]) === 4) {
                        arrFlag = true;
                        successArr = tempA;
                    } else {
                        start += 1;
                        end += 1;
                    }
                }
                if (arrFlag) {
                    return {winner: key, flag: 'end', arr: successArr};
                }
                return {winner: "", flag: 'next', arr: []}
            },
            goOn(status) {
                if (!status) {
                    this.ws.send({
                        uuid: this.uuids[this.currentPlayer],
                        params: [{
                            cmd: 'update',
                            to: [this.uuids[this.otherPlayer]],
                            data: [{key: "drawerVisible", val: true}, {key: "msgTitle", val: "对方向你发起了下一波对局，是否接受？"}]
                        }]
                    });
                    this.warStatus = "waitting_battle";
                } else {
                    this.ws.send({
                        uuid: this.uuids[this.currentPlayer],
                        params: [{
                            cmd: 'talk',
                            to: [this.uuids[this.otherPlayer]],
                            data: {status: status}
                        }]
                    });
                }
            },
            reset() {
                this.statusArr.map((item, index) => {
                    this.statusArr[index] = false;
                });
                this.arrs.map((item, index) => {
                    this.arrs[index] = "";
                });
                this.playersRecords = {'player1': [], 'player2': []};
                this.lastFlagIndex = -1;
                this.second = {player1:60,player2:60};
                this.percent = {player1:-1,player2:-1};
            }
        },
    }

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .main {
        display: flex;
        width: 1050px;
        max-width: 1050px;
        padding: 10px;
        align-items: center;
        justify-content: center;
    }

    .fade-enter-active,
    .fade-leave-active{
        transition: height 5s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
        height: 0;
    }

    .modal {
        width: 100%;
        height: var(--flag-board-height);
        position: absolute;
        background-color: rgb(0, 0, 0, 0.6);
    }

    :deep(.drawer .ant-drawer-body) {
        padding: unset;
    }

    :deep(.drawer .ant-result) {
        padding: unset;
    }

    :deep(.result .ant-result-title) {
        color: white;
    }

    :deep(.result .ant-result-subtitle) {
        color: white;
    }

    .result {
        position: absolute;
        margin: auto;
        width: 350px;
        height: 350px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        opacity: 0.7;
    }

    .left {
        position: relative;
        display: flex;
        width: var(--flag-board-width);
        height: var(--flag-board-height);
        flex-flow: row wrap;
        align-content: baseline;
        border: 1px solid var(--net-line-color);
        background-color: var(--flag-background-color);
    }

    .right {
        margin-left: 10px;
        width: 300px;
    }

    .p1 {
        justify-content: flex-start;
    }

    .p2 {
        justify-content: flex-end;
    }

    .tb {
        background: white;
        display: flex;
        align-items: center;
        justify-content: space-between;
        border: 1px solid var(--net-line-color);
    }

    .curr_player {
        position: fixed;
        line-height: 40px;
    }

    :deep(.curr_player .ant-card-body) {
        display: flex;
        flex-direction: row;
        align-items: center;
    }

    .curr_player .curr_player_left {
        display: flex;
        flex-direction: column;
        width: fit-content;
    }

    .curr_player .curr_player_right {
        flex: 1;
    }

    .playerP {
        display: flex;
        align-items: center;
    }

    .player_name {
        text-align: left;
    }

    .player {
        height: calc(var(--flag-size) * 4 / 2);
        width: calc(var(--flag-size) * 4 / 2);
        margin: 0 15px;
    }

    .player1 {
        color: var(--palyer1);
    }

    .player2 {
        color: var(--palyer2);;
    }

    .active {
        border-radius: 50%;
        border: var(--active-border-width) solid var(--active-border-color);
        animation: mymove 5s infinite;
        -webkit-animation: mymove 5s infinite; /*Safari and Chrome*/
        animation-direction: alternate; /*轮流反向播放动画。*/
        animation-timing-function: ease-in-out; /*动画的速度曲线*/
        /* Safari 和 Chrome */
        -webkit-animation: mymove 5s infinite;
        -webkit-animation-direction: alternate; /*轮流反向播放动画。*/
        -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
    }

    @-webkit-keyframes mymove /*Safari and Chrome*/
    {
        0% {
            transform: scale(1); /*开始为原始大小*/
        }
        25% {
            transform: scale(1.5); /*放大1.1倍*/
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.5);
        }
    }

</style>
