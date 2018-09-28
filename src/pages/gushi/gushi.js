import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import { AtTag, AtTabs, AtTabsPane, AtNavBar, AtToast, AtButton, AtIcon } from 'taro-ui'
import './gushi.scss'

export default class Gushi extends Component {
  config = {
    navigationBarTitleText: '古诗'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      item:null,
      current:0,
      tabList:[],
      innerAudioContext:null
    }
  }
  handleClick (value) {
    this.setState({
      current: value
    })
  }
  componentWillMount () {
    this.setState({
      gid: this.$router.params.id
    })
  }
  componentWillUnmount () {
    let innerAudioContext = this.state.innerAudioContext
    if (this.state.innerAudioContext != null) {
      innerAudioContext.destroy();
    }
  }
  componentDidMount () {
    const innerAudioContext = wx.createInnerAudioContext()
innerAudioContext.autoplay = true
innerAudioContext.src = 'https://www.fatedestiny.fun/7816.mp3'
innerAudioContext.onPlay(() => {
  console.log('开始播放')
})
innerAudioContext.onError((res) => {
  console.log(res.errMsg)
  console.log(res.errCode)
})

    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=single_gushiwen&id='+this.state.gid
    }).then(res => {
      Taro.hideLoading()
      if (res.data.status == 200) {
        let item = res.data.data, tabList = []
        if (!!item.yiwenjizhushi == true) {
          tabList.push({title:'译文及注释',idx:'yiwenjizhushi'})
        }

        if (!!item.chuangzuobeijing == true) {
          tabList.push({title:'创作背景',idx:'chuangzuobeijing'})
        }

        if (item.shangxi_id.length>0) {
          item.shangxi_id.map((sxid,index) => {
            tabList.push({title:item['shangxi_title_'+sxid],idx:'shangxi_'+sxid})
          })
        }

        if (item.fanyi_id.length>0) {
          item.fanyi_id.map((sxid,index) => {
            tabList.push({title:item['fanyi_title_'+sxid],idx:'fanyi_'+sxid})
          })
        }
        this.setState({
          loading: false,
          item: item,
          tabList:tabList
        })
      }
    })
  }
  
  handleBack = () => {
    Taro.navigateBack()
  }
  audioPlay = () => {
   
    let innerAudioContext = this.state.innerAudioContext
    if (this.state.innerAudioContext == null) {
      innerAudioContext = wx.createInnerAudioContext()
      innerAudioContext.src = this.state.item.play_src
      innerAudioContext.autoplay = true
      innerAudioContext.onPlay(() => {
    console.log('开始播放')
})
innerAudioContext.onError((res) => {
    console.log(res.errMsg)
    console.log(res.errCode)
})
      this.setState({
        innerAudioContext: innerAudioContext
      })
    }
    console.log('play',innerAudioContext)
    innerAudioContext.play()
  }
  audioPause = () => {
    console.log('pPauselay')
    let innerAudioContext = this.state.innerAudioContext
    innerAudioContext.pause()
  }
  render () {
      const { item = {}, tabList = [], current = 0 } = this.state
      const {
        title,
        author,
        dynasty,
        content,
        tag,
        _id,
        play_id
      } = item
        || {
          title: '',
          author: '',
          dynasty: '',
          content: '',
          tag: [],
          _id:0,
          play_id:''
        }

      const tags = tag.map(($tag,index) => {
        return (
          <View className='subitem' key={index}>
            <AtTag active size='small' type='primary' circle>{$tag}</AtTag>
          </View>
        )
      })
        
      const tabsPane = tabList.map((tab,idx) => {
        return (
          <AtTabsPane current={current} index={idx} key={idx}>
            <View className='tab-content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  <RichText nodes={item[tab.idx]} />
                </View>
              </View>
            </View>
          </AtTabsPane>
        )
      })

      //const playIcon = play_id ? <AtButton onClick={this.play} type='secondary' size='small' circle><AtIcon value={is_playing ? 'volume-plus' : 'volume-off'}></AtIcon></AtButton> : ''

      const playAudio = item.play_src ? <audio name={item.title} author={item.author} src={item.play_src} controls id='myAudio' ><AtButton onClick={this.audioPlay}>Play</AtButton>
      <AtButton onClick={this.audioPause}>Pause</AtButton> </audio>
      : null

      return (this.state.loading ? <AtToast isOpened text='加载中'></AtToast> : 
          <View className='at-article' id="gushi">
            <View className='at-article__h1'>{item.title}</View>
            <View className='at-article__info'>
              <View className='at-article__section'>
              作者：{item.author}（ {item.dynasty} ）
              </View>
            </View>

            <View className='at-article__content'>
              <View className='at-article__section'>
                <View className='at-article__h2'>原文</View>
                <View className='at-article__p'>   
                  <RichText nodes={item.content} />               
                </View>
              </View>

              <View className='at-article__section'>
                <View className='at-article__p'>   
                  {playAudio}
                </View>
              </View>

              <View className='at-article__section'>{tags}</View>

              <View className='panel'>
                <View className='panel__content'>
                  <View className='at-article__p'>
                  <AtTabs scroll onClick={this.handleClick.bind(this)} current={current} tabList={tabList}>{tabsPane}</AtTabs>
                  </View>
                </View>
              </View>
            </View>
          </View>
      )
  }
}

