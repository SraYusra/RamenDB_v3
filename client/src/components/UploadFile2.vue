<template>
  <div class="upload2">
    <h1>File Upload 2.0</h1>
    <div class="panel panel-sm">
      <div class="panel-heading"> 
        <h4>CSV Import</h4>
      </div>
      <div class="panel-body">
        <div class="form-group">
          <br>
          <label for="csv_file" class="control-label col-sm-3 text-right">FILE UPLOAD</label>
          <div class="col-sm-9">
            <input type="file" id="csv_file" name="csv_file" class="form-control" @change="loadCSV($event)">
          </div>
        </div>
        <div class="col-sm-offset-3 col-sm-9">
          <div class="checkbox-inline">
            <label for="header_rows"><input type="checkbox" id="header_rows"> File contains header row?</label>
          </div>
        </div>
        
        <div class="col-sm-offset-3 col-sm-9">
          <button @click="addProjects" class="app_project_btn">Parse CSV</button>
        </div>

        <!-- HERE is where the table will be displayed once CSV is uploaded -->
        <table v-if="parse_csv">
          <thead>
            <tr>
              <th v-for="key in parse_header" :key="key.id"
                  @click="sortBy(key)"
                  :class="{ active: sortKey == key }">
                {{ key | capitalize }}
                <!-- <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                </span> -->
              </th>
            </tr>
          </thead> 
          <tr v-for="csv in parse_csv" :key="csv.id">
            <td v-for="key in parse_header" :key="key.id">
              {{csv[key]}}
            </td>
            <td>
              <div class="checkbox-inline">
                <input type="checkbox" id="select">
              </div>
            </td>
          </tr>
          
        </table>

      </div>
    </div>
  </div>
</template>

<script>
import ProjectsService from '@/services/ProjectsService'
import Swal from 'sweetalert2'

