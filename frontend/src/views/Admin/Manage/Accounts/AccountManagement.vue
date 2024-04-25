<template>
    <a-tabs v-model:activeKey="activeKey" type="card">
      <a-tab-pane key="1" tab="Tài khoản khách hàng">Content of Tab Pane 3</a-tab-pane>
      <a-tab-pane key="2" tab="Tài khoản quản trị viên">Content of Tab Pane 1</a-tab-pane>
    </a-tabs>
  </template>
  <script setup>
  import { ref } from "vue";
  const activeKey = ref("1");
  </script>
  