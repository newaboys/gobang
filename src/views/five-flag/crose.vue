<template>
    <div class="sq">
        <div class="crose">
            <div v-for="i in 4" :key="i" class="item">
            </div>
        </div>
        <svg-icon :name="flagColor[currPlayer]" :class="setStatus" class="flag" @click="putFlag"></svg-icon>
        <div :class="{'last':lastFlagIndex === this.index}"></div>
    </div>
</template>

<script>
    export default {
        name: 'crose',
        props: {
            index: Number,
            currPlayer: String,//当前位置属于哪一个玩家
            result: Object,
            rowLength: Number,
            changePosition: Number,
            status: Boolean,//是否已下子
            lastFlagIndex: Number,
            flagColor:Object
        },
        emits: ['putFlag'],
        data() {
            return {
                colors: ['red', 'blue'],
                x: 1,
                y: 1,
            }
        },
        computed: {
            setStatus() {
                return {
                    'show': this.status, 'hide': !this.status, 'success': this.result.arr.includes(this.index),
                    'player1': this.currPlayer === 'player1',
                    'player2': this.currPlayer === 'player2'
                };
            },
        },
        created() {
            this.x = this.index % this.rowLength;
            this.y = parseInt(this.index / this.rowLength) + 1;
        },
        methods: {
            putFlag() {
                this.$emit('putFlag', this.index, this.x, this.y);
            }
        }
    }
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
    .sq {
        position: relative;
        width: calc(var(--flag-size) * 2 + 2px);
        height: calc(var(--flag-size) * 2 + 2px);
    }

    .last {
        position: absolute;
        background: red;
        width: calc(var(--flag-size) / 2 ) !important;
        height: calc(var(--flag-size) / 2 ) !important;
        top: 0;
        left: 0;
        bottom: 0;
        right: 0;
        margin: auto;
    }

    .player1 {
        color: var(--palyer1);
    }

    .player2 {
        color: var(--palyer2);
    }

    .show {
        opacity: 1;
    }

    .hide {
        opacity: 0;
    }

    .crose {
        display: flex;
        flex-flow: row wrap;
        width: calc(var(--flag-size) * 2 + 2px);
        height: calc(var(--flag-size) * 2 );
    }

    .item {
        height: var(--flag-size);
        flex: 1 1 var(--flag-size);
    }

    .item:nth-child(2) {
        border-bottom: 1px solid var(--net-line-color);
        border-left: 1px solid var(--net-line-color);
    }

    .item:nth-child(3) {
        position: relative;
        top: -1px;
        border-top: 1px solid var(--net-line-color);
        border-right: 1px solid var(--net-line-color);
    }

    .flag {
        cursor: pointer;
        position: absolute;
        margin: auto;
        right: 0;
        left: 0;
        top: 0;
        bottom: 0;
        width: calc(var(--flag-size) * 4 / 2);
        height: calc(var(--flag-size) * 4 / 2);
    }

    *, *::before, *::after {
        box-sizing: content-box !important;
    }

    .success {
        /*border-radius: 50%;
        border: var(--active-border-width) solid var(--active-border-color);*/
        animation: mymove 4s infinite;
        -webkit-animation: mymove 4s infinite; /*Safari and Chrome*/
        animation-direction: alternate; /*轮流反向播放动画。*/
        animation-timing-function: ease-in-out; /*动画的速度曲线*/
        /* Safari 和 Chrome */
        -webkit-animation: mymove 4s infinite;
        -webkit-animation-direction: alternate; /*轮流反向播放动画。*/
        -webkit-animation-timing-function: ease-in-out; /*动画的速度曲线*/
    }

    @-webkit-keyframes mymove /*Safari and Chrome*/
    {
        0% {
            transform: scale(1); /*开始为原始大小*/
        }
        25% {
            transform: scale(1.2); /*放大1.1倍*/
        }
        50% {
            transform: scale(1);
        }
        75% {
            transform: scale(1.2);
        }
    }
</style>
