<template>
    <div class="post">
        <h2>{{ post.author }}</h2>
        <p>{{ post.content }}</p>
    </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
    props: {
        post: Object
    },
    setup() {
        
    },
})
</script>

<style lang="scss" scoped>
.post {
    background: #fff;
    padding: 1rem;
    h2 {
        font-size: 1.3rem;
        padding-bottom: 0.25rem;
    }
    p {
        color: #888
    }
}
.post:not(:last-child){
    border-bottom: 1px solid #ddd;
}
</style>

<!-- này em thực hành hồi đầu học thôi ạ -->