import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import { AtGrid, AtCard, AtNavBar } from 'taro-ui'
export default class Book extends Component {
  config = {
    navigationBarTitleText: '古籍'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      item:null,
      bid:null
    }
  }
  componentWillMount () {
    this.setState({
      bid: this.$router.params.id
    })
  }
  navigateTo(url) {
      Taro.navigateTo({ url: url })
  }
  componentDidMount () {
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=single_guwen&id='+this.state.bid
    }).then(res => {
      Taro.hideLoading()
      if (res.data.status == 200) {
        let item = res.data.data
        this.setState({
          loading: false,
          item: item
        })
      }
    }) 
  }
  handleClick(item,index){
    Taro.navigateTo({ url: `/pages/chapter/chapter?id=${item.cid}`})
  }
  render () {
      const { item = {} } = this.state
      const {
        chapters,
      } = item
        || {
          chapters: [],
        }

      const _chapters = chapters.map((ele,index)=>{
          return {
              value:ele.title,
              link:ele.link,
              cid:ele._id
          }
      })

      return (this.state.loading ? <AtToast isOpened text='加载中'></AtToast> :
          <View className='at-article'>
            <View className='at-article__h2'>
              <AtCard title={this.state.item.title} thumb={this.state.item.image}>
                {this.state.item.desc}
              </AtCard>
            </View>

            <View className='at-article__content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  <AtGrid mode='rect' columnNum='2' data={_chapters} onClick={this.handleClick}/>
                </View>
              </View>
            </View>
          </View>
      )
  }
}

