<template>
    <el-container style="height: 100%">
        <el-aside width="auto">
            <common-aside></common-aside>
        </el-aside>
        <el-container>
            <el-header>
                <common-header></common-header>
            </el-header>
            <!--加入CommonTab-->
            <common-tab></common-tab>
            <el-main>
                <router-view/>
            </el-main>
        </el-container>
    </el-container>
</template>

<script>
    import CommonAside from '../components/CommonAside'
    import CommonTab from '../components/CommonTab'
    import CommonHeader from "../components/CommonHeader";

    export default {
        components: {
            CommonAside,
            CommonHeader,
            CommonTab
        }
    }
</script>

<style lang="scss" scoped>
    .el-header {
        background-color: #333;
    }

    .el-main {
        padding-top: 0;
    }
</style>
