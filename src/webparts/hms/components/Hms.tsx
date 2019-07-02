import * as React from 'react';

import styles from './HMS.module.scss';

import { IHmsProps } from './IHMSProps';

import { escape } from '@microsoft/sp-lodash-subset';

import { sp } from "@pnp/sp";

import { Table, Divider, Button,Modal,Icon } from 'antd';

import 'antd/dist/antd.css';

import * as moment from 'moment';
import { DisplayMode } from '@microsoft/sp-core-library';

export default class HMS extends React.Component<IHmsProps, {}> {

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
  public guiDang = () => {
    this.setState({ visible: false });
  };
  public chuanYue = () => {
    this.setState({ visible: false });
  };

  state = {
    loading: false,
    visible: false,
    data: null,
    // selectedOption: null,
    // selectValue:null
    ModalText: 'lalalala',

  };

  columns = [

    {

      title: '编号',

      dataIndex: 'ApproveID',

      key: 'ApproveID',

      render: text => <a onClick={this.showModal} id='buttonck'>{text}</a>,//TODO:标题字数限制

    },

    {

      title: '标题',

      dataIndex: 'Title',

      key: 'Title',

    },

    {

      title: '申请时间',

      dataIndex: 'ApproveTime',

      key: 'ApproveTime',

      render: text => <a>{moment(text).format('YYYY-MM-DD')}</a>,//TODO：日期格式化

    },

    {

      title: '操作',

      key: 'action',

      render: (text, record) => (

        <span>

          <a href="javascript:;">处理 {record.name}</a>

          <Divider type="vertical" />

          <a href="javascript:;">删除</a>

        </span>

      ),

    },

  ];

  constructor(props) {

    super(props);

    this.getPageList();

  }

  private getPageList() {

    sp.web.currentUser.get().then(current_user => {

      sp.web.lists.getByTitle("审批").items.filter('EditorId eq ' + current_user.Id).getAll().then(items => {

        if (items.length > 0) {

          this.setState({

            data: items

          })

        }

      });

    }

    );

  }

  /**
  
  * 切换TAB页时候的数据重新渲染
  
  * 根据实际情况修改，flag表示类型
  
  */

  public handleChange(flag: number): void {

    sp.web.currentUser.get().then(current_user => {

      sp.web.lists.getByTitle("审批").items.filter('EditorId eq ' + current_user.Id).getAll().then(items => {

        if (items.length > 0) {

          this.setState({

            data: items

          })

        }

      });

    });

  }

  /**
  
  * 直接删除某一个item
  
  * 删除成功则返回true
  
  */

  public handleDelete(): boolean {

    return false;

  }

  public handle

  public render(): React.ReactElement<IHmsProps> {

    const { visible, loading,data} = this.state;

    console.log(data);

    return (

      <div>

        {/* TAB页 切换时重新赋值

        Tab页最右边添加“新建业务申请”的链接

        列表链接点击后弹出业务申请展示页面（新打开页） */}

        <Table columns={this.columns} rowKey='ApproveID' dataSource={data} size='small' />

        <Modal
          width='800'
          visible={visible}
          title='带审阅'
          centered
          onCancel={this.handleCancel}
          footer={null}
        >
            <Button key='chuanyue' onClick={this.chuanYue}>
              传阅
            </Button>

            <Button key='submit' type='primary' loading={loading} onClick={this.handleOk}>
            处理
            </Button>
            <Button key='back' type="danger" onClick={this.handleCancel}>
            退回
            </Button>
            <Button key='guidang' onClick={this.guiDang}>
            归档
            </Button>
        </Modal>

      </div>

    );

  }

}