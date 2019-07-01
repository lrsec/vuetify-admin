export default {
  /**
   * @description token在Cookie中存储的天数，默认1天
   */
  cookieExpires: 5,
  /**
   * @description 是否使用国际化，默认为false
   *              如果不使用，则需要在路由中给需要在菜单中展示的路由设置meta: {title: 'xxx'}
   *              用来在菜单中显示文字
   */
  useI18n: false,

  baseUrl: process.env.VUE_APP_ROOT_URL,

  title: ''

  // imageUploadUrl: process.env.VUE_APP_ROOT_URL + '/upload/image'
}
