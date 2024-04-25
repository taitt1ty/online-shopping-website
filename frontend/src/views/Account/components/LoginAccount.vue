<template>
  <section class="container shadow">
    <h1 class="login">LOGIN</h1>
    <a-form
      :model="formState"
      name="basic"
      :label-col="{ span: 8 }"
      :wrapper-col="{ span: 8 }"
      autocomplete="off"
      @finish="onFinish"
      @finishFailed="onFinishFailed"
    >
      <a-form-item
        label="Username"
        name="username"
        :rules="[{ required: true, message: 'Please input your username!' }]"
      >
        <a-input
          v-model:value="formState.username"
          class="border-none"
          ref="userNameInput"
        />
      </a-form-item>

      <a-form-item
        label="Password"
        name="password"
        :rules="[{ required: true, message: 'Please input your password!' }]"
      >
        <a-input-password
          v-model:value="formState.password"
          class="border-none"
          ref="passwordInput"
        />
      </a-form-item>
      <a-form-item name="remember" :wrapper-col="{ offset: 8, span: 8 }">
        <span class="space"
          ><a class="forgot-pass" href="#">Forgot password</a>
          <router-link :to="{ name: 'RegisterAccount' }"
            ><a href="#">Register now!</a></router-link
          ></span
        >
      </a-form-item>

      <a-form-item
        :wrapper-col="{ offset: 8, span: 8 }"
        class="text-align-center"
      >
        <a-button class="btn-welcome" html-type="submit">LOGIN</a-button>
      </a-form-item>
    </a-form>
  </section>
  <router-view />
</template>

<script setup>
import { message } from "ant-design-vue";
// import { stringify } from "uuid";
import { onMounted, reactive } from "vue";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useCounterStore } from "@/stores";
// import { useRouter } from "vue-router";
const userNameInput = ref(null);
const counterStore = useCounterStore();
const passwordInput = ref(null);
const idAcc = ref(null);
// const arrAccount = ref([]);
// const router = useRouter();
const router = useRouter();
// const arrCartForAcc = ref([]);
const formState = reactive({
  username: "",
  password: "",
  remember: true,
});
const onFinish = (values) => {
  console.log("Success:", values);
  checkLoginAccountCustomer();
  localStorage.setItem("whologin", JSON.stringify(idAcc.value));
  console.log(idAcc.value);
  // localStorage.setItem("Logout",JSON.stringify("Log out"));
  // counterStore.setLoggedIn("Log out");
};
const onFinishFailed = (errorInfo) => {
  console.log("Failed:", errorInfo);
};
onMounted(async () => {
  await counterStore.fetchListAccounts();
});

const checkLoginAccountCustomer = async () => {
  await counterStore.checkLoginAccount(formState.username,formState.password);
  const status = counterStore.checkLogin.statusCode;
  if (status === 200) {
    const customerId = counterStore.checkLogin.result[0].customerID;
    message.success("Đăng nhập thành công!");
      router.push({ name: "LayoutPage" });
      // idAcc.value = arrAccount.value[counterStore.checkLogin.result[2].customerID].id;
      await counterStore.fetchListCustomerCart(customerId);
      localStorage.setItem("idCustomer", JSON.stringify(customerId));
      const arr1 = counterStore.getListCart || [];
      const targetCart = arr1 || [];
      counterStore.listCarts = targetCart;
      localStorage.setItem("Logout", JSON.stringify("Log out"));
      counterStore.setLoggedIn("Log out");
  }
  else if(status === 401){
    // message.error("");
    formState.password = "";
    formState.username = "";
    userNameInput.value.focus();
    message.error("Tài khoản chưa được đăng ký!");
  } else if (status === 403) {
    message.error("Sai mật khẩu!");
    formState.password = "";
      passwordInput.value.focus();
  }
};

// const loginAccount = async () => {
//   // arrAccount.value = JSON.parse(localStorage.getItem("listAcc")) || [];
//   arrAccount.value = counterStore.getListAcc;
//   // console.log(arrAccount.value);
//   const getIndexByUsername = arrAccount.value.findIndex(
//     (item) => item.phone === formState.username
//   );
//   if (getIndexByUsername !== -1) {
//     if (arrAccount.value[getIndexByUsername].password === formState.password) {
//       message.success("Đăng nhập thành công!");
//       router.push({ name: "LayoutPage" });
//       idAcc.value = arrAccount.value[getIndexByUsername].id;
//       await counterStore.fetchListCustomerCart(idAcc.value);
//       localStorage.setItem("idCustomer", JSON.stringify(idAcc.value));
//       const arr1 = counterStore.getListCart || [];
//       // console.log();
//       console.log(arr1);
//       console.log(arr1.cart);
//       const targetCart = arr1.cart || [];
//       console.log(targetCart);
//       counterStore.listCarts = targetCart;
//       localStorage.setItem("Logout", JSON.stringify("Log out"));
//       counterStore.setLoggedIn("Log out");
//     } else {
//       message.error("Sai mật khẩu!");
//       formState.password = "";
//       passwordInput.value.focus();
//       // counterStore.setLoggedIn("Log out");
//     }
//   } else {
//     formState.password = "";
//     formState.username = "";
//     userNameInput.value.focus();
//     message.error("Tài khoản chưa được đăng ký!");
//   }
// };

</script>

<style lang="scss" scoped>
@import "@/style/styles.scss";
.border-none {
  border-radius: 0;
}
.shadow {
  box-shadow: 0 0 5px 0 rgba(0, 0, 0, 0.25);
  margin-top: 45px;
  //    padding: 60px;
}
.space {
  justify-content: space-between;
}
.login {
  text-align: center;
  margin: 40px 0;
}
.btn-welcome {
  background-color: #f16179;
  border: 1px solid #f16179;
  font-size: 16px;
  color: $font-color;
  border-radius: 0;
  width: 100%;
  &:hover {
    background-color: #f89cab;
    color: $button;
    border: 1px solid $button;
  }
}
.text-align-center {
  text-align: center;
  margin-top: 0;
}
a {
  text-decoration: none;
}
.forgot-pass {
  text-align: center;
}
</style>
