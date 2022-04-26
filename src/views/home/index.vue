<template>
    <div class="main">
        <a-row justify="center" class="rows">
            <a-col :span="8">
                <a-input class="my_large"
                        v-model:value="formState.name"
                        size="large"
                        @keydown.enter="battle"
                        :placeholder="formState.placeholder"/>
            </a-col>
        </a-row>
    </div>
</template>
<script lang="ts">
    import { defineComponent, reactive  } from 'vue';
    import { useRouter } from 'vue-router';
    export default defineComponent({
        setup() {
            const router = useRouter();
            const formState = reactive({
                name:"",
                placeholder:"输入名称"
            });


            const battle = (vals:any)=>{
                if(!formState.name) return;
                debugger;
                router.push({name:"hall",query:{playerName:formState.name}});
            }
            return {
                formState,
                battle
            };
        },
    });
</script>
<style scoped>
    .main{
        height: 100vh;
    }
    .rows{
        top: 30%;
        position: relative;
    }
    .my_large{
        font-size: 40px;
    }
</style>
