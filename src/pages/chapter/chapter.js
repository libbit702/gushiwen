import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components' 
import { AtCard, AtButton, AtFloatLayout, AtNavBar, AtToast } from 'taro-ui'
export default class Chapter extends Component {
  config = {
    navigationBarTitleText: '章节'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      item:null,
      isOpened:false,
      gid:null
    }
  }
  componentWillMount () {
    this.setState({
      gid: this.$router.params.id
    })
  }
  componentDidMount () {
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=single_guwen_chapter&id='+this.state.gid
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
  handleClick = () => {
    this.setState({
      isOpened: true
    })
  }
  render () {
      const { item = {} } = this.state
      const { 
        sub_category,
        main_category,
        title,
        content,
        fanyi
      } = item || {
        sub_category:'',
        main_category: '',
        title: '',
        content: '',
        fanyi: ''
      }


      return (this.state.loading ? <AtToast isOpened text='加载中'></AtToast> :
          <View className='at-article'>
            <View className='at-article__content'>
              <View className='at-article__p'>
                <AtCard extra={main_category} title={sub_category + '·' +title}>
                  <AtButton circle type='secondary' size='small' onClick={this.handleClick.bind(this)}>译注</AtButton>
                  <RichText nodes={content} />
                </AtCard>
              </View>
            </View>

            <AtFloatLayout isOpened={this.state.isOpened} title='译文' >
              <View className='at-article__h3'>
                <RichText nodes={fanyi} />
              </View>
            </AtFloatLayout>
          </View>
      )
  }
}

