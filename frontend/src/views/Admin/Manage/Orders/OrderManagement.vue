<template>
  <a-tabs v-model:activeKey="activeKey" type="card">
    <a-tab-pane key="1" tab="Tất cả đơn hàng">Content of Tab Pane 3</a-tab-pane>
    <a-tab-pane key="2" tab="Chờ xác nhận">Content of Tab Pane 1</a-tab-pane>
    <a-tab-pane key="3" tab="Đang chuẩn bị hàng"
      >Content of Tab Pane 2</a-tab-pane
    >
    <a-tab-pane key="4" tab="Đang giao">Content of Tab Pane 3</a-tab-pane>
    <a-tab-pane key="5" tab="Đã giao">Content of Tab Pane 3</a-tab-pane>
    <a-tab-pane key="6" tab="Đã huỷ">Content of Tab Pane 3</a-tab-pane>
  </a-tabs>
</template>
<script setup>
import { ref } from "vue";
const activeKey = ref("1");
</script>
