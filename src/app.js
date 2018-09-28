import Taro, { Component } from '@tarojs/taro'
import Index from './pages/index'
import './app.scss'
/*
Todo
-- 1. 作者列表
-- 2. 首页内容
-- 3. 古籍列表
-- 4. 我的标签
*/ 

if (process.env.TARO_ENV === 'weapp') {
  require('taro-ui/dist/weapp/css/index.css')
} else if (process.env.TARO_ENV === 'h5') {
  require('taro-ui/dist/h5/css/index.css')
}

class App extends Component {
  config = {
    pages: [
      //推荐
      'pages/index/index',
      //古籍
      'pages/book_list/book_list',
      'pages/book/book',
      'pages/chapter/chapter',
      //作者
      'pages/author_list/author_list',
      'pages/author/author',
      'pages/gushi/gushi',
      //我
      'pages/more/more'
    ],
    window: {
      backgroundTextStyle: 'dark',
      navigationBarBackgroundColor: '#FFF5E1',
      navigationBarTitleText: '古代诗文大全',
      navigationBarTextStyle: 'black',
      enablePullDownRefresh: false
    },
    tabBar: {
      color: "#626567",
      selectedColor: "#2A8CE5",
      backgroundColor: "#FFF5E1",
      borderStyle: "white",
      list: [{
        pagePath: "pages/index/index",
        text: "拾贝",
        iconPath: "./asset/images/index.png",
        selectedIconPath: "./asset/images/index_focus.png"
      },{
        pagePath: "pages/book_list/book_list",
        text: "文苑",
        iconPath: "./asset/images/book.png",
        selectedIconPath: "./asset/images/book_focus.png"
      },{
        pagePath: "pages/author_list/author_list",
        text: "诗云",
        iconPath: "./asset/images/discovery.png",
        selectedIconPath: "./asset/images/discovery_focus.png"
      },{
        pagePath: "pages/more/more",
        text: "小子",
        iconPath: "./asset/images/burger.png",
        selectedIconPath: "./asset/images/burger_focus.png"
      }]
    }
  }

  componentDidMount () {}

  componentDidShow () {}

  componentDidHide () {}

  componentCatchError () {}

  render () {
    return (
      <Index />
    )
  }
}

Taro.render(<App />, document.getElementById('app'))
