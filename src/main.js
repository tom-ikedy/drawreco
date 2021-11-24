import Vue from 'vue'
import App from './App.vue'
import router from './router'

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCxmRM85iRWPEctQ31FbowSeL3dwhza43M",
  authDomain: "drawreco.firebaseapp.com",
  projectId: "drawreco",
  storageBucket: "drawreco.appspot.com",
  messagingSenderId: "1004054660697",
  appId: "1:1004054660697:web:ee4410cf114862f930d348"
};

// Initialize Firebase
initializeApp(firebaseConfig);

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
