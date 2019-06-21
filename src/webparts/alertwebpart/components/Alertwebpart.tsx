import * as React from 'react';
import styles from './Alertwebpart.module.scss';
import { IAlertwebpartProps } from './IAlertwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import {Select, Modal, Button, Input } from 'antd';
import 'antd/dist/antd.css';

export default class Alertwebpart extends React.Component < IAlertwebpartProps, {} > {
  state = {
    loading: false,
    visible: false,
  };
  
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  handleOk = () => {
    this.setState({ loading: true });
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  guidang = () => {
    this.setState({ visible: false });
  };
  
  public render(): React.ReactElement<IAlertwebpartProps> {
    const { Option } = Select;
    const { visible, loading } = this.state;
    function handleChange(e) {
      this.setState({selectValue:e.target.value})
    }
    return(
      
      <div className = { styles.alertwebpart } >
        <Button type="primary" onClick={this.showModal} id="buttonck">
          对话框
        </Button>
        <div style={{height:50}}>
                  单位<select onChange={handleChange} style={{ paddingLeft:10 }} id="select1" >
                    <option value="jack">Jack</option> 
                  </select>
        </div>
        <div id="showxinxi"></div>
        <Modal
          visible={visible}
          title="我的发起"
          centered
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              退回
            </Button>,
            <Button key="submit" type="primary" loading={loading} onClick={this.handleOk}>
              确认
            </Button>,
            <Button key="back" onClick={this.guidang}>
              归档
            </Button>,
          ]}
        >
          <div>
                <div style={{height:50}}>
                  单位<Select style={{ width: 400,paddingLeft:10 }} onChange={handleChange} id="select1" >
                    {/* <Option value="jack" id="select1">Jack</Option> */}
                  </Select>
                </div>
                <div>

                </div>
          </div>
        </Modal>
      </div >
    );
  }
}
