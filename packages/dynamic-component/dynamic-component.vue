<template>
    <keep-alive>
        <component v-bind:is="currentComponent" v-bind="$attrs" v-on="$on"></component>
    </keep-alive>
</template>

<script>
export default {
    name: "DynamicComponent",
    props: {
        compact: Object
    },
    data() {
        return {
            currentComponent: ''
        }
    },
    watch: {
        compact(compact) {
            if (Promise.prototype.isPrototypeOf(compact)) {
                compact.then(comp => this.currentComponent = comp).catch(err => console.error(err))
            } else {
                this.currentComponent = compact ? compact : ''
            }
        }
    },
    created() {

    }
}
</script>

<style scoped>

</style>
