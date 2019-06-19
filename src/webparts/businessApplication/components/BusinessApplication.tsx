import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import 'antd/dist/antd.css';
import { Select, Tabs, Card, InputNumber, LocaleProvider, DatePicker, Button, Modal, Input, Badge, Form } from 'antd';
export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {
  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { TabPane } = Tabs;
    const { Option } = Select;
    function callback(key) {
      console.log(key);
    }
    function handleChange(value) {
      console.log(`selected ${value}`);
    }
    return (
      <div className={styles.businessApplication} >
        <div className={styles.container}>
          <Tabs defaultActiveKey='1' onChange={callback}>
            <TabPane tab='发起审阅' key='1' style={{ height: 500 }}>
              <div className={styles.textalign}>
                <div style={{height:50}}>
                  单位<Select style={{ width: 400,paddingLeft:10 }} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                  </Select>
                </div>
                <div style={{height:50}}>
                  类型<Select style={{ width: 400 ,paddingLeft:10}} onChange={handleChange}>
                    <Option value="jack">Jack</Option>
                  </Select>
                </div>
                <div style={{height:50}}>
                标题<input style={{ width: 400,paddingLeft:10 }} ></input>
                </div>
              </div>
            </TabPane>
            <TabPane tab='待审阅' key='2'></TabPane>
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