export default {
  name: 'upload2',
  data () {
    return {
      projects: [],
      channel_name: '',
      channel_fields: [],
      channel_entries: [],
      parse_header: [],
      headers: [],
      parse_csv: [], // im not suree
      sortOrders: {},
      sortKey: '',
      toBePosted: [], // contains all objects to be posted to DB
      matchCount: 0,
      matchObjects: [],
      unmatchObjects: []
    }
  },
  mounted () {
    this.getProjects()
  },
  filters: {
    // capitalizes first letter only
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    // no idea............................................................................
    async getProjects () {
      const response = await ProjectsService.fetchProjects()
      this.projects = response.data.projects
    },
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    // old parse csv(dont need, why is this here)
    csvJSON (csv) {
      var vm = this
      var lines = csv.split('\n')
      var result = []
      var headers = lines[0].split(',')
      this.parse_header = lines[0].split(',')
      lines[0].split(',').forEach(function (key) {
        vm.sortOrders[key] = 1
      })

      lines.map(function (line, indexLine) {
        if (indexLine < 1) return // Jump header line

        var obj = {}
        var currentline = line.split(',')

        headers.map(function (header, indexHeader) {
          obj[header] = currentline[indexHeader]
        })
        result.push(obj)
      })

      // result.pop() // remove the last item because undefined values

      // INSTEAD OF RETURN, lets pass result to a new function to filter out the keys to only get ones we need and post them to database
      return result // JavaScript object
    },
    // reads file from loadCSV and parses CSV into objects to be posted
    parseCSV (csv) {
      var vm = this
      // ALL the lines in the CSV file
      var lines = csv.split('\n')
      var headerLine = lines[0].split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
      // console.log('headerLine :' + headerLine)
      // console.log(lines[2])

      // Headers that are allowed, that we want
      var availHeaders = [
        'Summary',
        'Issue key',
        'Status',
        'Time Spent',
        'Created',
        'Component/s',
        'Due Date',
        'Custom field (Customer Name)',
        'Custom field (Department/Faculty)',
        // 'Description',
        'Custom field (Customer User ID)'
      ]

      // tempHeaders has all the first line headers of the CSV file -- includes headers we need AND don't need

      // Pop last entry/line in csv cuz its undefined
      // lines.pop()

      // After that, read line by line. Map data to headers (these variables are to display data on page)
      // line in indexLine
      lines.map(function (line, indexLine) {
        // Splits between commas unless they're in between quotes
        var entry = line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
        console.log('entry', entry)
        entry = entry || [] // entry is null or []

        if (entry.length < 1 || entry === undefined) return // bad

        // console.log(entry)

        if (indexLine < 1) return // get rid of headers

        // Map content of line to the heaaders in lines[0], also stored in headerLine
        var lineMapped = {}
        headerLine.forEach((k, i) => { lineMapped[k] = entry[i] }) // maps headers to entries for one line at a time

        // console.log(lineMapped)

        var tempContent = []

        // Here i am trying to get all the content from availHeadersw
        availHeaders.forEach(
          (key, ind) => {
            tempContent[ind] = lineMapped[key] // getting values of entry so they can be posted to postHeaders
          }
        )

        console.log('tempContent: ' + tempContent)

        var postHeaders = [
          'title',
          'ticketNum',
          'status',
          'hours',
          'startDate',
          'type',
          'endDate',
          'customerName',
          'faculty',
          // 'description',
          'customerID'
        ]

        var obj = {}
        postHeaders.forEach((k, i) => { obj[k] = tempContent[i] })

        // if (obj) obj.type.includes('Project') ? obj.type = 'PROJECT' : obj.type = 'SERVICE' // broken
        console.log('obj: ', obj)
        console.log('tobeposted: ', vm.toBePosted)
        entry.forEach(e => {
          if (e.toLowerCase().includes('project')) {
            obj.type = 'PROJECT'
          }
        })

        if (obj.title !== undefined || obj.ticketNum !== undefined) {
          if (obj.startDate === '') {
            obj.startDate = undefined
          }
          if (obj.endDate === '') {
            obj.endDate = undefined
          }
          console.log('end: ', obj.endDate, obj.endDate === '')
          if (obj.type !== 'PROJECT') {
            obj.type = 'SERVICE'
          }
          var match = false
          console.log('this.proj', vm.projects)
          vm.projects.forEach(project => {
            if (project.title.includes(obj.title)) {
              match = true
              vm.matchCount++
              vm.matchObjects.push(obj)
            }
          })
          if (!match) {
            vm.toBePosted.push(obj) // pushes ready object to be posted into toBePosted array
          }
          match = false
          console.log('matchCount:', vm.matchCount)
        }
      })

      // Once all JSONS are created, post all JSONs in this.toBePosted, if its undefined or empty, assign it to an empty array
      // vm.toBePosted = this.toBePosted || []
      console.log('toBePosted: ', this.toBePosted)

      // vm.addProjects()

      // ~FIN
    },
    // loads the file yeeeeeeee
    loadCSV (e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result // Loads entire csv file content
          // console.log(csv)
          vm.parse_csv = vm.csvJSON(csv)
          vm.parseCSV(csv) // Passes the csv to parseCSV
        }
        reader.onerror = function (evt) {
          if (evt.target.error.name === 'NotReadableError') {
            alert('Canno\'t read file !')
          }
        }
      } else {
        alert('FileReader are not supported in this browser.')
      }
    },
    async addProjects () {
      await this.toBePosted.forEach(async function (post) {
        post.description // .replace(/"/g, '')
        post.faculty // .replace(/"/g, '')
        post.status // .toLowerCase()
        await ProjectsService.addProject({
          title: post.title,
          description: post.description,
          ticketNum: post.ticketNum,
          type: post.type,
          customerName: post.customerName,
          customerID: post.customerID,
          status: post.status,
          hours: post.hours,
          startDate: post.startDate,
          endDate: post.endDate,
          faculty: post.faculty
        })
      })
      if (this.matchCount === 0) {
        Swal.fire(
          'Great!',
          `Your projects have been added! Please REFRESH page.`,
          'success'
        )
        this.$router.push({ name: 'Projects' })
      } else {
        var matchString = ''
        var unmatchString = ''
        this.matchObjects.forEach(project => {
          matchString += project.ticketNum + '<br>'
        })
        this.toBePosted.forEach(project => {
          unmatchString += project.ticketNum + '<br>'
        })
        Swal.queue([{
          type: 'warning',
          title: 'Warning',
          confirmButtonText: 'Next',
          html: `The following projects/services have already been uploaded:<br>` + matchString,
          preConfirm: () => {
            Swal.insertQueueStep({
              type: 'success',
              title: 'Success',
              html: `The following projects/services have been uploaded:<br>` + unmatchString
            })
          }
        }])
        // Swal.fire(
        //   'Warning',
        //   `The following projects/services have already been uploaded:\n` + matchString,
        //   'warning'
        // )
        // Swal.fire(
        //   'Success',
        //   `The following projects/services have been uploaded:\n` + unmatchString,
        //   'success'
        // )
        this.$router.push({ name: 'Projects' })
      }
    }
  }
}
</script>

<style scoped>
.upload {
  margin-top: 130px;
}
html, body {
  margin: 0;
  padding: 0;
  overflow-x: scroll;
}
body {
  margin: 32px auto;
  overflow-x: scroll;
}
.panel {
  border: 2px solid #dfdfdf;
  box-shadow: rgba(0, 0, 0, 0.15) 0 1px 0 0;
  margin: 10px;
  padding: 10px;
} 
.panel.panel-sm {
  width: 60%;
  margin: 10px auto;
  text-align: center;
}
.panel-heading {
  border-bottom: 2px solid #dfdfdf;
}
.panel-heading h1, .panel-heading h2, .panel-heading h3, .panel-heading h4, .panel-heading h5, .panel-heading h6 {
  margin: 0;
  padding: 0;
}
.panel-body .checkbox-inline {
  padding: 15px 20px;
}
table {
  font-family: arial, sans-serif;
  border-collapse: collapse;
  width: 100%;
  overflow-x: scroll;
  margin-top: 15px;
}

td, th {
  border: 1px solid #dddddd;
  text-align: left;
  padding: 8px;
}

tr:nth-child(even) {
  background-color: #dddddd;
}

.app_project_btn {
  background: #1590b5;
  color: #fff;
  padding: 10px 80px;
  text-transform: uppercase;
  font-size: 12px;
  font-weight: bold;
  width: 60%;
  border: none;
  cursor: pointer;
}
</style>


