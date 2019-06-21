import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import 'antd/dist/antd.css';
import { Select, Tabs, Card, InputNumber, LocaleProvider, DatePicker, Button, Modal, Input, Badge, Form, Upload, message, Icon } from 'antd';
import {DropzoneComponent} from 'react-dropzone-component';
import { sp, toAbsoluteUrl } from '@pnp/sp';


export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {
  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { TabPane } = Tabs;
    const { Option } = Select;
    const { TextArea } = Input;
    function callback(key) {
      console.log(key);
    }
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} file upload failed.`);
        }
      },
    };


    var componentConfig = {
      iconFiletypes: ['.txt', '.png', '.gif'],
      showFiletypeIcon: true,
      postUrl: 'no url'
  };
  const djsConfig = {
    maxFilesize: 2,
    maxFiles: 10,
    acceptedFiles: 'image/*'
  }
    return (
      <div className={styles.businessApplication} >
        <div className={styles.container}>
          <Tabs defaultActiveKey='1' onChange={callback}>
            <TabPane tab='发起审阅' key='1' style={{ height: 600 }}>
              <div className={styles.textalign}>
                <div style={{ height: 50 }}>
                  <span className={styles.spanpad}>单位</span>
                  <Select className={styles.inputwidth} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                  </Select>
                </div>
                <div style={{ height: 50 }}>
                  <span className={styles.spanpad}>类型</span>
                  <Select className={styles.inputwidth} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                  </Select>
                </div>
                <div style={{ height: 50 }}>
                  <span className={styles.spanpad}>标题</span>
                  <input defaultValue='输入标题（必填）' className={styles.inputstyle}></input>
                </div>
                <div style={{ height: 100 }}>
                  <span className={styles.spanpad} style={{ lineHeight: 4 }}>内容</span>
                  <TextArea className={styles.inputwidth} rows={4}></TextArea>
                </div>
                <div style={{ height: 50 }}>
                  <Upload {...props}>
                    <Button>
                      <Icon type="upload" /> 点击上传
                     </Button>
                  </Upload>
                </div>
                <div style={{ height: 50 }}>
                  <span className={styles.spanpad}>审阅人</span>
                  <input defaultValue='输入名称或电子邮箱地址...' className={styles.inputstyle}></input>
                </div>
                <div style={{ height: 50 }}>
                  <span className={styles.spanpad}>传阅人</span>
                  <input defaultValue='输入名称或电子邮箱地址...' className={styles.inputstyle}></input>
                </div>
                <div>
                  <Button type="primary">重置</Button>
                  <Button>提交</Button>
                  <span>企业微信通知：</span>
                </div>
                {/* <DropzoneComponent  djsConfig={djsConfig} config={componentConfig}>
                <Button>点击上传</Button>
                </DropzoneComponent> */}
              </div>
            </TabPane>
            <TabPane tab='待审阅' key='2'>
              <table className={styles.table}>
                <tr>
                  <td>编号</td>
                  <td>标题</td>
                  <td>内容</td>
                  <td>申请人</td>
                  <td>传阅人</td>
                  <td>发布时间</td>
                  <td>附件</td>
                  <td>状态</td>
                </tr>
                <tr>
                  <td>标题</td>
                  <td></td>
                </tr>
              </table>
            </TabPane>
            <TabPane tab='已审阅' key='3'></TabPane>
            <TabPane tab='我的发起' key='4'></TabPane>
            <TabPane tab='传阅我的' key='5'></TabPane>
            <TabPane tab='查询' key='6'></TabPane>
          </Tabs>
        </div>
      </div>
    );
  }
}

