<template>
  <a-layout has-sider>
    <a-layout-sider
      :style="{
        overflow: 'auto',
        height: '100vh',
        position: 'fixed',
        left: 0,
        top: 0,
        bottom: 0,
      }"
    >
      <div class="logo" />
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1">
          <pie-chart-outlined />
          <span>Tổng quan</span>
        </a-menu-item>
        <a-menu-item key="2">
          <desktop-outlined />
          <span>Thống kê</span>
        </a-menu-item>
        <a-sub-menu key="sub1">
          <template #title>
            <span>
              <user-outlined />
              <span>Quản lý</span>
            </span>
          </template>
          <a-menu-item key="3">Sản phẩm</a-menu-item>
          <a-menu-item key="4">Đơn hàng</a-menu-item>
          <a-menu-item key="5">Tài khoản</a-menu-item>
          <a-menu-item key="6">Tin nhắn</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="sub2">
          <template #title>
            <span>
              <team-outlined />
              <span>Website</span>
            </span>
          </template>
          <a-menu-item key="7">Quản lý vouchers</a-menu-item>
          <a-menu-item key="8">Quản lý sự kiện</a-menu-item>
        </a-sub-menu>
        <a-menu-item key="9">
          <file-outlined />
          <span>File</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
    <a-layout :style="{ marginLeft: '200px' }">
      <a-layout-header :style="{ background: '#fff', padding: 0 }" />
      <a-layout-content :style="{ margin: '24px 16px 0', overflow: 'initial' }">
        <div
          :style="{ padding: '24px', background: '#fff', textAlign: 'center' }"
        >
        
        <OrderManagement v-if="selectedKeys.includes('4')"/>
        <AccountManagement v-if="selectedKeys.includes('5')"/>
        <StatisticsFigure v-if="selectedKeys.includes('2')"/>
        <div>
           ...
          <br />
          Really
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          long
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          ...
          <br />
          content 
        </div>
          
        </div>
      </a-layout-content>
      <a-layout-footer :style="{ textAlign: 'center' }">
        Ant Design ©2018 Created by Ant UED
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script setup>
import OrderManagement from '@/views/Admin/Manage/Orders/OrderManagement';
import AccountManagement from '@/views/Admin/Manage/Accounts/AccountManagement';
import StatisticsFigure from '@/views/Admin/Statistics/StatisticsFigure.vue';
import { ref } from "vue";
const selectedKeys = ref(["4"]);
</script>
<style scoped>
#components-layout-demo-fixed-sider .logo {
  height: 32px;
  background: rgba(255, 255, 255, 0.2);
  margin: 16px;
}
.site-layout .site-layout-background {
  background: #fff;
}

[data-theme="dark"] .site-layout .site-layout-background {
  background: #141414;
}
</style>
