import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Log, UrlQueryParameterCollection } from '@microsoft/sp-core-library';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Menu,Drawer, Form, Col, Row, Input, Select, DatePicker, Icon} from 'antd';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import {ApproveListItem} from './ApproveListItem';
import {IBusinessApplicationState} from './IBusinessApplicationState';
const { Option } = Select;
export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    data: null,
    visible: false
  }
  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };





  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
    },

    {
      title: '申请人',
      dataIndex: 'creatUser',
      key: 'creatUser',
    },

    {
      title: '申请时间',
      dataIndex: 'ApproveTime',
      key: 'ApproveTime',
      render: text => <a>{moment(text).format('YYYY-MM-DD')}</a>,//TODO：日期格式化
    },
  ];

  constructor(props) {
    super(props);
    this.getPageList();
  }
  
//添加Item
  private createItem(): void {   
    this.showDrawer();
    alert("sdds");
  }  


  private getPageList() {
    sp.web.currentUser.get().then(current_user => {
      console.log(current_user);
      var abc=sp.web.lists.getByTitle('审批').items.getAll();
      console.log(abc);
      var aaa=sp.web.siteUsers.getById(current_user.Id);
      console.log(aaa);
      sp.web.lists.getByTitle("审批").items.filter('ApprovalUsersId eq ' + current_user.Id).getAll().then(items => {
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
      var abc=sp.web.lists.getByTitle('审批').items.getAll();
      console.log(abc);
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


  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { TabPane } = Tabs;
    const operations = <Button >申请</Button>;
    const { data } = this.state;
    console.log(data);
    return (
    
      <div  >
        <Menu mode="horizontal" defaultSelectedKeys={['1']} className={styles.menu} >
        <Menu.Item key="1">待办</Menu.Item>
        <Menu.Item key="2" onclick='handleChange'>已办</Menu.Item>
        <Menu.Item key="3">我的</Menu.Item>
        <Button onClick={this.showDrawer}>申请</Button>
        </Menu>
        <div>
        <Table columns={this.columns} rowKey='ApproveID' dataSource={data} size='small' />
        </div>
        {/* <Tabs defaultActiveKey='1' tabBarExtraContent={operations}>
          <TabPane tab='待办' key='1'>
            <Table columns={this.columns} rowKey='ApproveID' dataSource={data} size='small' />
          </TabPane>
          <TabPane tab='已办' key='2'>
          </TabPane>
          <TabPane tab='我的' key='4'></TabPane>
          <TabPane tab='查询' key='6'></TabPane>
        </Tabs> */}
       {/* 创建DrawerForm */}
      
       <Drawer
          title="提交业务申请"
          width={720}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="inline" >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="单位">
                <label ></label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型">
              
                    <Select placeholder="请选择类型">
                      
                    </Select>
                 
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
               <Col span={12}>
               
               </Col>

            </Row>
          </Form>
          <div
            style={{
              position: 'absolute',
              left: 0,
              bottom: 0,
              width: '100%',
              borderTop: '1px solid #e9e9e9',
              padding: '10px 16px',
              background: '#fff',
              textAlign: 'right',
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button onClick={this.onClose} type="primary">
              Submit
            </Button>
          </div>
        </Drawer>


      </div>
    );
  }
}
