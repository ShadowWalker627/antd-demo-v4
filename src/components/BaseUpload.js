import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import axios from 'axios';
import { Upload, message, Button, Progress } from 'antd';
import { DeleteOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import _ from 'lodash';

const UploadStyled = styled(Upload).attrs({
  className: 'ldpro-editor-image-base-upload',
})`
  .ant-upload-list {
    display: none;
  }
  .ant-progress-line {
    .ant-progress-text {
      display: none;
    }
  }
`;

const ProgressWrapper = styled.div.attrs({
  className: 'ldpro-editor-image-upload-progress-wrapper',
})`
  width: 100%;
  display: ${(props) => (props.showProgress ? 'flex' : 'none')};
  align-items: center;
`;

export default class BaseUpload extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      uploadProgress: 0,
      src: '',
      fileList: [],
      showProgress: false,
      showSpin: false,
    };
    this.CancelToken = axios.CancelToken;
    this.cancelAxios = null;
  }
  render() {
    const props = {
      name: 'file',
      accept: '.png,.jpg,.JPG',
      listType: 'picture',
      headers: {
        authorization: 'authorization-text',
      },
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
      beforeUpload: (file) => {
        console.log('beforeUpload');
        this.setState({ showSpin: true });
        // console.log(file);
        // this.setState((state) => ({
        //   fileList: [...state.fileList, file],
        // }));
        return true;
      },
      onChange: (info) => {
        console.log('onChange');
        if (!_.isEmpty(info.fileList)) {
          this.setState({ fileList: [...info.fileList], showSpin: false });
        }
        // if (info.file.status !== 'uploading') {
        //   console.log(info.file, info.fileList, info.event);
        // }
        // if (info.file.status === 'done') {
        //   message.success(`${info.file.name} file uploaded successfully`);
        // } else if (info.file.status === 'error') {
        //   message.error(`${info.file.name} file upload failed.`);
        // }
      },
    };
    const { uploadProgress, fileList, showProgress, showSpin } = this.state;
    const thumbUrl = _.get(_.head(fileList), 'thumbUrl', '');
    return (
      <UploadStyled {...props}>
        <ProgressWrapper
          showProgress={showProgress}
          onClick={(e) => {
            e.stopPropagation();
          }}
        >
          <Progress percent={_.round(uploadProgress)} />
          <div
            className="abortUploadBtn"
            onClick={(e) => {
              e.stopPropagation();
              this.cancelAxios();
              this.setState({
                uploadProgress: 0,
                fileList: [],
                showProgress: false,
              });
            }}><DeleteOutlined /></div>
        </ProgressWrapper>
        <div
          style={{
            display: showSpin ? 'flex' : 'none',
            width: 400,
            height: 400,
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <LoadingOutlined style={{ fontSize: 28, color: '#c8152d' }} />
        </div>

        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <img
          style={{ width: 400 }}
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
    );
  }
}
