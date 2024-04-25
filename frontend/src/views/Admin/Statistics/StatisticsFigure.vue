<template>
  <div class="container">
    <a-menu v-model:selectedKeys="current" mode="horizontal" :items="items" />
  </div>
</template>
<script setup>
import { h, ref } from "vue";
import {
  MailOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";
const current = ref(["mail"]);
const items = ref([
  {
    key: "mail",
    icon: () => h(MailOutlined),
    label: "All Products",
    title: "All Products",
  },
  {
    key: "best-seller",
    icon: () => h(MailOutlined),
    label: "Best Seller",
    title: "Best Seller",
  },
  {
    key: "app",
    icon: () => h(AppstoreOutlined),
    label: "Phụ kiện",
    title: "Phụ kiện",
    children: [
      {
        type: "group",
        label: "Nón",
        children: [
          {
            label: "Nón lưỡi trai",
            key: "non-luoi-trai",
          },
          {
            label: "Nón len",
            key: "non-len",
          },
        ],
      },
      {
        type: "group",
        label: "Vớ",
        children: [
          {
            label: "Vớ lười",
            key: "vo-luoi",
          },
          {
            label: "Vớ trung",
            key: "vo-trung",
          },
          {
            label: "Vớ cao",
            key: "vo-cao",
          },
        ],
      },
    ],
  },
  {
    key: "quan",
    icon: () => h(SettingOutlined),
    label: "Quần",
    title: "Quần",
    children: [
      {
        type: "group",
        label: "Quần",
        children: [
          {
            label: "Jeans",
            key: "setting:1",
          },
          {
            label: "Pants",
            key: "setting:2",
          },
        ],
      },
      {
        type: "group",
        label: "Áo",
        children: [
          {
            label: "T-shirt",
            key: "setting:3",
          },
          {
            label: "Sơmi",
            key: "setting:4",
          },
        ],
      },
    ],
  },
  {
    key: "ao",
    icon: () => h(SettingOutlined),
    label: "Áo",
    title: "Áo",
    children: [
      {
        type: "group",
        label: "Quần",
        children: [
          {
            label: "Jeans",
            key: "setting:1",
          },
          {
            label: "Pants",
            key: "setting:2",
          },
        ],
      },
      {
        type: "group",
        label: "Áo",
        children: [
          {
            label: "T-shirt",
            key: "setting:3",
          },
          {
            label: "Sơmi",
            key: "setting:4",
          },
        ],
      },
    ],
  },
]);
</script>

<style scoped>
ul {
    display: flex;
    /* justify-content: space-between; */
}
</style>