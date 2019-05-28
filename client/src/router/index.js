import Vue from 'vue'
import Router from 'vue-router'
import Projects from '@/components/Projects'
import addproject from '@/components/AddProject'
import editproject from '@/components/EditProject'
import upload from '@/components/UploadFile'
import search from '@/components/SearchProjects'
import upload2 from '@/components/UploadFile2'

Vue.use(Router)

export default new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'Projects',
      component: Projects
    },
    {
      path: '/projects/add',
      component: addproject,
      name: 'addproject'
    },
    {
      path: '/projects/:id/edit',
      component: editproject,
      name: 'editproject'
    },
    {
      path: '/upload',
      component: upload,
      name: 'upload'
    },
    {
      path: '/search',
      component: search,
      name: 'search'
    },
    {
      path: '/upload2',
      component: upload2,
      name: 'upload2'
    }
  ]
})
