<template>
    <layout-div>
        <div>
            <h1 class="text-center mt-5">Food Aggregator App</h1>
            <p class="text-center mt-3">
                Click here to Register as a 
                <span v-if="type == 'restaurant'"><a href="#"  @click="type = 'user'">User</a></span>
                <span v-else><a href="#" @click="type = 'restaurant'">Restaurant</a> </span>
            </p>

        </div>
        <div class="row justify-content-md-center mt-5">
             <div class="col-4">
                 <div class="card">
                     <div class="card-body">
                         <h5 class="card-title mb-4">Register</h5>
                         <form v-if="type == 'user'">
                             <div class="mb-3">
                                 <label 
                                     htmlFor="name"
                                     class="form-label">Username
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="username"
                                     name="username"
                                     v-model="user.username"
                                 />
                                 <div v-if="validationErrors.name" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.name[0]}}
                                     </small >
                                 </div>      
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="email"
                                     class="form-label">Email address
                                 </label>
                                 <input 
                                     type="email"
                                     class="form-control"
                                     id="email"
                                     name="email"
                                     v-model="user.email"
                                 />
                                 <div v-if="validationErrors.email" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.email[0]}}
                                     </small >
                                 </div>
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="password"
                                     class="form-label">Password
                                 </label>
                                 <input 
                                     type="password"
                                     class="form-control"
                                     id="password"
                                     name="password"
                                     v-model="user.password"
                                 />
                                <div v-if="validationErrors.password" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.password[0]}}
                                     </small >
                                 </div>
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="address"
                                     class="form-label">Address
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="address"
                                     name="address"
                                     v-model="user.address"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="latitude"
                                     class="form-label">Latitude
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="latitude"
                                     name="latitude"
                                     v-model="user.latitude"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="longitude"
                                     class="form-label">Longitude
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="longitude"
                                     name="longitude"
                                     v-model="user.longitude"
                                 />
                             </div>
                             <div class="d-grid gap-2">
                                 <button 
                                     :disabled="isSubmitting"
                                     @click="registerAction()"
                                     type="button"
                                     class="btn btn-primary btn-block">Register Now
                                 </button>
                                 <p 
                                     class="text-center">Have already an account <router-link to="/">Login here</router-link>
                                 </p>
                             </div>
                         </form>
                         <form v-else>
                            <div class="mb-3">
                                 <label 
                                     htmlFor="name"
                                     class="form-label">Name
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="name"
                                     name="name"
                                     v-model="restaurant.name"
                                 />
                                 <div v-if="validationErrors.name" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.name[0]}}
                                     </small >
                                 </div>      
                             </div>
                            <div class="mb-3">
                                 <label 
                                     htmlFor="name"
                                     class="form-label">Username
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="username"
                                     name="username"
                                     v-model="restaurant.username"
                                 />
                                 <div v-if="validationErrors.name" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.name[0]}}
                                     </small >
                                 </div>      
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="password"
                                     class="form-label">Password
                                 </label>
                                 <input 
                                     type="password"
                                     class="form-control"
                                     id="password"
                                     name="password"
                                     v-model="restaurant.password"
                                 />
                                <div v-if="validationErrors.password" class="flex flex-col">
                                     <small  class="text-danger">
                                     {{validationErrors?.password[0]}}
                                     </small >
                                 </div>
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="address"
                                     class="form-label">Address
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="address"
                                     name="address"
                                     v-model="restaurant.address"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="latitude"
                                     class="form-label">Latitude
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="latitude"
                                     name="latitude"
                                     v-model="restaurant.latitude"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="longitude"
                                     class="form-label">Longitude
                                 </label>
                                 <input 
                                     type="text"
                                     class="form-control"
                                     id="longitude"
                                     name="longitude"
                                     v-model="restaurant.longitude"
                                 />
                             </div>
                             <div class="d-grid gap-2">
                                 <button 
                                     :disabled="isSubmitting"
                                     @click="registerAction()"
                                     type="button"
                                     class="btn btn-primary btn-block">Register Now
                                 </button>
                                 <p 
                                     class="text-center">Have already an account <router-link to="/">Login here</router-link>
                                 </p>
                             </div>
                         </form>
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
   name: 'RegisterPage',
   components: {
     LayoutDiv,
   },
   data() {
     return {
         user: {
            username: '',
            password: '',
            address: '',
            email: '',
            location: {
                'latitude': 0,
                'longitude': 0
            }
         },
         restaurant: {
            name: '',
            username: '',
            password: '',
            address: '',
            location: {
                'latitude': 0,
                'longitude': 0
            },
            is_open: true,
            opening_hours: "10:00 AM",
            closing_hours: "10:00 PM",
         },
         type: 'user',
         available_types: ['user', 'restaurant'],
         validationErrors:{},
         isSubmitting:false,
     };
   },
   created() {
     if(localStorage.getItem('token') != "" && localStorage.getItem('token') != null){
         this.$router.push('/dashboard')
     }
   },
   methods: {
      registerAction(){
        if(this.type == 'user'){
            this.isSubmitting = true
            let payload = {
                username:this.user.username,
                address: this.user.address,
                location: {
                    latitude: parseFloat(this.user.latitude),
                    longitude: parseFloat(this.user.longitude)
                },
                email: this.user.email,
                password: this.user.password,
            }
            axios.post('/user/signup', payload)
            .then(response => {
                localStorage.setItem('token', response.data.token)
                this.$router.push('/dashboard')
                return response
            })
            .catch(error => {
                this.isSubmitting = false
                if (error.response.data.errors != undefined) {
                    this.validationErrors = error.response.data.errors
                }
                return error
           });
        }else{
            this.isSubmitting = true
         let payload = {
             name: this.restaurant.name,
             username:this.restaurant.username,
             address: this.restaurant.address,
             location: {
                 latitude: parseFloat(this.restaurant.latitude),
                 longitude: parseFloat(this.restaurant.longitude)
             },
             is_open: this.restaurant.is_open,
             opening_hours: this.restaurant.opening_hours,
             closing_hours: this.restaurant.closing_hours,
             password: this.restaurant.password,
         }
         axios.post('/restaurant/signup', payload)
           .then(response => {
             localStorage.setItem('token', response.data.token)
             this.$router.push('/restaurant')
             return response
           })
           .catch(error => {
             this.isSubmitting = false
             if (error.response.data.errors != undefined) {
                 this.validationErrors = error.response.data.errors
             }
             return error
           });
        }
         
      }
   },
 };
 </script>