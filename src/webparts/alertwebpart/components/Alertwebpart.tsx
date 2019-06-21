import * as React from 'react';
import styles from './Alertwebpart.module.scss';
import { IAlertwebpartProps } from './IAlertwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Select, Modal, Button, Input, Form } from 'antd';
import 'antd/dist/antd.css';


export default class Alertwebpart extends React.Component<IAlertwebpartProps, {}> {
  state = {
    loading: false,
    visible: false,
    // selectedOption: null,
    // selectValue:null
    ModalText: 'lalalala',

  };
  /* public getInitialState = ()=> {
    return {selectValue :'jack'};
    
  }; */
  public showModal = () => {
    this.setState({
      visible: true,
    });
  };

  
  public  handleOk = (e) => {
    this.setState({
      ModalText:'页面几秒后关闭',
      loading: true });
    /* let demo=this.refs.getFormVlaue;
    demo.validateFields((err,values)=>{
      if(!err){
        console.log(values);
      }
    }) */
    setTimeout(() => {
      this.setState({ loading: false, visible: false });
    }, 3000);
  };

  public  handleCancel = () => {
    this.setState({ visible: false });
  };
  guidang = () => {
    this.setState({ visible: false });
  };
  handleChange (e) {
    this.setState({selectValue:e.target.value});
    // console.log('you')
  };

  public render(): React.ReactElement<IAlertwebpartProps> {

    const { visible, loading,ModalText} = this.state;

    return (
      <div className={styles.alertwebpart} >
        <Button type='primary' onClick={this.showModal} id='buttonck'>
          对话框
        </Button>
        <div style={{ height: 50 }}>
          单位<select id='select1' value='jack' onChange={this.handleChange} style={{ paddingLeft: 10 }}>
            <option value='jack'>Jack</option>
          </select>
        </div>
        <div id='showxinxi'></div>
        <Modal
          visible={visible}
          title='我的发起'
          centered
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button key='back' onClick={this.handleCancel}>
              退回
            </Button>,
            <Button key='submit' type='primary' loading={loading} onClick={this.handleOk}>
              确认
            </Button>,
            <Button key='back' onClick={this.guidang}>
              归档
            </Button>,
          ]}
        >
          

            
        </Modal>
      </div >
    );
  }
}
