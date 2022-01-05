<template>
    <keep-alive>
        <component v-bind:is="currentComponent" v-bind="$attrs" v-on="$listeners"></component>
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
            this.load()
        }
    },
    methods: {
        load(){
            if (Promise.prototype.isPrototypeOf(this.compact)) {
                this.compact.then(comp => this.currentComponent = comp).catch(err => console.error(err))
            } else {
                this.currentComponent = this.compact ? this.compact : ''
            }
        }
    },
    created() {
        this.load()
    }
}
</script>

<style scoped>

</style>
