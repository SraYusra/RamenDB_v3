<template>
  <div class="searchProjects">
    <h1>Search</h1>
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
      <table>
        <tr>
          <td>Title</td>
          <td width="450">Description</td>
          <td width="100">Type</td>
          <td width="100" align="center">Action</td>
        </tr>
        <tr v-for="(project,index) in filteredProjects" :key="index">
          <td>{{ project.title }}</td>
          <td>{{ project.description }}</td>
          <td>{{ project.type.toLowerCase() }}</td>
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
  </div>
</template>

<script>
import ProjectsService from '@/services/ProjectsService'

export default {
  name: 'searchProjects',
  data () {
    return {
      projects: [],
      search: '',
      selected: '',
      projType: true,
      servType: true
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
      $this.$swal({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      }).then(function () {
        ProjectsService.deleteProject(id)
        $this.$router.go({
          path: '/'
        })
      })
    }
  },
  computed: {
    filteredProjects () {
      console.log('proj: ' + this.projType)
      console.log('serv: ' + this.servType)
      if (this.projType || this.servType) {
        if (this.projType) {
          if (this.selected === 'Title') {
            return this.projects.filter((project) => {
              return project.title.toLowerCase().includes(this.search.toLowerCase())
            })
          } if (this.selected === 'Description') {
            return this.projects.filter((project) => {
              return project.description.toLowerCase().includes(this.search.toLowerCase())
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
table th,
table tr {
  text-align: left;
}
table thead {
  background: #f2f2f2;
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
</style>
