import React, { Component} from 'react';
import { View,TouchableHighlight,Modal,ListView,Alert,ActivityIndicator,StyleSheet,Text,Image,Navigator } from 'react-native';

import BaseRequestApi from '../connect/BaseRequestApi';
import Detail from './Detail';
import Main from './Main';

export default class List extends Component {

	constructor(props) {
    super(props);
    this.state ={
      first:true,
      page:1,
      msg:"",
      totalBlogs:new Array(),
      isLoading:true,
      dataSource: new ListView.DataSource({
                 rowHasChanged: (row1, row2) => row1 !== row2,
      }),
    };
  }

  componentWillMount(){
        this.getBlogRequest(this.state.page);
  }
  _pressHomeButton() {
        const { navigator } = this.props;
        if(navigator) {
          //很熟悉吧，入栈出栈
            navigator.push({
                name: 'Main',
                component: Main,
            })
        }
    }

  getBlogRequest(p){
    if(!this.state.first){
        this.state.page=this.state.page+1;
    }else{
        this.state.page=p;
    }
    try {
        BaseRequestApi.getBlogs(this.state.page)
        .then((response) => {
           let status=response.status;
           let data = response.data;
           let msg=response.msg;
           if(status==1){
            this.state.page=data.nowpage;
            for(let i=0;i<data.articles.length;i++){
                this.state.totalBlogs.push(data.articles[i]);
            }
           
            if(this.state.first){
            this.setState({
             dataSource: this.state.dataSource.cloneWithRows(this.state.totalBlogs),
             isLoading:false,
             first:false,
            });
            }else{
            this.setState({
             dataSource: this.state.dataSource.cloneWithRows(this.state.totalBlogs),
             isLoading:false,
            });
            }
            }else{
              this.setState({
              isLoading:false,
              msg:msg
              });
          }
        })
      } catch(e) {
        this.setState({
          isLoading:false,
          msg:JSON.stringify(e)
        });
      }
  }
  _loadmore(){
    if(this.state.first){
        return;
    }
    if(!this.state.isLoading){
    	this.setState({
         isLoading:true,
        });
    	this.getBlogRequest(this.state.page);
	}
  }
  //显示加载
   renderLoadingView()
     {
         return (
          <View style={styles.centering}>
          <Text>正在加载...</Text>
        <ActivityIndicator
        animating={true}
        style={[styles.centering, {height: 80}]}
        size="large"
        />
        </View>
        );
   }
     //跳转详情页
     _pressRow(blogId){
        const { navigator } = this.props;
        if(navigator) {
          //很熟悉吧，入栈出栈
            navigator.push({
                name: 'Detail',
                component: Detail,
                params:{  
                    blogId:blogId,  
                }  
            })
        }
     }
    //显示博客列表的内容
     renderBlog(blog) {
         return (
          <TouchableHighlight onPress={()=>{this._pressRow(blog.id)}}>
             <View style={styles.newcontainer}>
                 <Image
                     source={{uri: blog.realpath}}
                     style={styles.thumbnail}
                 />
                 <View style={styles.rightContainer}>
                     <Text style={styles.title}>{blog.title}</Text>
                     <Text style={styles.year}>浏览数:{blog.views}</Text>
                 </View>
             </View>
          </TouchableHighlight>
         );
     }

  //页脚的家在显示
  _pressRendorFooter(){
         	if(this.state.isLoading){
         	    return <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:40}}><Text style={{color:"#3F51B5"}}>正在加载...</Text></View>
         	}else{
         		return <View style={{flex:1,flexDirection:'row',justifyContent:'center',alignItems:'center',height:40}}><Text style={{color:"#3F51B5"}}>{this.state.msg}</Text></View>
         	}
  }   

  render() {
    if (this.state.isLoading&&this.state.first) {
             return this.renderLoadingView();
    }
    return (
          <View style={{flex:10,flexDirection:'column'}}>
          <View style={styles.topView}><Text style={{textAlign:'center',fontSize:22,color:'#3F51B5'}}>博客列表</Text></View>
          <View style={{flex:9}}>
          <ListView
                 dataSource={this.state.dataSource}
                 renderRow={this.renderBlog.bind(this)}
                 renderFooter={this._pressRendorFooter.bind(this)}
                 style={styles.listView}
                 onEndReached={this._loadmore.bind(this)}
                 onEndReachedThreshold={200}
             />
             </View>
             </View>
    )
  }
}


//获取屏幕的宽高
var Dimensions = require('Dimensions'); 
var swidth = Dimensions.get("window").width;
var sheight = Dimensions.get("window").height;

const styles = StyleSheet.create({
  centering: {
    flex:1,
    flexDirection:'column',
    alignItems: 'center',
    justifyContent: 'center',
  },
  topView: {
    flex:1,
    flexDirection:'row',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#FFFFFF'
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  newcontainer: {
    flex: 2,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
   rightContainer: {
         flex: 2,
  },
  title: {
         fontSize: 20,
         marginBottom: 5,
         textAlign: 'center',
         color:'#3F51B5'
  },
  year: {
         textAlign: 'center',
         color:'#3F51B5'
  },
   thumbnail: {
         width: 53,
         height: 81,
  },
  listView: {
         backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 13,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  backgroundImage:{
    width:swidth,
    height:sheight
  },
  mainView: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonStyle:{
    flex:2,
    padding: 10, 
    fontSize: 20,
    textAlign:'center'
  },
  bottomView:{
    flex:2,
    flexDirection: 'row',
    height:0.2*sheight,
    justifyContent: 'space-between',
    alignItems:'center',
  },
  bottonLeftText:{
    textAlign:'left',
    width:0.3*{swidth}
  },
  bottonRightText:{
    textAlign:'right',
    width:0.3*{swidth}
  },
});