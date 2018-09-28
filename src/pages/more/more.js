import Taro, { Component } from '@tarojs/taro'
import { View, Text,Image} from '@tarojs/components'
import { AtAvatar,AtList,AtListItem } from 'taro-ui'
import './more.scss'

import recentPng from '../../asset/images/recent.png'
import favPng from '../../asset/images/star2.png'


export default class More extends Component {
  config = {
    navigationBarTitleText: '明日之子'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      user:[]
    }
  }
  componentDidMount () {
    const that = this
    wx.getUserInfo({
      success : function(res) {
        that.setState({
          loading:false,
          user: res.userInfo
        })
      }
    })
  }
  
  render () {
    const { user } = this.state
    // <AtList>
    //       <AtListItem title='我的历史' arrow='right' thumb={recentPng} />
    //       <AtListItem title='我的收藏' arrow='right' thumb={favPng} />
    //     </AtList>
    return ( this.state.loading ? null :
      <View className='more'>
        <View className='user flex-wrp'>
          <AtAvatar size='large' circle image={user.avatarUrl}></AtAvatar>
          {user.nickName}
        </View>
      </View>
    )
  }
}

