import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import { AtGrid } from 'taro-ui'
import './author_list.scss'
export default class AuthorList extends Component {
  config = {
    navigationBarTitleText: '璀璨群星'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:false,
      authors:[]
    }
  }
  componentDidMount () {
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=list_author'
    }).then(res => {
      Taro.hideLoading()
      if (res.data.status == 200) {
        this.setState({
          loading: false,
          authors: res.data.data
        })
      }
    })
  }
  getGridData(){
    let _chapters = this.state.authors.map((ele,index)=>{
        return {
            image:ele.image,
            value:ele.title,
            aid:ele._id
        }
    })
    return _chapters;
  }
  handleClick(item,index){
    Taro.navigateTo({ url: `/pages/author/author?id=${item.aid}` })
  }
  render () {
      return this.state.authors.length > 0 ? (
          <View className='at-article' id="author_list">
            <View className='at-article__content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  <AtGrid  columnNum='3' data={this.getGridData()} onClick={this.handleClick.bind(this)}/>
                </View>
              </View>
            </View>
          </View>
      ) : null
  }
}

