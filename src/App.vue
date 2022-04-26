<template>
  <!--<img alt="Vue logo" src="./assets/logo.png">-->
  <router-view/>
</template>

<script>

export default {
  name: 'App',
  mounted(){
  }
}
</script>

<style>
:root{
  --palyer1:blue;/**选手1颜色**/
  --palyer2: red;/**选手2颜色**/
  --net-line-color:pink;/**网格颜色**/
  --flag-size:12px;/**棋子的直径**/
  --active-border-color:red;/**当前激活选手的图标边框颜色**/
  --active-border-width:2px;/**当前激活选手的图标边框宽度**/
  --last-flag-border-color:red;/**最后一个棋子的边框颜色**/
  --flag-board-width:522px;/**棋盘的宽**/
  --flag-board-height:469px;/**棋盘的高**/
  --flag-background-color:#84c4e2;/**棋盘的背景色**/
}
.body{
    overflow-y: hidden;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
