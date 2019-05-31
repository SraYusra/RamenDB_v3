<template>
  <div class="projects">
    <h1>Edit Project</h1>
      <div class="form">
        <div>
          <input type="text" name="title" placeholder="TITLE" v-model="title">
        </div>
        <div>
          <textarea rows="15" cols="15" placeholder="DESCRIPTION" v-model="description"></textarea>
        </div>

        <div>
          <input type="text" name="ticketNum" placeholder="TICKET NUMBER" v-model="ticketNum">
        </div>
        <div>
          <label>Type: </label>
          <select v-model="type" ref="type">
              <option :selected="type=='Type...'" :value="null">Type...</option>
              <option>PROJECT</option> <!--  -->
              <option>SERVICE</option>
          </select>

          <label>Status: </label>
          <select v-model="status" ref="status">
              <option :selected="status=='Choose a Status...'" :value="null">Choose a Status...</option>
              <option v-for="s in statuses" v-bind:value="s" :key="s">{{s}}</option>
          </select>
        </div>
        <div>
          <label>Faculty/Affiliate: </label>
          <select v-model="faculty" ref="faculty">
              <option :selected="faculty=='Choose a Faculty...'" :value="null">Choose a Faculty...</option>
              <option v-for="f in faculties" v-bind:value="f" :key="f">{{f}}</option>
          </select>
        </div>

        <!-- 
        <div>
          <basic-select :options="faculties" :selected-option="department" placeholder="select item" @select="onSelect()">
          </basic-select>
        </div>   
        -->

        <div>
          <input type="text" name="customerName" placeholder="CUSTOMER NAME" v-model="customerName">
        </div>
        <div>
          <input type="text" name="customerID" placeholder="CUSTOMER ID" v-model="customerID">
        </div>
        <div>
          <input type="text" name="courseID" placeholder="COURSE ID" v-model="courseID">
        </div>
        
        <div>
          <input type="text" name="hours" placeholder="HOURS" v-model="hours">
        </div>

        <div>
            Start Date: {{startDate}}
            <br>
            End Date: {{endDate}}
        </div>

        <div>
          <label> Start Date: </label>
          <template>
            <date-pick v-model="date"></date-pick>
            <input type="date" style="width: 410px" name="startDate" placeholder="START DATE" v-model="startDate">
          </template>
        </div>

        <div>

          <label> End Date: </label>
          <input type="date" style="width: 410px" name="endDate" placeholder="END DATE" v-model="endDate">
        </div>

        <div>
          <button class="app_project_btn" @click="updateProject">Update</button>
        </div>
      </div>
  </div>
</template>

<script>
import ProjectsService from '@/services/ProjectsService'
import Swal from 'sweetalert2'

export default {
  name: 'editproject',
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
      var tempDate = response.data.startDate.split('T')
      this.startDate = tempDate[0]
      tempDate = response.data.endDate.split('T')
      this.endDate = tempDate[0]
      this.faculty = response.data.faculty.replace(/['"]+/g, '')

      // Here, mongo send back a whack date that did not work when I tried to attach it to the input fields
      // So I created a new date object, parsed whatever I get back from Mongo, and assigned these new dates to startDate and endDate

      // Update: this still doesn't work :$
      // var temp = new Date()
      // this.startDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate() // Month is incremented cuz months start at 0

      // var temp2 = new Date(this.endDate)
      // this.endDate = temp2.getFullYear() + '-' + (temp2.getMonth() + 1) + '-' + temp2.getDate()
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

