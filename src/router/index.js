import { createRouter, createWebHistory } from 'vue-router'
import Layout from '@/views/Layout/index.vue'
import Login from '@/views/Login/index.vue'
import Home from '@/views/Home/index.vue'
import ProblemSet from '@/views/ProblemSet/index.vue'
import ProblemList from '@/views/ProblemList/index.vue'
import Discussion from '@/views/Discussion/index.vue'
import Problem from '@/views/Problem/index.vue'
import NotFound from '@/views/General/NotFound.vue'
import Description from '@/views/Problem/components/description.vue'
import Submissions from '@/views/Problem/components/submissions.vue'
import Solutions from '@/views/Problem/components/solutions.vue'
import Detail from '@/views/Discussion/detail.vue'
import User from '@/views/User/index.vue'
import CreateSolution from '@/views/Solution/createSolution.vue'
import SolutionDetail from '@/views/Solution/solutionDetail.vue'
import ProblemlistDetail from '@/views/ProblemList/problemlistDetail.vue'
import CreateDiscussion from '@/views/Discussion/createDiscussion.vue'
import CreateProblem from '@/views/ProblemSet/createProblem.vue'




const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'layout',
      component: Layout,
      children: [
        {
          path: '',
          name: 'home',
          component: Home
        },
        {
          path: '/problemset',
          name: 'problemst',
          component: ProblemSet
        },
        {
          path: '/problemlist',
          name: 'problemlist',
          component: ProblemList
        },
        {
          path: '/discussion',
          name: 'discussion',
          component: Discussion,

        },
      ]
    },
    {
      path: '/login',
      name: 'login',
      component: Login,
    },
    {
      path: '/problem/:id',
      name: 'problem',
      component: Problem,
      children: [
        {
          path: '/problem/:id/description',
          name: 'description',
          component: Description,
        },
        {
          path: '/problem/:id/submissions',
          name: 'submissions',
          component: Submissions,
        },
        {
          path: '/problem/:id/solutions',
          name: 'solutions',
          component: Solutions,
        }
      ]
    },
    {
      path: '/problemlist/:id',
      name: 'problemlistDetail',
      component: ProblemlistDetail
    },
    {
      path: '/user/:id',
      name: 'user',
      component: User,
      // children:[
      //   {
      //     path: '/user/:id/index',
      //     name:'userIndex',
      //     component: userIndex,
      //   },
      //   {
      //     path: '/user/:id/myPost',
      //     name:'userIndex',
      //     component: userIndex,
      //   },
      //   {
      //     path: '/user/:id/myStar',
      //     name:'myStar',
      //     component: myStar,
      //   },
      //   {
      //     path: '/user/:id/myProblemList',
      //     name:'myProblemList',
      //     component: myProblemList,
      //   },
      //   {
      //     path: '/user/:id/set',
      //     name:'set',
      //     component: set,
      //   },
      // ]
    },
    {
      path: '/solution/create',
      name: 'createSolution',
      component: CreateSolution
    },
    {
      path: '/problem/:pid/solutions/:sid',
      name: 'solutionDetail',
      component: SolutionDetail
    },
    {
      path: '/discussion/:id',
      name: 'detail',
      component: Detail,
    },
    {
      path: '/discussion/create',
      name: 'createDiscussion',
      component: CreateDiscussion
    },
    {
      path: '/problem/create',
      name: 'createProblem',
      component: CreateProblem
    },
    {
      path: '/:patchMatch(.*)*',
      name: 'notFound',
      component: NotFound
    },
  ],
})

router.beforeEach((to, from, next) => {
  // console.log(to, from, next)
  if (to.name === 'login' && from.name) {
    console.log(222)
    localStorage.setItem('redirectPath', from.fullPath);
  }
  next();
});

export default router
