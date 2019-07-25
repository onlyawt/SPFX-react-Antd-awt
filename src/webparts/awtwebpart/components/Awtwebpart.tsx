import * as React from 'react';
import { Tabs, Button, Table, Menu, Drawer, message, Form, Radio, Col, Row, Input, Select, Steps, Upload, Divider, Icon, Modal, Popover, Spin } from 'antd';
import 'antd/dist/antd.css';
import Search from 'antd/lib/input/Search';
import styles from './Awtwebpart.module.scss';
import { IAwtwebpartProps } from './IAwtwebpartProps';
import { escape,debounce } from '@microsoft/sp-lodash-subset';
import { sp, Items, AttachmentFileInfo } from '@pnp/sp';
import * as moment from 'moment';
import { SPUser } from '@microsoft/sp-page-context';



export default class Awtwebpart extends React.Component < IAwtwebpartProps, {} > {


  state = {
    visible : 'only',
  }
  
 //退回窗口正文
 public ChangeContent = () => {
  this.setState({ visible:'React'});
}

constructor(props) {
  
  super(props);
  this.ChangeContent=this.ChangeContent.bind(this);
}
  public render(): React.ReactElement<IAwtwebpartProps> {
   

    return(
     
      <div>
      <Input.TextArea value={this.state.visible}></Input.TextArea>
      <Button  onClick={this.ChangeContent} >申请</Button>
      </div>
     

    );
  }
}
