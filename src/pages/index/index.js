import Taro, { Component } from '@tarojs/taro'
import { View,ScrollView,Input,Image} from '@tarojs/components'
import { AtGrid, AtCard, AtButton, AtSegmentedControl, AtInput } from 'taro-ui'
import './index.scss'

export default class Index extends Component {
  config = {
    navigationBarTitleText: '学海泛舟'
  }
  constructor() {
    super(...arguments)
    this.state = {
      loading:true,
      item:[],
      current:0,
      search_keyword:'',
      search_results:[],
      search_error:false
    }
  }
  navigateTo(url) {
      Taro.navigateTo({ url: url })
  }
  componentDidMount () {
    this.updateList();
  }
  handleIndexClick(item){
    Taro.navigateTo({ url: `/pages/gushi/gushi?id=${item._id}` })
  }
  updateList(){
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=index_gushi'
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
  doInput(q){
    this.setState({
      search_keyword: q,
      search_error: false
    })
  }
  doSearch(){
    if (!this.state.search_keyword) {
      this.setState({
        search_error: true
      })
      return
    }
    // 获取远程数据
    Taro.showLoading({ title: '加载中' })
    Taro.request({
      url: 'https://www.fatedestiny.fun/?c=fd_gushiwen&m=search_gushi&q='+this.state.search_keyword
    }).then(res => {
      Taro.hideLoading()
      if (res.data.status == 200) {
        let item = res.data.data
        this.setState({
          search_results: item
        })
      }
    })
  }
  handleClick(idx){
    this.setState({
      current: idx
    })
  }
  render () {
      const content = this.state.item.map((ele,index)=>{
          return <View className='at-article__p' key={index} ><AtCard title={ele.title} extra={ele.author} note={ele.dynasty} onClick={this.handleIndexClick.bind(this,ele)}>
              <RichText nodes={ele.content} /> 
          </AtCard></View>
      })

      const search_content = this.state.search_results.map((ele,index)=>{
          return <View className='at-article__p' key={index} ><AtCard title={ele.title} extra={ele.author} note={ele.dynasty} onClick={this.handleIndexClick.bind(this,ele)}>
              <RichText nodes={ele.content} /> 
          </AtCard></View>
      })
      return (this.state.loading ? <AtToast isOpened text='全力载入中...'></AtToast> : 
          <View className='at-article__content' id="index">
            <AtSegmentedControl values={['推荐', '搜索']} onClick={this.handleClick} current={this.state.current} />
{this.state.current === 0 ? 
            <View className='tab-content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  <AtButton type='secondary' circle onClick={this.updateList.bind(this)}>换一换</AtButton>
                </View>
                {content} 
              </View>
            </View> : null}
{this.state.current === 1 ? 
            <View className='tab-content'>
              <View className='at-article__section'>
                <View className='at-article__p'>
                  <AtInput name='search_keyword' error={search_error} clear type='text' placeholder='请输入想检索的诗文关键字' value={this.state.search_keyword} onChange={this.doInput.bind(this)}>
                    <AtButton className='searchBtn' type='primary' onClick={this.doSearch}>确定</AtButton>
                  </AtInput>
                </View>
                {search_content}
              </View>
            </View> : null}
          </View>
      )
  }
}

