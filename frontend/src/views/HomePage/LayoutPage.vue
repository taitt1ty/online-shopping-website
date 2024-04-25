<template>
    <div>
        <slide-first/>
        <latest-product/>
        <best-savings/>
        <why-shop/>
        <gifts-for/>
        <contact-us/>
        <testi-web/>
    </div>
</template>

<script>
import SlideFirst from './components/SlideFirst.vue'
import LatestProduct from '@/components/LatestProduct.vue'
import BestSavings from './components/BestSavings.vue'
import WhyShop from './components/WhyShop.vue'
import GiftsFor from './components/GiftsFor.vue'
import ContactUs from './components/ContactUs.vue'
import TestiWeb from './components/TestiWeb.vue'

export default({
    name: 'ContentWeb',
    components: {
        SlideFirst,
        LatestProduct,
        BestSavings,
        WhyShop,
        GiftsFor,
        ContactUs,
        TestiWeb,
    },
    setup() {
        
        return {

        };
        
    },
    methods: {

    },
})
</script>

<style scoped>
.loading
{
  position: flex;
  top: 0;
  bottom: 0;
  right: 0;
  left: 0;
  margin: auto;
}
</style>

