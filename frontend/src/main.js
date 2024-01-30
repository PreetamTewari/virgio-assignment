import { createApp } from 'vue';
// // eslint-disable-next-line
// import * as Vue from 'vue';
import App from './App.vue';
import axios from 'axios';
// import BootstrapVue from 'bootstrap-vue';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap-vue/dist/bootstrap-vue.css';
import { createRouter, createWebHistory } from 'vue-router';
import LoginPage from './components/pages/LoginPage';
import SignUpPage from './components/pages/SignUpPage';
import DashboardPage from './components/pages/DashboardPage';
import MenuPage from './components/pages/MenuPage';
import RestaurantPage from './components/pages/RestaurantPage';
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
  components,
  directives,
})


axios.defaults.baseURL = process.env.VUE_APP_API_URL;
axios.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
axios.defaults.headers.common['Access-Control-Allow-Methods'] = 'GET,PUT,POST,DELETE,PATCH,OPTIONS';
axios.defaults.headers.common['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, Content-Length, X-Requested-With';

// Create a new router instance
const router = createRouter({
    history: createWebHistory(),
    routes: [
      { path: '/', component: LoginPage },
      { path: '/register', component: SignUpPage },
      { path: '/dashboard', component: DashboardPage },
      { path: '/menu/:id', component: MenuPage, props: true },
      { path: '/restaurant', component: RestaurantPage }
    ],
});


createApp(App).use(vuetify).use(router).mount('#app');
