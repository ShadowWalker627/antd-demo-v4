## antd使用问题记录 包括v3和v4版本

### Table

##### 1. virtualizedtableforantd (v3)

用于不分页的长表格优化
* https://www.jianshu.com/p/fdf127f2967c
* https://www.npmjs.com/package/virtualizedtableforantd

### Select

#### 1. filterOption (v3)
 ==如果不设置filterOption={false}会导致==：即使拿到了最新的数据还是依旧显示无匹配结果 https://www.cnblogs.com/soyxiaobi/p/9984491.html
 
 ### Form
 
 #### 校验规则 (v3)
antd的校验规则是基于 [ async-validator](https://github.com/yiminghe/async-validator)

所以完整的API文档应该看async-validator。

当表单需要跟后端请求来做校验时，应该使用asyncValidator
```
// 样例
const fields = {
  asyncField: {
    asyncValidator(rule, value, callback) {
      ajax({
        url: 'xx',
        value: value
      }).then(function(data) {
        callback();
      }, function(error) {
        callback(new Error(error))
      });
    }
  },

  promiseField: {
    asyncValidator(rule, value) {
      return ajax({
        url: 'xx',
        value: value
      });
    }
  }
};
```

### Upload 

#### 自定义Upload上传逻辑和展示 (v4)

涉及到的属性
- customRequest 通过覆盖默认的上传行为，可以自定义自己的上传实现
- onChange

用到的依赖库
- axios
- antd v4

上传接口用的是antd的Upload示例提供的接口地址

##### 组件Dom结构
> 思路
> 1. 首先使用antd提供的默认上传组件
> 2. 通过样式控制，隐藏ant-upload-list，然后通过fileList，获取已加载的图片的base64信息，即thumbUrl的值，通过一个img标签进行展示
> 3. 展示了待上传图片后，接下来是就处理customRequest，通过axios的onUploadProgress配置，可以获取上传进度，将上传进度更新到Progress进行展示
> 4. 如果要终止Upload的上传，是通过终止axios来实现的，用到axios.CancelToken。[参考文章“Axios取消请求CancelToken”](https://juejin.im/post/5d664634f265da03d42fb6dc)；当然如果使用其他的xhr库，基本也都有提供abort操作


```
<UploadStyled {...props}>
    <ProgressWrapper
      showProgress={showProgress}
      onClick={(e) => {
        e.stopPropagation();
      }}
    >
      <Progress percent={_.round(uploadProgress)} />
      <DeleteOutlined
        onClick={(e) => {
          e.stopPropagation();
          this.cancelAxios();
          this.setState({
            uploadProgress: 0,
            fileList: [],
            showProgress: false,
          });
        }}
      />
    </ProgressWrapper>
    
    {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
    <img
      style={{ width: '100%' }}
      onClick={(e) => {
        e.stopPropagation();
      }}
      alt=""
      src={thumbUrl}
    />
    <Button style={{ display: _.isEmpty(fileList) ? 'inline-block' : 'none' }}>
      <UploadOutlined /> Click to Upload
    </Button>
</UploadStyled>
```

Upload的customRequest属性
```
customRequest: (option) => {
    const formData = new FormData();
    formData.append('files[]', option.file);
    const context = this;
    axios
      .post('https://www.mocky.io/v2/5cc8019d300000980a055e76', formData, {
        onUploadProgress: (progressEvent) => {
          const uploadProgress = (progressEvent.loaded / progressEvent.total) * 100;
          // console.log(uploadProgress);
          context.setState({ uploadProgress, showProgress: true });
        },
        cancelToken: new this.CancelToken(function executor(c) {
          context.cancelAxios = c;
        }),
      })
      .then((res) => {
        console.log(res);
        const { data } = res;
        context.setState({ fileList: [data], showProgress: false });
      });
},
```