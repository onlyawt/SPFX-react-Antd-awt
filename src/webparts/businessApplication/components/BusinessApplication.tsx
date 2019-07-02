import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Button, Table, Menu } from 'antd';
import { sp } from '@pnp/sp';
import * as moment from 'moment';

export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    data: null,
  };

  columns  = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title'
    },

    {
      title: '申请人',
      dataIndex: 'createUserId',
      key: 'createUserId'
    },

    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <a>{moment(text).format('YYYY-MM-DD  hh:mm')}</a> // TODO：日期格式化
    }
  ];
  columns2 = [
    {
      title:'biaoti',
      dataIndex:'Title'
    }
  ];
  constructor(props) {
    super(props);
    this.getPageList();
  }

  private getPageList() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', true).getAll().then(items => {
        if (items.length > 0) {
          this.setState({
            data: items,
          });
        }
      });
    }
    );
  }
  /**
  * 切换TAB页时候的数据重新渲染
  * 根据实际情况修改，flag表示类型
  */
  public handleChange() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('ApprovalUsersId eq ' + current_user.Id).top(3).getAll().then(items => {
        if (items.length > 0) {
          this.setState({
            data: items,
          });
        }
      });
    });
  }
  public handleMyApply() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('createUserId eq ' + current_user.Id).getAll().then(items => {
        if (items.length > 0) {
          this.setState({
            data: items
          });
        }
      });
    });
  }

  public handleDelete() {

    console.log('147');

  }

  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { data } = this.state;
    console.log(data);
    return (
      <div  >
        <Menu mode='horizontal' defaultSelectedKeys={['1']} className={styles.menu} >
          <Menu.Item key='1' onClick={this.getPageList.bind(this)}>待办</Menu.Item>
          <Menu.Item key='2' onClick={this.handleChange.bind(this)}>已办</Menu.Item>
          <Menu.Item key='3' onClick={this.handleMyApply.bind(this)}>我的</Menu.Item>
          <Button onClick={this.handleDelete}>申请</Button>
        </Menu>
        <div>
          <Table columns={this.columns} rowKey='ApproveID' dataSource={data} size='small' />
        </div>
      </div>
    );
  }
}
