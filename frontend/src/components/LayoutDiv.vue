<template>
    <div class="container">
      <slot></slot>
    </div>
  </template>
    
  <script>
    
  export default {
      name: 'LayoutDiv',
  };
  </script>

  <style>
  .container {
    width: 100%;
    height: 100%;
  }
  </style>