import * as React from 'react';
import styles from './Alertwebpart.module.scss';
import { IAlertwebpartProps } from './IAlertwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Select, Modal, Button, Input, Form,Table } from 'antd';
import 'antd/dist/antd.css';
import { sp } from '@pnp/sp';


export default class Alertwebpart extends React.Component<IAlertwebpartProps, {}> {
  state = {
    data: null,
  };
  private columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },
    {
      title: '审阅人',
      dataIndex: 'age',
      key: 'age',
    },
  ];
  
  public querylist(){
    sp.web.currentUser.get().then(items=>{
      sp.web.lists.getByTitle('审批').items.filter(' ').get().then(item =>{
        if(items.length > 0){
          this.setState({
            data:item,
          })
        }
      })
    })
  }

  constructor(props){
    super(props);
    this.querylist();
  }


  public render(): React.ReactElement<IAlertwebpartProps> {

    const { data} = this.state;

    return (
      <div className={styles.alertwebpart} >
        <Table columns={this.columns} dataSource={data} rowKey='ApproveID' size='small'/>
      </div >
    );
  }
}
