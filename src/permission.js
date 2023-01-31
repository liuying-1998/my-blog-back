import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist 白名单

// 路由前置守卫
router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)


  const hasGetUserInfo = store.getters.user; //获取本地用户信息

  if (to.meta.auth) {
    // 目标页需要鉴权
    if (hasGetUserInfo) {
      // 有用户信息，直接进入目标页
      next();
    } else {
      // 没有用户信息，判断是否有token
      const hasToken = localStorage.getItem('adminToken');

      if (hasToken) {
        // 有token，验证token是否有效
        try {
          await store.dispatch('user/getInfo'); //根据token去服务器拿用户信息
          next();
        } catch(error) {
          // 无效的token，删掉，重新登录
          await store.dispatch('user/resetToken');
          Message.error('登录过期，请重新登录');
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      } else {
        // 没有token，进行登录页重新登录
        next(`/login?redirect=${to.path}`);
        NProgress.done();
      }
    }
  } else {
    // 目标页不需要鉴权
    if (to.path === '/login' && hasGetUserInfo) {
      // 已登录情况下，要去登录页面，则默认跳转到首页
      next({path: '/'})
    } else {
      next();
    }
    NProgress.done(); //进度条完成
  }



  // determine whether the user has logged in
  // const hasToken = getToken()
  // if (hasToken) {
  //   if (to.path === '/login') {
  //     // if is logged in, redirect to the home page
  //     next({ path: '/' })
  //     NProgress.done()
  //   } else {
  //     // 判断是否有用户信息，有则放行
  //     const hasGetUserInfo = store.getters.name
  //     if (hasGetUserInfo) {
  //       next()
  //     } else {
  //       // 没有用户信息，但有token，所以先去服务器拿用户信息，正确拿到用户信息再放行
  //       try {
  //         // get user info
  //         await store.dispatch('user/getInfo')

  //         next()
  //       } catch (error) {
  //         // remove token and go to login page to re-login
  //         await store.dispatch('user/resetToken')
  //         Message.error(error || 'Has Error')
  //         next(`/login?redirect=${to.path}`)
  //         NProgress.done()
  //       }
  //     }
  //   }
  // } else {
  //   /* has no token*/

  //   if (whiteList.indexOf(to.path) !== -1) {
  //     // in the free login whitelist, go directly 在白名单直接进目标页
  //     next()
  //   } else {
  //     // other pages that do not have permission to access are redirected to the login page.
  //     next(`/login?redirect=${to.path}`)
  //     NProgress.done()
  //   }
  // }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
