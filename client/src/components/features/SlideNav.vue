<template>
    <div class="burger">
      <Slide>
      <a id="home" href="/"> 
        <span>Projects/Services</span>  
      </a>
      <a id="upload2" href="/upload2"> 
        <span>Upload</span>  
      </a>
      </Slide>
    </div>
</template>
<script>
import { Slide } from 'vue-burger-menu'
export default {
  name: 'slidenav',
  components: {
    Slide
  }
}
</script>

<style>
.burger {
  position: fixed;
}

.cross-style {
  cursor: pointer;
  position: absolute;
  right: 2px;
  top: 6px;
}


</style>