<template>
<layout-div>
    <div class="row justify-content-md-center">
        <div class="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Dashboard</a>
                    <div class="d-flex">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a @click="logoutAction()" class="nav-link " aria-current="page" href="#">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
            <h2 class="text-center mt-5">Welcome, {{user?.username?.toUpperCase()}}! </h2>
        </div>
        <div>
            <h3 class="text-center mt-5">Nearest Restaurants</h3>
            <div style="width: 100%;">
                <v-text-field v-model="range" label="Range in Kms" class="input-range"  hide-details style="width: 40%;"></v-text-field>
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <v-list lines="one">
                    <v-list-item v-for="restaurant in restaurants" :key="restaurant.id">
                        <v-list-item-title class="text-h6">
                            <a :href="'/menu/'+restaurant._id">{{restaurant.name}}</a>
                        </v-list-item-title>
                        <v-list-item-subtitle class="font-weight-bold">{{metersToKilometers(restaurant.distance)}} km</v-list-item-subtitle>
                    </v-list-item>
                </v-list>
                </div>
            </div>
        </div>
    </div>
</layout-div>
</template>

 
<script>
import axios from 'axios';
import LayoutDiv from '../LayoutDiv.vue';

export default {
    name: 'DashboardPage',
    components: {
        LayoutDiv,
    },
    data() {
        return {
            user: {},
            restaurants: [],
            currentPage: 1,
            range: 5
        };
    },
    created() {
        this.getUser();
        if (localStorage.getItem('token') == "" || localStorage.getItem('token') == null) {
            this.$router.push('/')
        } else {
            this.getUser();
            this.getRestaurants();
        }

    },
    methods: {
        metersToKilometers(meters){
            meters = parseInt(meters);
            return (meters/1000).toFixed(2);
        },
        getUser() {
            axios.get('/user/profile', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((r) => {
                    this.user = r.data.user;
                    return r
                })
                .catch((e) => {
                    return e
                });
        },

        logoutAction() {
            console.log("logout")
            localStorage.setItem('user', "")
            localStorage.setItem('token', "")
            this.$router.push('/')

        },
        getRestaurants() {
            axios.get('/user/nearest-restaurant?page=' + this.currentPage + '&pageSize=20&range=' + this.range + '', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((r) => {
                    // this.restaurants = r.data.nearestRestaurants;
                    if (this.restaurants.length == 0) {
                        this.restaurants = r.data.nearestRestaurants;
                    } else {
                        this.restaurants = this.restaurants.concat(r.data.nearestRestaurants);
                    }
                    console.log(this.restaurants.length)

                    return r
                })
                .catch((e) => {
                    return e
                })
            this.currentPage++;
        },
        handleScroll() {
            const scrollY = window.scrollY;
            const visibleHeight = window.innerHeight;
            const pageHeight = document.documentElement.scrollHeight;

            if (scrollY + visibleHeight >= pageHeight) {
                this.getRestaurants();
            }
        }

    },
    mounted() {
        window.addEventListener('scroll', this.handleScroll);
    },
    beforeUnmount() {
        window.removeEventListener('scroll', this.handleScroll);
    },
    watch:{
        range(){
            this.restaurants = [];
            this.currentPage = 1;
            this.getRestaurants();
        }
    }
};
</script>

<style>
.restaurant-list {
    width: 750%;
    margin: 0 auto;
    padding-top: 20px;
}

.restaurant-list ul {
    list-style: none;
}

.input-range {
    width: 100px;
    margin-bottom: 20px;
    text-align: center;
}
</style>
