<template>
  <div class="content">
    <h1 class="heading-product">PRODUCTS</h1>
    <div class="container">
      <div class="row">
        <div
          v-for="product in newList"
          :key="product.id"
          class="col-md-4 col-lg-3 col-sm-6 padding-row"
        >
          <ItemProduct
            :pic="product.pic[0]"
            :name="product.name"
            :price="product.price"
            :id="product.id"
            @productClick="handleProductClick"
          />
        </div>
      </div>
    </div>
    <center>
      <button
        @click="loadMore"
        class="btn-view-products"
        :class="{ 'disabled-btn': disableButton }"
      >
        View More Products
      </button>
    </center>
    <a-back-top />
  </div>
</template>

<script setup>
import ItemProduct from "./ItemProduct.vue";
import { useCounterStore } from "@/stores/index";
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
const counterStore = useCounterStore();
const listProducts = ref([]);
const disableButton = ref(false);
const page = ref(0);
const newList = ref([]);
const router = useRouter();

const handleProductClick = (productId) => {
  console.log("Product ID clicked:", productId);
  router.push({ name: "ProductDetail", params: { id: productId} });
};
const updateList = async () => {
  page.value++;
  await counterStore.fetchListProduct(page.value);
  listProducts.value = counterStore.listProducts;
  console.log(listProducts.value);
  if (listProducts.value.length > 0) {
    newList.value = newList.value.concat(listProducts.value);
    disableButton.value = false;
  } else {
    disableButton.value = true;
  }
};
onMounted(async () => {
  await counterStore.fetchListProduct(page.value);
  newList.value = counterStore.listProducts;
  console.log(newList.value);
});
const loadMore = () => {
  updateList();
};
</script>

<style scoped>
.disabled-btn {
  opacity: 0.5;
  cursor: not-allowed;
  display: none;
}
.content {
  z-index: 1;
}
.loading {
  position: flex;
  right: 40px;
}
.loader-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}
.heading-product {
  font-family: "poppins", sans-serif;
  font-weight: bold;
  font-size: 28px;
  text-align: center;
  margin-top: 80px;
  margin-bottom: 50px;
}
.backgr3 {
  background-color: #eeeeee;
  padding: 10px;
}
.new {
  background-color: white;
  border-radius: 100%;
  width: 50px;
  height: 50px;
  padding-top: 10px;
  padding-left: 10px;
}
.picture-products {
  object-fit: fill;
  padding: 20px;
  max-height: 180px;
  width: auto;
}
.space {
  display: flex;
  justify-content: space-between;
}
.font-products {
  font-weight: bold;
  margin-top: 10px;
}
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.display-inline {
  display: inline-block;
}
.price-color {
  color: #db4f66;
}
.space-col {
  padding-top: 25px;
}
.btn-view-products {
  background-color: #f16179;
  border: 1px solid #f16179;
  padding: 10px 40px;
  font-size: 16px;
  color: white;
  border-radius: 5px;
  margin-top: 30px;
}
.padding-row {
  padding-bottom: 30px;
}
</style>
