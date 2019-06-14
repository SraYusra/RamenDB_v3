<template>
  <div class="projects">
    <h1>View Project</h1>
      <div class="form">
        <div>
          <label>Title:</label> {{ title }}
        </div>
        <div>
          <label>Description:</label> {{ description }}
        </div>

        <div>
          <label>Ticket Number:</label> {{ ticketNum }}
        </div>
        <div>
          <label>Type:</label> {{ type }}
        </div>
        <div>
          <label>Status:</label> {{ status }}
        </div>
        <div>
          <label>Faculty/Affiliate:</label> {{ faculty }}
        </div>
        <div>
          <label>Customer Name:</label> {{ customerName }}
        </div>
        <div>
           <label>Customer ID:</label> {{ customerID }}
        </div>
        <div>
           <label>Course ID:</label> {{ courseID }}
        </div>
        <div>
          <label>Hours:</label> {{ hours }}
        </div>
        <div>
          <label>Start Date:</label> {{ startDate }}
        </div>
        <div>
          <label>End Date:</label> {{ endDate }}
        </div>
        <div>
          <button class="app_project_btn" @click="editProject">Edit</button>
          <!-- <router-link v-bind:to="{ name: 'editproject', params: { id: project._id } }">Edit</router-link>  -->
        </div>
      </div>
  </div>
</template>

<script>
import ProjectsService from '@/services/ProjectsService'
import Swal from 'sweetalert2'

export default {
  name: 'viewproject',
  data () {
    return {
      title: '',
      description: '',
      ticketNum: '',
      type: '',
      customerName: '',
      customerID: '',
      courseID: '',
      status: '',
      hours: '',
      startDate: '',
      endDate: '',
      faculty: '',

      statuses: [],
      faculties: [],

      options: [],
      department: ''
    }
  },
  mounted () {
    this.getProject()
    this.statuses = require('./status.json').statuses // The different status options. JSON file that we use for the statuses dropdown
    this.faculties = require('./faculties.json').faculties // All the faculties pulled from a json file, to the faculties dropdown
  },
  methods: {
    async getProject () {
      // Gets the data from the API to be edited
      const response = await ProjectsService.getProject({
        id: this.$route.params.id // takes the id from the url, gets data by id" => projects/:id
      })
      this.title = response.data.title
      this.description = response.data.description
      this.ticketNum = response.data.ticketNum
      this.type = response.data.type
      this.customerName = response.data.customerName
      this.customerID = response.data.customerID
      this.courseID = response.data.courseID
      this.status = response.data.status
      this.hours = response.data.hours
      // debugger
      // var tempDate = response.data.startDate !== undefined ? response.data.startDate.split('T') : ''
      this.startDate = response.data.startDate !== undefined ? response.data.startDate.split('T')[0] : undefined
      // tempDate = response.data.endDate !== undefined ? response.data.endDate.split('T') : ''
      this.endDate = response.data.endDate !== undefined ? response.data.endDate.split('T')[0] : undefined
      this.faculty = response.data.faculty.replace(/['"]+/g, '')
    },
    async editProject () {
      console.log()
      // const response = await ProjectsService.getProject({
      //   id: this.$route.params.id // takes the id from the url, gets data by id" => projects/:id
      // })
      // $this.$router.go({
      //   path: '/edit/', id
      // })
    },
    async updateProject () {
      // Sends the updated data to the API
      var errorString = ''
      if (this.startDate !== `"[0-9]{4}-[0-9]{2}-[0-9]{2}"`) {
        console.log('incorrect')
      }
      if (this.startDate === undefined) {
        console.log('un')
      }
      if (this.title !== '' && this.ticketNum !== '' && this.description !== '' && this.customerName !== '' && this.customerID !== '') {
        await ProjectsService.updateProject({
          id: this.$route.params.id,
          title: this.title,
          description: this.description,
          ticketNum: this.ticketNum,
          type: this.type,
          customerName: this.customerName,
          customerID: this.customerID,
          courseID: this.courseID,
          status: this.status,
          hours: this.hours,
          startDate: this.startDate,
          endDate: this.endDate,
          faculty: this.faculty
        })
        // Message that pops up when successfully updated
        Swal.fire(
          'Great!',
          `Your project has been updated!`,
          'success'
        )
        this.$router.push({ name: 'Projects' })
      } else {
        if (this.title === '') {
          errorString += 'Please enter a title.<br>'
        }
        if (this.ticketNum === '') {
          errorString += 'Please enter a ticket number.<br>'
        }
        if (this.description === '') {
          errorString += 'Please enter a description.<br>'
        }
        if (this.customerName === '') {
          errorString += 'Please enter a customer name.<br>'
        }
        if (this.customerID === '') {
          errorString += 'Please enter a customer ID.<br>'
        }
        console.log(errorString)
        Swal.fire(
          'Error!',
          errorString,
          'error'
        )
      }
    }
  }
}
</script>
<style type="text/css">
.form input, .form textarea {
  width: 500px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
}
.form div {
  margin: 20px;
}
.form select {
  width: 200px;
  height: 35px;
  padding: 10px;
  border: 1px solid #e0dede;
  outline: none;
  font-size: 12px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.form basic-select {
  width: 200px;
  height: 35px;
  padding: 10px;
  outline: none;
  font-size: 12px;
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}
.app_project_btn {
  background: #1590b5;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 520px;
  border: none;
  cursor: pointer;
}
</style>

