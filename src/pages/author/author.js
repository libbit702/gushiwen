import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import { AtAvatar, AtCard, AtList, AtListItem, AtPagination, AtNavBar,AtToast } from 'taro-ui'

import './author.scss'

export default class Author extends Component {
  config = {
    navigationBarTitleText: '作者'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      item:null,
      aid:null,
      list:[],
      page:{
        pageSize:10,
        current:1,
        total:0
      }
    }
  }
  componentWillMount () {
    this.setState({
      aid: this.$router.params.id
    })
  }
  navigateTo(url) {
      Taro.navigateTo({ url: url })
  }
  componentDidMount () {
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })

    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=single_author&id='+this.state.aid
    }).then(res => {
      Taro.hideLoading()
      if (res.data.status == 200) {
        this.setState({
          item: res.data.data,
          loading: false,
        })
      }
    })

    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=list_author_gushiwen&id='+this.state.aid
    }).then(res => {
      if (res.data.status == 200) {
        this.setState({
          list: res.data.data,
          page:{
            ...this.state.page,
            total:res.data.data.length
          }
        })
      }
    })
  }
  onPageChange({type,current}) {
    this.setState({
      page:{
        ...this.state.page,
        current:current,
      }
    })
  }
  handleBack = () => {
    Taro.navigateBack()
  }
  render () {

    const { item = {}, list = [], page } = this.state
    const {
      fanyi_id,
      title,
      image,
      desc,
      _id
    } = item
      || {
        fanyi_id: [],
        title: '',
        image: '',
        desc: '',
        _id:0
      }

    const content = fanyi_id.map(($item,index) => {
        return (
          <View className='at-article__p' key={index}>
            <AtCard title={this.state.item['fanyi_title_'+$item]} >
              <RichText nodes={this.state.item['fanyi_'+$item]} />
            </AtCard>
          </View>
        )
    })

    const listCont = list.filter((_, i) => i >= (this.state.page.current-1) * this.state.page.pageSize && i < (this.state.page.current) * this.state.page.pageSize).map(($item,index) => {
      return <AtListItem key={index} onClick={this.navigateTo.bind(this,'/pages/gushi/gushi?id='+$item._id)} title={$item.title} arrow='right' extraText={$item.author}></AtListItem>
    })

    return (this.state.loading ? <AtToast isOpened text='加载中'></AtToast> :
      <View className='at-article' id="author">
        <View className='at-article__h2'>
          {title
            && <AtCard title={title} key={_id}>
                {image && <Image className='at-article__img' src={image} mode='aspectFit' />}
                <View>{desc}</View>
              </AtCard>
          }
        </View>
        
        <View className='at-article__p'>
          <AtList>
            {listCont}
          </AtList>
        </View>
        <View className='at-article__p'>
          {
            page.total > 0 ?
            <AtPagination onPageChange={this.onPageChange.bind(this)} icon total={page.total} pageSize={page.pageSize} current={page.current}></AtPagination> : ''
          }
        </View>
        <View>{content}</View>
      </View>
    ) 
  }
}

