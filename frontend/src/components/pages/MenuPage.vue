<template>
<layout-div>
    <div class="row justify-content-md-center">
        <div class="col-12">
            <nav class="navbar navbar-expand-lg navbar-light bg-light">
                <div class="container-fluid">
                    <a class="navbar-brand" href="#">Menu</a>
                    <div class="d-flex">
                        <ul class="navbar-nav">
                            <li class="nav-item">
                                <a @click="logoutAction()" class="nav-link " aria-current="page" href="#">Logout</a>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>
        </div>
        <div class="col-12 text-center">
            <h2>Menu Items</h2>
            <v-list lines="two">
                <v-list-item v-for="item in menuItems" :key="item.id" :title="item.name + ': Rs ' + item.pricePerUnit" :subtitle="item.description"></v-list-item>
            </v-list>
            <!-- <ul class="list-group">
                <li v-for="item in menuItems" :key="item.id">
                    {{item.name}}: {{ item.description }} :Rs {{item.pricePerUnit}}
                </li>
            </ul> -->
        </div>
    </div>
</layout-div>
</template>

<script>
import LayoutDiv from '../LayoutDiv.vue';
import axios from 'axios';

export default {
    name: 'MenuPage',
    data() {
        return {
            id: this.$route.params.id,
            menuItems: []
        };
    },
    components: {
        LayoutDiv
    },
    created() {
        if (localStorage.getItem('token') == null) {
            this.$router.push('/')
        }
        this.getMenuItems();
    },
    methods: {
        logoutAction() {
            localStorage.setItem('user', "")
            localStorage.setItem('token', "")
            this.$router.push('/')

        },
        getMenuItems() {
            console.log("in here");
            axios.get('/restaurant/menu/' + this.id + '', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((r) => {
                    this.menuItems = r.data.menuItems;
                    return r
                })
                .catch((e) => {
                    return e
                });
        }
    },
}
</script>

<style>
.list-group {
    list-style: none;
}
</style>
