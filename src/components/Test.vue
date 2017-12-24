<template>
    <div>
        <h1>The Parent</h1>
        <p>
            <button @click="toggleChild">Toggle Child</button>
            <button @click="refreshChild">Refresh Child</button>
        </p>
        <keep-alive :exclude="exclude">
            <Child v-if="showChild" @create="log.push('Child create')" />
        </keep-alive>
        <hr>
        <pre v-text="log.join('\n')"></pre>
        <slot :arr="log"></slot>
    </div>
</template>
<script>
export default {

    components: {
        Child: {
            name: 'Child',
            template: `<div><h2>The Child</h2><p>{{counter}} <button @click="counter++">+1</button></p></div>`,
            data() {
                return {
                    counter: 0,
                }
            },
            created() {
                this.$emit('create')
            },
        },
    },
    data() {
        return {
            showChild: true,
            exclude: null,
            log: [],
        }
    },
    methods: {
        toggleChild() {
            console.log(this.exclude)
            this.showChild = !this.showChild
        },
        refreshChild() {
            this.exclude = 'Child'
            this.$nextTick(() => {
                this.exclude = null;
            })
        }
    },
}
</script>