<template>
    <layout-div>
        <div>
            <h1 class="text-center mt-5">Food Aggregator App</h1>
            <p class="text-center mt-3">
                Click here to Login as a 
                <span v-if="type == 'restaurant'"><a href="#"  @click="type = 'user'">User</a></span>
                <span v-else><a href="#" @click="type = 'restaurant'">Restaurant</a> </span>
            </p>

        </div>
         <div class="row justify-content-md-center mt-5 pd-top-50">
             <div class="col-4">
                 <div class="card">
                     <div class="card-body">
                         <h5 class="card-title mb-4">Sign In</h5>
                         <form>
                             <p v-if="Object.keys(validationErrors).length != 0" class='text-center '><small class='text-danger'>Incorrect Email or Password</small></p>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="username"
                                     class="form-label">
                                         Username
                                 </label>
                                 <input 
                                     v-model="username"
                                     type="text"
                                     class="form-control"
                                     id="username"
                                     name="username"
                                 />
                             </div>
                             <div class="mb-3">
                                 <label 
                                     htmlFor="password"
                                     class="form-label">Password
                                 </label>
                                 <input 
                                     v-model="password"
                                     type="password"
                                     class="form-control"
                                     id="password"
                                     name="password"
                                 />
                             </div>
                             <div class="d-grid gap-2">
                                 <button 
                                     :disabled="isSubmitting"
                                     @click="loginAction()"
                                     type="button"
                                     class="btn btn-primary btn-block">Login</button>
                                 <p class="text-center">Don't have account? 
                                     <router-link to="/register">Register here </router-link>
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
   name: 'LoginPage',
   components: {
     LayoutDiv,
   },
   data() {
     return {
         username:'',
         password:'',
         validationErrors:{},
         isSubmitting:false,
         type: 'user',
         available_types: ['user', 'restaurant']
     };
   },
   created() {
     if(localStorage.getItem('token') != "" && localStorage.getItem('token') != null){
         this.$router.push('/dashboard')
     }
   },
   methods: {
      loginAction(){
        if(this.type == 'user'){
            this.isSubmitting = true
            let payload = {
                username: this.username,
                password: this.password,
            }
            axios.post('/user/login', payload)
            .then(response => {
                console.log(response);
                localStorage.setItem('token', response.data.token)
                this.$router.push('/dashboard')
                return response
            })
            .catch(error => {
                this.isSubmitting = false
                if (error.response.data.errors != undefined) {
                    this.validationErrors = error.response.data.errors
                }
                if (error.response.data.error != undefined) {
                    this.validationErrors = error.response.data.error
                }
                return error
           });
        }else{
            this.isSubmitting = true
            let payload = {
                username: this.username,
                password: this.password,
            }
            axios.post('/restaurant/login', payload)
            .then(response => {
                console.log(response);
                localStorage.setItem('token', response.data.token)
                this.$router.push('/restaurant')
                return response
            })
            .catch(error => {
                this.isSubmitting = false
                if (error.response.data.errors != undefined) {
                    this.validationErrors = error.response.data.errors
                }
                if (error.response.data.error != undefined) {
                    this.validationErrors = error.response.data.error
                }
                return error
           });
        }
         
      }
   },
 };
 </script>