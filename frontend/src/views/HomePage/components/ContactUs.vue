<template>
  <div class="container">
    <h1 class="heading-contact">CONTACT US</h1>
    <div class="d-flex justify-content-center backgr7">
      <div class="p-6">
        <div>
          <iframe
            class="map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3919.251009001748!2d106.65301827590599!3d10.792077358903022!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3175293529c8f155%3A0xc101e984845bad65!2zNDIgVOG7sSBDxrDhu51uZywgUGjGsOG7nW5nIDQsIFTDom4gQsOsbmgsIFRow6BuaCBwaOG7kSBI4buTIENow60gTWluaCwgVmnhu4d0IE5hbQ!5e0!3m2!1svi!2s!4v1696389460262!5m2!1svi!2s"
            height="450"
            style="border: 0"
            allowfullscreen=""
            loading="lazy"
            referrerpolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
      <div class="p-6">
        <div class="form-input">
          <input type="text" placeholder="Name" class="input-padding" />
          <input type="text" placeholder="Email" class="input-padding" />
          <input type="text" placeholder="Phone" class="input-padding" />
          <input
            type="text"
            placeholder="Message"
            class="input-padding input-mess"
          />
        </div>
        <div class="send-center">
          <button class="btn-send">SEND</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
}
.heading-contact {
  font-family: "poppins", sans-serif;
  font-weight: bold;
  font-size: 28px;
  text-align: left;
  margin-top: 80px;
  margin-bottom: 50px;
}
.backgr7 {
  box-shadow: 0 0 3px 0 rgba(0, 0, 0, 0.25);
}
.input-padding {
  border: 1px solid #919191;
  border-radius: 0;
  padding-left: 25px;
  width: 90%;
  height: 50px;
  margin-bottom: 25px;
  font-size: inherit;
  outline: none;
  margin-left: 15px;
}
.input-mess {
  height: 120px;
}
.form-input {
  margin-top: 20px;
}
.send-center {
  text-align: center;
}
.btn-send {
  background-color: #f16179;
  border: 1px solid #f16179;
  padding: 10px 40px;
  font-size: 16px;
  color: white;
  margin-top: 10px;
  &:hover {
    background-color: white;
    color: #f16179;
    border: 1px solid #f16179;
  }
}
@media screen and (min-width: 1024px) {
  .map {
    width: 650px;
  }
}
@media only screen and (max-width: 739px) {
  .d-flex {
    flex-direction: column-reverse;
  }
  .map {
    width: 100%;
  }
  .btn-send {
    margin-bottom: 20px;
  }
  .input-padding {
    margin-left: 30px;
  }
}
@media screen and (min-width: 375px) and (max-width: 811px) {
  .container {
    margin: 0;
    padding: 0;
  }
  .input-padding {
    margin-left: 20px;
  }
}
@media screen and (max-width: 320px) {
  .container {
    margin: 0;
    padding: 0;
  }
  .input-padding {
    width: 90%;
    height: 40px;
    margin-left: 15px;
  }
  .btn-send {
    font-size: 14px;
    margin-top: 5px;
  }
}
</style>
