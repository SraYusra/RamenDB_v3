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
          <a href="/" class="btn btn-primary"><button class="app_project_btn">Parse CSV</button></a>
        </div>

        <!-- HERE is where the table will be displayed once CSV is uploaded -->
        <table v-if="parse_csv">
          <thead>
            <tr>
              <th v-for="key in parse_header" :key="key.id"
                  @click="sortBy(key)"
                  :class="{ active: sortKey == key }">
                {{ key | capitalize }}
                <span class="arrow" :class="sortOrders[key] > 0 ? 'asc' : 'dsc'">
                </span>
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

export default {
  name: 'upload2',
  data () {
    return {
      channel_name: '',
      channel_fields: [],
      channel_entries: [],
      parse_header: [],
      headers: ['Title', 'Description', 'Select'],
      parse_csv: [],
      sortOrders: {},
      sortKey: '',
      toBePosted: []
    }
  },
  filters: {
    capitalize: function (str) {
      return str.charAt(0).toUpperCase() + str.slice(1)
    }
  },
  methods: {
    sortBy: function (key) {
      var vm = this
      vm.sortKey = key
      vm.sortOrders[key] = vm.sortOrders[key] * -1
    },
    csvJSON (csv) {
      var vm = this
      var lines = csv.split('\n')
      var result = []
      var headers = lines[0].split(',')
      vm.parse_header = lines[0].split(',')
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

      result.pop() // remove the last item because undefined values

      // INSTEAD OF RETURN, lets pass result to a new function to filter out the keys to only get ones we need and post them to database
      return result // JavaScript object
    },
    parseCSV (csv) {
      // var vm = this
      // ALL the lines in the CSV file
      var lines = csv.split('\n')

      /*
      // Headers that are allowed, that we want
      var availHeaders = [
        'Summary',
        'Issue key',
        'Status',
        'Project description',
        'Component/s',
        'Custom field (Department/Faculty)',
        'Custom field (Customer Name)',
        'Custom field (Customer User ID)',
        'Time Spent',
        'Created',
        'Due Date'
      ]
      */

      // tempHeaders has all the first line headers of the CSV file -- includes headers we need AND don't need
      // var tempHeaders = lines[0].split(',')
      // An array on the indexes where the elements we want exist
      // We use this to map the content to its headers in later lines
      var indexes = [0, 1, 5, 10, 11, 17, 21, 22, 57, 59, 62]

      /*
      // Parsing all headers and only getting the ones we need
      // The goal here is to find all index numbers of where relevant items lie
      var count = 0
      tempHeaders.forEach(function (key) {
        // if exists within set of fields, add index to array of indexes
        availHeaders.forEach(function (headRR) {
          if (key === headRR) {
            indexes.push(count)
          }
        })
        count++
      })
      */

      console.log(indexes) // HEEREE is where it breaksss

      // Pop last entry/line in csv cuz its undefined
      lines.pop()

      // After that, read line by line. Map data to headers (these variables are to display data on page)
      lines.map(function (line, indexLine) {
        // Splits between commas unless they're in between quotes
        var entry = line.split(/,(?![^"]*"(?:(?:[^"]*"){2})*[^"]*$)/)
        entry = entry || []

        console.log(entry)

        if (indexLine < 1) return
        console.log('indexes: ' + indexes)

        var postHeaders = [
          'title',
          'ticketNum',
          'status',
          'description',
          'hours',
          'startDate',
          'type',
          'endDate',
          'customerName',
          'customerID',
          'faculty'
        ]

        var content = []
        indexes.forEach(function (index) {
          console.log(index)
          var x = parseInt(index)
          console.log(entry[x])
          content.push(entry[x])
        })
        console.log('Content: ' + content)

        var obj = {}
        postHeaders.forEach((k, i) => { obj[k] = content[i] })
        obj.status.toUpperCase()
        console.log(obj)

        this.toBePosted = this.toBePosted || []

        this.toBePosted.push(obj)

        /*
          == TODO: POST OBJ
          == THE ABOVE CODE DOES THE FOLLOWING:
          var obj = {}
          obj.title = entry[indexes[0]]
          obj.description = entry[indexes[1]]
          obj.ticketNum = entry[indexes[2]]
          obj.type = entry[indexes[3]]
          obj.status = entry[indexes[4]]
          obj.faculty = entry[indexes[5]]
          obj.customerName = entry[indexes[6]]
          obj.customerID = entry[indexes[7]]
          obj.hours = entry[indexes[8]]
          obj.startDate = entry[indexes[9]]
          obj.endDate = entry[indexes[10]]
        */

        this.addProject(obj)
      })

      // FEEL FREE TO ERASE THE CONSOLE.LOGS

      // Once all JSONS are created, post all JSONs in this.toBePosted

      // ~FIN
    },
    loadCSV (e) {
      var vm = this
      if (window.FileReader) {
        var reader = new FileReader()
        reader.readAsText(e.target.files[0])
        // Handle errors load
        reader.onload = function (event) {
          var csv = event.target.result
          // console.log(csv)
          vm.parse_csv = vm.csvJSON(csv)
          vm.parseCSV(csv)
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
    async addProject (post) {
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
      this.$swal(
        'Great!',
        `Your project has been added!`,
        'success'
      )
      this.$router.push({ name: 'Projects' })
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


