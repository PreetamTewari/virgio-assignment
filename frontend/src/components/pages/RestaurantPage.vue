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

        <v-row justify="center">
            <v-dialog v-model="dialog" persistent width="1024">
                <v-card>
                    <v-card-title>
                        <span class="text-h5">{{ type }} Menu</span>
                    </v-card-title>
                    <v-card-text>
                        <v-container>
                            <v-row>
                                <v-col cols="12">
                                    <v-text-field v-model="menuItem.name" label="Name" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="menuItem.description" label="Description" required></v-text-field>
                                </v-col>
                                <v-col cols="12">
                                    <v-text-field v-model="menuItem.pricePerUnit" label="Price Per Unit" required></v-text-field>
                                </v-col>
                            </v-row>
                        </v-container>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue-darken-1" variant="text" @click="dialog = false; menuItem = {name: '', description: '', pricePerUnit: ''}">
                            Close
                        </v-btn>
                        <v-btn color="blue-darken-1" variant="text" @click="handleSave()">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-dialog>
        </v-row>

        <div>
            <div>
                <h3 class="text-center mt-5">Menu Items</h3>
                <div class="d-flex justify-content-center pd-15">
                    <v-btn @click="addItem()" class="btn-add">Add</v-btn>
                </div>
            </div>
            

            <div style="padding-top: 10px;">
                <div>
                    <v-table>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    Description
                                </th>
                                <th class="text-left">
                                    Price Per Unit
                                </th>
                                <th class="text-left">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="(item, index) in menuItems" :key="item.name">
                                <td>{{ item.name }}</td>
                                <td>{{ item.description }}</td>
                                <td>{{ item.pricePerUnit }}</td>
                                <td>
                                    <button @click="editItem(index)" class="btn-edit">Edit</button>
                                    <button @click="deleteItem(index)" class="btn-delete">Delete</button>
                                </td>
                            </tr>
                        </tbody>
                    </v-table>
                    
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
            menuItems: [],
            id: null,
            dialog: false,
            type: 'Edit',
            menuItem: {
                name: '',
                description: '',
                pricePerUnit: '',
            }
        };
    },
    created() {
        this.getUser();
        if (localStorage.getItem('token') == "" || localStorage.getItem('token') == null) {
            this.$router.push('/')
        } else {
            this.getUser();
            //    this.getRestaurants();
            //    this.getMenuItems();
        }

    },
    methods: {
        getUser() {
            console.log("in here");
            axios.get('/restaurant/profile', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((r) => {
                    this.user = r.data.restaurant;
                    this.id = r.data.restaurant._id;
                    return r
                })
                .catch((e) => {
                    return e
                });
        },

        logoutAction() {
            console.log("logout");
            localStorage.setItem('user', "")
            localStorage.setItem('token', "")
            this.$router.push('/')

        },
        getMenuItems() {
            // console.log("in here");
            axios.get('/restaurant/menu/' + this.id + '', {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                })
                .then((r) => {
                    console.log(r);
                    this.menuItems = r.data.menuItems;
                    this.menuItems.sort((a, b) => {
                        if (a.name < b.name) {
                            return -1;
                        }
                        if (a.name > b.name) {
                            return 1;
                        }
                        return 0;
                    })
                    return r
                })
                .catch((e) => {
                    return e
                });
        },
        editItem(index) {
            // console.log(index);
            this.menuItem = this.menuItems[index];
            this.dialog = true;
            this.type = 'Edit';
        },
        addItem() {
            this.menuItem = {
                name: '',
                description: '',
                pricePerUnit: '',
            }
            this.dialog = true;
            this.type = 'Add';
        },
        deleteItem(index) {
            // console.log(index)
            axios.delete('/restaurant/menu/' + this.menuItems[index]._id, {
                headers: {
                    Authorization: 'Bearer ' + localStorage.getItem('token')
                }
            }).then((r) => {
                this.getMenuItems();
                return r
            }).catch((e) => {
                return e
            })
        },
        handleSave() {
            
            let payload = {
                name: this.menuItem.name,
                description: this.menuItem.description,
                pricePerUnit: this.menuItem.pricePerUnit,
                is_available: true
            }
            if(this.type == 'Edit'){
                axios.put('/restaurant/menu/' + this.menuItem._id + '', payload, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((r) => {
                    console.log(r);
                    this.dialog = false;
                    this.getMenuItems();
                    return r
                })
                .catch((e) => {
                    return e
                });
            }else{
                axios.post('/restaurant/menu/', payload, {
                    headers: {
                        Authorization: 'Bearer ' + localStorage.getItem('token')
                    }
                }).then((r) => {
                    console.log(r);
                    this.dialog = false;
                    this.getMenuItems();
                    return r
                })
                .catch((e) => {
                    return e
                });
            }
            
        }

    },
    mounted() {},
    beforeUnmount() {},
    watch: {
        id: function () {
            // console.log('here');
            this.getMenuItems();
        }
    }
};
</script>

<style>
.menu-list {
    width: 750%;
    margin: 0 auto;
    padding-top: 20px;
}

.menu-list ul {
    list-style: none;
}

.input-range {
    width: 100px;
    margin-bottom: 20px;
    text-align: center;
}

.table {
    width: 80vw;
    border-collapse: collapse;
    margin-top: 20px;
}

th,
td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
}

th {
    background-color: #f2f2f2;
}

.btn-edit,
.btn-delete {
    padding: 5px 10px;
    margin-right: 5px;
    cursor: pointer;
}

.btn-edit {
    background-color: #4CAF50;
    color: white;
    border: none;
}

.btn-delete {
    background-color: #f44336;
    color: white;
    border: none;
}
</style>
