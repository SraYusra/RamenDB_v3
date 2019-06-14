<template>
  <div class="projects">
    <h1>Projects and Services</h1>
    <div>
      <input type="text" v-model="search" placeholder="Search">
      <select v-model="selected">
        <option disabled>Filter by...</option>
        <option>Title</option>
        <option>Description</option>
      </select>
      <span>Project</span>
      <input type="checkbox" id="projType" v-model="projType">
      <span>Service</span>
      <input type="checkbox" id="servType" v-model="servType">
    </div>
    <div v-if="projects.length > 0" class="table-wrap">
      <div>
        <router-link v-bind:to="{ name: 'addproject' }" class="upload_link">Add Project/Service</router-link>
        <router-link v-bind:to="{ name: 'upload2' }" class="upload_link">File Upload</router-link>
        <a href="#" @click="deleteAllProjects()">Delete Projects</a>
        <br>
        <br>
      </div>
      <table>
        <tr>
          <th v-for="column in columns" :key="column" width="100">
            <a class="header" href="#" v-on:click="sortBy(column)" vbind:class="active: sortKey == column">{{ column }}</a>
          </th>
          <!-- <th @click="sortBy('title')">Title</th>
          <th width="100">Type</th>
          <th width="100" align="center">Action</th> -->
        </tr>
        <tr v-for="(project,index) in filteredProjects" :key="index">
          <td><router-link v-bind:to="{ name: 'viewproject', params: { id: project._id } }">{{ project.title ? project.title : '' }}</router-link></td>
          <!-- <td>{{ project.description ? project.description : '' }}</td> -->
          <td>{{ project.type }}</td> <!-- .toLowerCase() -->
          <td align="center">
            <router-link v-bind:to="{ name: 'editproject', params: { id: project._id } }">Edit</router-link> |
            <a href="#" @click="deleteProject(project._id)">Delete</a>
          </td>
        </tr>
      </table>
    </div>
    <div v-else>
      There are no projects.. Lets add one now <br /><br />
      <router-link v-bind:to="{ name: 'addproject' }" class="add_project_link">Add Project</router-link>
    </div>
    <br>
    <br>
    <br>
    <router-link v-bind:to="{ name: 'upload2' }" class="upload2_link">File Upload</router-link>
  </div>
</template>

<script>
import ProjectsService from '@/services/ProjectsService'
import Swal from 'sweetalert2'
// import Vue2Filters from 'vue2-filters'
// import Vue from 'vue'

// Vue.use(Vue2Filters)

export default {
  name: 'projects',
  data () {
    return {
      projects: [],
      columns: ['Title', 'Type', 'Action'],
      search: '',
      selected: '',
      projType: true,
      servType: true,
      sortKey: 'title',
      reverse: false
    }
  },
  mounted () {
    this.getProjects()
  },
  methods: {
    async getProjects () {
      const response = await ProjectsService.fetchProjects()
      this.projects = response.data.projects
    },
    async deleteProject (id) {
      const $this = this
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          ProjectsService.deleteProject(id)
          $this.$router.go({
            path: '/'
          })
        }
      })
    },
    async deleteAllProjects () {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then((result) => {
        if (result.value) {
          Swal.fire(
            'Deleted!',
            'Your file has been deleted.',
            'success'
          )
          var delProjects = this.projects
          console.log('delP: ', delProjects)
          delProjects.filter(project => {
            ProjectsService.deleteProject(project._id)
          })
        }
      })
    },
    sortBy (sortKey) {
      console.log('sortBy', sortKey)
      this.reverse = (this.sortKey === sortKey) ? !this.reverse : false
      this.sortKey = sortKey
    }
  },
  computed: {
    filteredProjects () {
      if (this.projType || this.servType) {
        if (this.projType && !this.servType) {
          return this.projects.filter((project) => {
            if (project.type.toLowerCase().includes('project')) {
              return project.title.toLowerCase().includes(this.search.toLowerCase())
            }
          })
        }
        if (this.servType && !this.projType) {
          return this.projects.filter((project) => {
            if (project.type.toLowerCase().includes('service')) {
              return project.title.toLowerCase().includes(this.search.toLowerCase())
            }
          })
        } else {
          return this.projects.filter((project) => {
            return project.title.toLowerCase().includes(this.search.toLowerCase())
          })
        }
      }
    }
  }
}
</script>
<style scoped type="text/css">
.projects {
  margin-top: 130px;
}
.table-wrap {
  width: 60%;
  margin: 10px auto;
  text-align: center;
}
table th, table tr {
  text-align: left;
  padding: 10px;
}
table th {
  color: #f2f2f2;
}
table thead {
  background: #f2f2f2;
  padding: 10px;
}
table tr td {
  padding: 10px;
}
table tr:nth-child(odd) {
  background: #f2f2f2;
}
table tr:nth-child(1) {
  background: #1590b5;
  color: #fff;
}
a {
  color: #1590b5;
  text-decoration: none;
}
a.add_project_link {
  background: #1590b5;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
a.upload_link {
  background: #1590b5;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
}
a.header {
  color: #f2f2f2;
}
</style>
