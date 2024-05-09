<template>
  <div>
    <h1 class="align-items-center pb-20">Đơn vị vận chuyển</h1>
    <a-table :columns="COLUMNS_TYPE_SHIP" :data-source="resp">
    <template #bodyCell="{ column }">
      <template v-if="column.key === 'actions'">
        <a-space warp>
          <a-button @click="column.onClick_View()" type="primary"
            >Edit</a-button
          >
          <a-button @click="column.onClick_Delete()" type="primary" danger
            >Delete</a-button
          >
        </a-space>
      </template>
    </template>
  </a-table>
  </div>
</template>
<script setup>
import { COLUMNS_TYPE_SHIP } from "@/helper/constants";
import { useCounterStore } from "@/stores";
import { onMounted, ref } from "vue";
const counterStore = useCounterStore();
const resp = ref([]);
onMounted(async () => {
  const results = await counterStore.getTypeShip();
  resp.value = results.data.result;
});
</script>

<style scoped>
.pb-20 {
  padding-bottom: 20px;
}
</style>
