<!-- import { VALUE_SPLIT } from 'ant-design-vue/es/vc-cascader/utils/commonUtil'; -->
<template>
  <section class="container">
    <div class="">
      <div class="backgr-img"></div>
      <div class="font-color">
        <i class="fa-solid fa-location-dot" style="color: orangered"></i
        >&ensp;Địa chỉ nhận hàng
      </div>
      <div>
        <div class="margin-left">
          <span :hidden="!hiddenInfo"
            ><b>{{ getInfoDeliver.name }}&ensp;{{ getInfoDeliver.phone }}</b>
            &ensp;<br class="displayForRes" />{{
              getInfoDeliver.arrInfoDeliver
            }}&ensp;&ensp;
          </span>
          <span :hidden="hiddenInfo"
            ><b>{{ name }}&ensp;{{ phone }}</b> &ensp;<br
              class="displayForRes"
            />{{ arraySelect }}&ensp;&ensp;
          </span>
          <a-button
            type="primary"
            @click="showDrawer"
            class="button-add-address"
          >
            <template #icon><PlusOutlined /></template>
            <i class="fa-solid fa-plus" style="color: #fff">&ensp;</i>&ensp;
            {{ status }}
          </a-button>
        </div>

        <a-drawer
          title="Add delivery address"
          :width="820"
          :open="open"
          :body-style="{ paddingBottom: '80px' }"
          :footer-style="{ textAlign: 'right' }"
          @close="onClose"
        >
          <a-space class="flex-container">
            <a-select
              ref="select"
              v-model:value="valueOne"
              :options="optionsOne"
              @focus="focus"
              @change="handleChange"
              @select="handSelect"
              class="flex-item"
            ></a-select>
            <!-- <a-button @click="handleAdd">Add</a-button> -->
            <a-button @click="handleUpdate">Update</a-button>
            <a-button @click="handleDelete">Delete</a-button>
            <a-button @click="handleClear">Clear</a-button>
          </a-space>
          <!-- <a-button-group>
            <button>Add</button>
            <button>Update</button>
            <button>Delete</button>
          </a-button-group> -->
          <a-form ref="formRef" :model="form" :rules="rules" layout="vertical">
            <a-row :gutter="16">
              <a-col :span="12">
                <a-form-item
                  label="Name"
                  name="name"
                  :rules="[
                    { required: true, message: 'Please input your fullname!' },
                    {
                      pattern: /^[A-Za-zÀ-ỹ\s]*[A-Za-zÀ-ỹ][A-Za-zÀ-ỹ\s]*$/,
                      message:
                        'Please enter a valid name with only letters and spaces',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <a-input
                    v-model:value="form.name"
                    v-model="message"
                    placeholder="Please enter your name"
                    pattern="[A-Za-z]+"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="12">
                <a-form-item
                  label="Phone number"
                  name="phone"
                  :rules="[
                    {
                      required: true,
                      message: 'Please input your phone number!',
                    },
                    {
                      pattern: /^(0[2-9][0-9]{8}|[2-9][0-9]{8})$/,
                      message: 'Please enter a valid phone number',
                      trigger: ['blur', 'change'],
                    },
                  ]"
                >
                  <a-input
                    v-model:value="form.phone"
                    placeholder="Please enter your phone number"
                    maxlength="10"
                    pattern="/^(0[39]\d{8}|[39]\d{8})$/"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="8">
                <a-form-item label="City" name="city">
                  <a-select
                    v-model:value="form.city"
                    @change="loadDistricts"
                    placeholder="Choose your city"
                  >
                    <a-select-option
                      v-for="city in cities"
                      :key="city.code"
                      :value="city.code"
                      >{{ city.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="District" name="district">
                  <a-select
                    v-model:value="form.district"
                    @change="loadWards"
                    placeholder="Choose your district"
                  >
                    <!-- <a-select-option value="" selected
                     ></a-select-option
                   > -->
                    <a-select-option
                      v-for="district in districts"
                      :key="district.code"
                      :value="district.code"
                      >{{ district.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="Ward" name="ward">
                  <a-select
                    v-model:value="form.ward"
                    @change="printResult"
                    placeholder="Choose your ward"
                  >
                    <a-select-option
                      v-for="ward in wards"
                      :key="ward.code"
                      :value="ward.code"
                      >{{ ward.name }}</a-select-option
                    >
                  </a-select>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Specific address" name="specificAddress">
                  <a-input
                    v-model:value="form.specificAddress"
                    placeholder="Please enter your specific address"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row :gutter="16">
              <a-col :span="24">
                <a-form-item label="Description" name="description">
                  <a-textarea
                    v-model:value="form.description"
                    :rows="4"
                    placeholder="please enter url description"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </a-form>
          <template #extra>
            <a-space>
              <a-button @click="onClose">Cancel</a-button>
              <a-button @click="selectDelivery">Select</a-button>
              <a-button type="primary" @click="handleSubmit">Add</a-button>
            </a-space>
          </template>
        </a-drawer>
      </div>
    </div>
    <div>
      <div class="row font-color-title margin-top-30">
        <div class="col-md-6 col-sm-6 center">Sản phẩm</div>
        <div class="col-md-2 col-sm-2">Đơn giá</div>
        <div class="col-md-2 col-sm-2">Số lượng</div>
        <div class="col-md-2 col-sm-2">Thành tiền</div>
      </div>
      <div
        class="row margin-top align-item-center"
        v-for="item in counterStore.arrTicked"
        :key="item.id"
      >
        <hr />
        <div class="col-md-3 col-sm-3">
          <img class="pictureCart" :src="item.pic[0]" />
        </div>
        <div class="col-md-3 col-sm-3">{{ item.name }}</div>
        <div class="col-md-2 col-sm-2">${{ item.price }}</div>
        <div class="col-md-2 col-sm-2">{{ item.quantity }}</div>
        <div class="col-md-2 col-sm-2">${{ item.price * item.quantity }}</div>
      </div>
    </div>
    <hr />
    <div>
      <div class="row">
        <div class="col-md-6 col-sm-6">
          <textarea
            id="myTextArea"
            placeholder="Lưu ý cho người bán"
            class="textarea"
          ></textarea>
        </div>
        <div class="col-md-6 col-sm-6 font-color-title">
          <span class="color-shipping">Đơn vị vận chuyển: &ensp; </span>
          <a-select
            v-model:value="value2"
            class="width-option"
            :dropdown-match-select-width="false"
            :placement="placement"
          >
            <a-select-option value="HangZhou">Nhanh</a-select-option>
            <a-select-option value="NingBo">Hỏa tốc</a-select-option>
          </a-select>
          <span class="hidden-res"
            >&ensp;&ensp;Nhận hàng vào ngày 24/11 đến 26/11</span
          >
          <div>Được đồng kiểm</div>
          <div>Tổng số tiền: ${{ counterStore.billOrder }}</div>
        </div>
      </div>
    </div>
    <hr class="hidden-res" />
    <hr />
    <!-- <div class="display-grid text-align-right font-color-title">
           <h6 class="ajust bawp">Tổng tiền hàng</h6>
           <div class="bawp">$14000</div>
       <div class=" margin-top">Phí vân chuyển:&emsp;  $14000</div>
       <div class="margin-top">Tổng thanh toán:&emsp;  <span class="totalBill">$14000</span></div>
   </div> -->
    <div class="row margin-top-15 middle-center">
      <div class="col-md-10 col-sm-10" style="text-align: right">
        <span>Tổng tiền hàng:</span>
      </div>
      <div class="col-md-2 col-sm-2">
        <span>${{ counterStore.billOrder }}</span>
      </div>
    </div>
    <div class="row margin-top-15 middle-center">
      <div class="col-md-10 col-sm-10" style="text-align: right">
        <span>Phí vận chuyển:</span>
      </div>
      <div class="col-md-2 col-sm-2">
        <span>${{ ship }}</span>
      </div>
    </div>
    <div class="row margin-top-15 middle-center">
      <div class="col-md-10 col-sm-10" style="text-align: right">
        <span>Tổng thanh toán:</span>
      </div>
      <div class="col-md-2 col-sm-2">
        <span class="totalBill">${{ ship + counterStore.billOrder }}</span>
      </div>
    </div>
    <hr />
    <div class="text-align-right">
      <router-link :to="{ name: 'LayoutPage' }">
        <button
          class="btn-order"
          @click="addOrder"
          :hidden="displayButon.hiddenButton"
        >
          Đặt hàng
        </button>
      </router-link>
    </div>
  </section>
  <router-view />
</template>

<script setup>
import { ref, reactive, onMounted, computed, watch } from "vue";
import { useCounterStore } from "@/stores";
import axios from "axios";
import { message } from "ant-design-vue";
const host = "https://provinces.open-api.vn/api/";
const cities = ref([]);
const districts = ref([]);
const wards = ref([]);
const result = ref("");
const status = ref("Thay đổi");
const name = ref();
const phone = ref();
const arraySelect = ref();
const hiddenInfo = ref(true);

onMounted(async () => {
  callAPI(`${host}?depth=1`);
  counterStore.productTicked();
  console.log(counterStore.arrTicked);
  console.log(counterStore.listCarts);
  counterStore.totalBillOrder();
  const cusId = JSON.parse(localStorage.getItem("idCustomer"));
  await counterStore.fetchInfoDelivery(cusId);
  console.log(counterStore.getListInfo);
  try {
    await counterStore.fetchOrderById(cusId);
  } catch (error) {
    console.log("Khách hàng này chưa có đơn hàng!");
  }

  if (counterStore.getListInfo.length === 0) {
    status.value = "Thêm địa chỉ";
  }
});
const displayButon = computed(() => {
  let status = true;
  if (counterStore.getListInfo.length !== 0) {
    status = false;
  }
  return { hiddenButton: status };
});
const callAPI = (api) => {
  axios.get(api).then((response) => {
    cities.value = response.data;
  });
};
const optionsOne = computed(() => {
  return counterStore.getListInfo.map((info) => ({
    value: info.id, // Giả sử id là giá trị duy nhất cho mỗi option
    label: `${info.name}, ${info.phone}, ${info.district}, ${info.city}, ${info.ward}`, // Sử dụng một trường nào đó từ info để làm label
  }));
});
const focus = () => {
  console.log("focus");
};
const handleDelete = () => {
  if (
    form.name === "" ||
    form.phone === "" ||
    form.city === "" ||
    form.district === "" ||
    form.ward === "" ||
    form.specificAddress === ""
  ) {
    message.error("Vui lòng chọn 1 địa chỉ mà bạn muốn xoá!");
  } else {
    const indexToUpdate = counterStore.getListInfo.findIndex(
      (item) => item.id === counterStore.valueSelect
    );
    counterStore.getListInfo.splice(indexToUpdate, 1);
    const cusId = JSON.parse(localStorage.getItem("idCustomer"));
    if (indexToUpdate !== -1) {
      axios
        .patch(`http://localhost:3000/infoDelivery/${cusId}`, {
          id: cusId,
          info: counterStore.getListInfo,
        })
        .then((response) => {
          console.log(response.data);
        })
        .catch((error) => {
          console.error(error);
        });
    } else {
      console.log(`Item with id ${counterStore.valueSelect} not found`);
    }
    form.name = "";
    form.phone = "";
    form.city = "";
    form.district = "";
    form.ward = "";
    form.specificAddress = "";
    form.description = "";
    onClose();
  }
};

const handSelect = (value) => {
  const selectedInfo = counterStore.getListInfo.find(
    (info) => info.id === value
  );
  form.name = selectedInfo.name;
  form.phone = selectedInfo.phone;
  form.city = selectedInfo.city;
  form.district = selectedInfo.district;
  form.ward = selectedInfo.ward;
  form.specificAddress = selectedInfo.specificAddress;
  form.description = selectedInfo.description;

  valueOne.value = selectedInfo.id;
};

const handleChange = (value) => {
  console.log(`selected ${value}`);
  counterStore.valueSelect = value;
  const selectedInfo = counterStore.getListInfo.find(
    (info) => info.id === value
  );

  // Cập nhật giá trị cho các trường input
  form.name = selectedInfo.name;
  form.phone = selectedInfo.phone;
  form.city = selectedInfo.city;
  form.district = selectedInfo.district;
  form.ward = selectedInfo.ward;
  form.specificAddress = selectedInfo.specificAddress;
  form.description = selectedInfo.description;

  // Cập nhật lại giá trị của valueOne để hiển thị trên <a-select>
  valueOne.value = selectedInfo.id;
};

const handleClear = () => {
  form.name = "";
  form.phone = "";
  form.city = "";
  form.district = "";
  form.ward = "";
  form.specificAddress = "";
  form.description = "";
  // handleSubmit();
};

// const handleAdd = () => {
//   if (
//     form.name === "" ||
//     form.phone === "" ||
//     form.city === "" ||
//     form.district === "" ||
//     form.ward === "" ||
//     form.specificAddress === ""
//   ) {
//     message.error("Vui lòng nhập đầy đủ thông tin!");
//   } else {
//     var today = new Date();
//     var date =
//       today.getDate() +
//       "-" +
//       (today.getMonth() + 1) +
//       "-" +
//       today.getFullYear();
//     var time =
//       today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
//     const customerId = JSON.parse(localStorage.getItem("idCustomer"));
//     let count = counterStore.getListInfo.length;
//     formRef.value.validate().then((valid) => {
//       if (valid) {
//         const arrForm = {
//           id: count++,
//           name: form.name,
//           phone: form.phone,
//           city: getCityName(),
//           district: getDistrictName(),
//           ward: getWardName(),
//           specificAddress: form.specificAddress,
//           description: form.description,
//           dateCreate: date + " " + time,
//         };
//         counterStore.getListInfo.push(arrForm);
//         const arrFinal = {
//           id: customerId,
//           info: counterStore.getListInfo,
//         };
//         console.log(arrFinal);
//         console.log(counterStore.getListInfo);
//         if (counterStore.getListInfo.length !== 0) {
//           // counterStore.removeInfoDelivery(customerId);
//           axios
//             .patch(`http://localhost:3000/infoDelivery/${customerId}`, {
//               id: customerId,
//               info: counterStore.getListInfo,
//             })
//             .then((response) => {
//               console.log(response.data);
//             })
//             .catch((error) => {
//               console.error(error);
//             });
//           message.success("Đã thêm địa chỉ thành công!");
//           console.log("Đây là if");

//         } else {
//           // counterStore.addInfoDelivery(arrFinal);
//           message.success("Đã thêm địa chỉ thành công!");
//           console.log("Đây là else");
//           counterStore.addInfoDeliveryOrderNone(arrFinal);
//         }
//         // onClose();
//       } else {
//         console.log("Form is not valid");
//       }
//     });
//   }
// };
const checkInfoExist = () => {
  console.log(counterStore.getListInfo);
  let statusExist = false;
  for (let i = 0; i < counterStore.getListInfo.length; i++) {
    if (
      counterStore.getListInfo[i].name === form.name &&
      counterStore.getListInfo[i].phone === form.phone &&
      counterStore.getListInfo[i].specificAddress === form.specificAddress &&
      counterStore.getListInfo[i].district === form.district &&
      counterStore.getListInfo[i].city === form.city &&
      counterStore.getListInfo[i].ward === form.ward
    ) {
      statusExist = true;
    } else {
      statusExist = false;
    }
  }
  return statusExist;
};

const handleUpdate = () => {
  if (
    form.name === "" ||
    form.phone === "" ||
    form.city === "" ||
    form.district === "" ||
    form.ward === "" ||
    form.specificAddress === ""
  ) {
    message.error("Vui lòng chọn 1 địa chỉ mà bạn muốn sửa đổi!");
  } else {
    if (checkInfoExist === true) {
      message.error("Địa chỉ này đã tồn tại!");
    } else {
      console.log(counterStore.getListInfo);
      const indexToUpdate = counterStore.getListInfo.findIndex(
        (item) => item.id === counterStore.valueSelect
      );
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      // const indexToUpdate = counterStore.getListInfo[findIndex]
      if (indexToUpdate !== -1) {
        // Create the updated object
        counterStore.getListInfo[indexToUpdate] = {
          id: counterStore.valueSelect,
          name: form.name,
          phone: form.phone,
          city: form.city,
          district: form.district,
          ward: form.ward,
          specificAddress: form.specificAddress,
          description: form.description,
          dateCreate: date + " " + time,
        };
        const cusId = JSON.parse(localStorage.getItem("idCustomer"));
        // Use Axios to send a PATCH request to update the data
        axios
          .patch(`http://localhost:3000/infoDelivery/${cusId}`, {
            id: cusId,
            info: counterStore.getListInfo,
          })
          .then((response) => { 
            console.log(response.data);
          })
          .catch((error) => {
            console.error(error);
          });
          message.success("Updated!")
          onClose();
      } else {
        console.log(`Item with id ${counterStore.valueSelect} not found`);
      }
    }
  }
};
// const hidden = ref(true);
// const totalOrder = ship + counterStore.billOrder;
// const arr = ref([]);

const counterStore = useCounterStore();
const value2 = ref("HangZhou");
const ship = ref(15);
// const formDataArray = ref([]);
const form = reactive({
  name: "",
  city: "",
  phone: "",
  district: "",
  ward: "",
  specificAddress: "",
  description: "",
});
const rules = {
  name: [
    {
      required: true,
      message: "Please enter user name",
    },
  ],
  phone: [
    {
      required: true,
      message: "Please enter your phone number",
    },
  ],
  specificAddress: [
    {
      required: true,
      message: "Please choose your specific address",
    },
  ],
  // description: [
  //   {
  //     required: true,
  //     message: "Please enter url description",
  //   },
  // ],
};
const open = ref(false);

const showDrawer = () => {
  open.value = true;
};

const onClose = () => {
  // open.value = false;
  if (formRef.value) {
    open.value = false;
  }
  // form.name = "";
  // form.phone = "";
  // form.city = "";
  // form.district = "";
  // form.ward = "";
  // form.specificAddress = "";
  // form.description = "";
};

const handleSubmit = () => {
  //  formDataArray.value = JSON.parse(localStorage.getItem("infoDelivery")) || [];
  if (
    form.name === "" ||
    form.phone === "" ||
    form.city === "" ||
    form.district === "" ||
    form.ward === "" ||
    form.specificAddress === ""
  ) {
    message.error("Vui lòng nhập đầy đủ thông tin!");
  } else {
    if (checkInfoExist === true) {
      console.log(counterStore.getListInfo);
      message.error("Địa chỉ này đã tồn tại!");
    } else {
      let count = counterStore.getListInfo.length + 1;
      const customerId = JSON.parse(localStorage.getItem("idCustomer"));
      var today = new Date();
      var date =
        today.getDate() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getFullYear();
      var time =
        today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
      formRef.value.validate().then((valid) => {
        if (valid) {
          const arrForm = {
            id: count++,
            name: form.name,
            phone: form.phone,
            city: getCityName(),
            district: getDistrictName(),
            ward: getWardName(),
            specificAddress: form.specificAddress,
            description: form.description,
            dateCreate: date + " " + time,
          };
          counterStore.getListInfo.push(arrForm);
          const arrFinal = {
            id: customerId,
            info: counterStore.getListInfo,
          };
          console.log(arrFinal);
          console.log("---------------------");
          console.log(counterStore.getListInfo);
          if (counterStore.getListInfo.length !== 1) {
            // counterStore.removeInfoDelivery(customerId);
            //  counterStore.addInfoDelivery(arrFinal);
            console.log("Đã có");
            // counterStore.addInfoDelivery(arrFinal);
            axios
              .patch(`http://localhost:3000/infoDelivery/${customerId}`, {
                id: customerId,
                info: counterStore.getListInfo,
              })
              .then((response) => {
                console.log(response.data);
              })
              .catch((error) => {
                console.error(error);
              });
            // counterStore.addInfoDeliveryOrderNone(arrFinal);
          } else {
            // counterStore.addInfoDelivery(arrFinal);
            counterStore.addInfoDeliveryOrderNone(arrFinal);
          }
          onClose();
        } else {
          console.log("Form is not valid");
        }
      });
    }
  }
};

const selectDelivery = () => {
  if (
    form.name === "" ||
    form.phone === "" ||
    form.city === "" ||
    form.district === "" ||
    form.ward === "" ||
    form.specificAddress === ""
  ) {
    message.error("Vui lòng chọn 1 địa chỉ!");
  } else {
    hiddenInfo.value = false;
    const index = counterStore.getListInfo.findIndex(
      (item) => item.id === counterStore.valueSelect
    );
    name.value = counterStore.getListInfo[index].name;
    phone.value = counterStore.getListInfo[index].phone;
    const arr = [];
    arr.push(counterStore.getListInfo[index].specificAddress);
    arr.push(counterStore.getListInfo[index].ward);
    arr.push(counterStore.getListInfo[index].district);
    arr.push(counterStore.getListInfo[index].city);
    arraySelect.value = arr.join(", ");
  }
};

const getInfoDeliver = computed(() => {
  const today = new Date();
  // Format ngày giờ hiện tại
  const currentDate = today.toISOString().slice(0, 19).replace("T", " ");

  // Tính khoảng cách thời gian giữa ngày giờ hiện tại và dateCreate của từng đối tượng
  // const timeDifferences = counterStore.getListInfo.map((obj) => {
  //   const objDate = new Date(obj.dateCreate);
  //   const difference = Math.abs(today - objDate);
  //   return difference;
  // });

  const timeDifferences = counterStore.getListInfo.map((obj) => {
    const objDate = new Date(obj.dateCreate.replace(/-/g, "/"));
    const difference = Math.abs(new Date(currentDate) - objDate) / 1000; // Chuyển đơn vị sang giây
    return difference;
  });

  // Tìm index của đối tượng có ngày giờ gần nhất
  const indexOfNearest = timeDifferences.indexOf(Math.min(...timeDifferences));
  console.log("============================");
  console.log(indexOfNearest);

  // Lấy đối tượng có ngày giờ gần nhất
  const arrayTemp = counterStore.getListInfo[indexOfNearest] || [];

  console.log("Ngày giờ hiện tại:", currentDate);
  console.log("Đối tượng có ngày giờ gần nhất:", arrayTemp);

  // const arrayTemp = counterStore.getListInfo || [];
  let arrtemp = [];
  let finalArr;
  const arrName = arrayTemp.name || "";
  const arrPhone = arrayTemp.phone || "";
  if (
    arrayTemp.specificAddress !== undefined &&
    arrayTemp.ward !== undefined &&
    arrayTemp.district !== undefined &&
    arrayTemp.city !== undefined
  ) {
    arrtemp.push(arrayTemp.specificAddress);
    arrtemp.push(arrayTemp.ward);
    arrtemp.push(arrayTemp.district);
    arrtemp.push(arrayTemp.city);
    finalArr = arrtemp.join(", ");
    console.log("Hello----------------------------------");
  } else {
    arrtemp = "";
    finalArr = "";
  }
  // const finalArr = arrtemp.join(", ");
  console.log(arrtemp);
  // arrtemp.join(", ");
  // const finalArr = arrtemp || "";

  let arrSelect = [];
  if (arrName !== "" && arrPhone !== "") {
    arrSelect.push(arrName);
    arrSelect.push(arrPhone);
    arrSelect.push(arrtemp);
    arrSelect.join(", ");
  } else {
    arrSelect = "";
  }

  const sele = arrSelect;
  return {
    info: counterStore.getListInfo,
    arrInfoDeliver: finalArr,
    name: arrName,
    phone: arrPhone,
    arraySelect: sele,
  };
});

const valueOne = ref("");

watch(
  () => getInfoDeliver.value.arraySelect,
  (newArraySelect) => {
    valueOne.value = newArraySelect;
  }
);

const addOrder = () => {
  var today = new Date();
  var date =
    today.getDate() + "-" + (today.getMonth() + 1) + "-" + today.getFullYear();
  var time =
    today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
  const idC = JSON.parse(localStorage.getItem("idCustomer"));
  let element = document.getElementById("myTextArea");
  console.log(element.value);
  console.log("-----------------------------------");
  console.log(counterStore.getListOrderById);
  const arr = [];
  // const arrOrder = []
  for (let i = 0; i < counterStore.arrTicked.length; i++) {
    const object = {
      id: counterStore.arrTicked[i].id,
      price: counterStore.arrTicked[i].price,
      quantity: counterStore.arrTicked[i].quantity,
    };
    arr.push(object);
  }
  const arrOrder = {
    idCustomer: idC,
    orders: {
      products: arr,
      total: ship.value + counterStore.billOrder,
      dateOrder: date + " " + time,
      status: "is Pending",
      note: element.value,
    },
  };
  counterStore.addOrderDetail(arrOrder);
  console.log(arrOrder);
  message.success("Đặt hàng thành công!");
  for (let i = 0; i < counterStore.listCarts.length; i++) {
    for (let j = 0; j < counterStore.arrTicked.length; j++) {
      if (counterStore.listCarts[i].id === counterStore.arrTicked[j].id) {
        counterStore.listCarts.splice(i, 1); //xóa hết phần tử counterStore.listCart[i]
      }
    }
  }
  localStorage.setItem("updateCart", JSON.stringify(counterStore.listCarts));
  console.log(counterStore.listCarts);
  counterStore.removeCart(idC);
  const updateCa = JSON.parse(localStorage.getItem("updateCart"));
  const temp = { id: idC, cart: updateCa };
  console.log(temp);
  counterStore.addCartForAcc(temp);
};

const formRef = ref(null);

const loadDistricts = () => {
  console.log("Selected City:", form.city);
  callApiDistrict(`${host}p/${form.city}?depth=2`);
  printResult();
};

const loadWards = () => {
  console.log("Selected District:", form.ward);
  callApiWard(`${host}d/${form.district}?depth=2`);
  printResult();
};

const callApiDistrict = (api) => {
  axios.get(api).then((response) => {
    districts.value = response.data.districts;
  });
};

const callApiWard = (api) => {
  axios.get(api).then((response) => {
    wards.value = response.data.wards;
  });
};

const printResult = () => {
  // if (
  //   selectedCity.value !== "" &&
  //   selectedDistrict.value !== "" &&
  //   selectedWard.value !== ""
  // ) {
  //   result.value = `${getCityName()} | ${getDistrictName()} | ${getWardName()}`;
  // }
  console.log("Thành phố:", getCityName());
  console.log("Quận:", getDistrictName());
  console.log("Phường:", getWardName());
  if (form.city !== "" && form.district !== "" && form.ward !== "") {
    result.value = `${getCityName()} | ${getDistrictName()} | ${getWardName()}`;
  }
};

const getCityName = () => {
  return cities.value.find((city) => city.code === form.city)?.name || "";
};

const getDistrictName = () => {
  return (
    districts.value.find((district) => district.code === form.district)?.name ||
    ""
  );
};

const getWardName = () => {
  return wards.value.find((ward) => ward.code === form.ward)?.name || "";
};
</script>

<style lang="scss" scoped>
.margin-left {
  margin-left: 30px;
}
.align-item-center {
  display: flex;
  align-items: center;
}
.center {
  text-align: center;
}
.margin-top {
  margin-top: 10px;
}
.pictureCart {
  width: 20%;
  height: auto;
  margin-left: 30px;
}
.middle-center {
  display: flex;
  vertical-align: middle;
  align-items: center;
  font-size: 18px;
}
.btn-order {
  border: none;
  background-color: orangered;
  color: white;
  margin-top: 5px;
  padding: 12px 60px;
  font-size: 18px;
  &:hover {
    background-color: lightcoral;
  }
}
.margin-top-15 {
  margin-top: 15px;
  color: gray;
}
.displayForRes {
  display: none;
}
.text-align-right {
  text-align: right;
}
.text-align-left {
  text-align: left;
}
.bawp {
  display: flex;
  align-items: center;
}
.ajust {
  grid-column-start: 2;
  grid-column-end: 3;
}
.display-grid {
  display: grid;
  grid-template-columns: 1fr max-content max-content;
  grid-template: auto;
  padding-top: 15px;
}
.margin-top {
  margin-top: 10px;
}
.totalBill {
  color: orangered;
  font-size: 25px;
  font-weight: 500;
}
.textarea {
  width: 100%;
  height: 100%;
  padding: 10px;
}
.color-shipping {
  color: green;
}
.text-align-right {
  text-align: right;
  margin-right: 20px;
}
.margin-top-30 {
  margin-top: 30px;
  margin-bottom: 30px;
}
.font-color-title {
  color: gray;
}
.button-add-address {
  border: none;
  border-radius: 5px;
  background-color: orangered;
  color: white;
  margin-top: 5px;
  // padding: 8px 20px;
  &:hover {
    background: #f18d9b;
  }
}
.font-color {
  color: orangered;
  font-size: 20px;
  margin-top: 10px;
  margin-left: 20px;
}
.backgr-img {
  height: 3px;
  width: 100%;
  background-position-x: -30px;
  background-size: 116px 3px;
  background-image: repeating-linear-gradient(
    45deg,
    #6fa6d6,
    #6fa6d6 33px,
    transparent 0,
    transparent 41px,
    #f18d9b 0,
    #f18d9b 74px,
    transparent 0,
    transparent 82px
  );
}
@media screen and (max-width: 1023px) {
  .textarea {
    width: 80%;
  }
  .hidden-res {
    display: none;
  }
}
@media screen and (max-width: 800px) {
  .container {
    padding: 0px;
  }
  .displayForRes {
    display: block;
  }
}
.flex-container {
  display: flex;
}

.flex-item {
  flex: 1;
  width: 100%;
}
.ant-select-dropdown {
  min-width: 100%;
}
</style>
