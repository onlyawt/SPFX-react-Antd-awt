import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Menu,Drawer, Form, Col, Row, Input, Select, DatePicker, Icon,Modal} from 'antd';
import { sp } from '@pnp/sp';
import * as moment from 'moment';
import {ApproveListItem} from './ApproveListItem';
import {IBusinessApplicationState} from './IBusinessApplicationState';
const { Option } = Select;
export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    loading: false,
    data: null,
    visible: false,
    visible1: false,
    dataList:null
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


  public showModal= (itemId) => {
    
    this.getPage(itemId);
    this.setState({
      
      visible1: true,
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
      this.setState({ loading: false, visible1: false });
    }, 3000);
  };

  public  handleCancel = () => {
    this.setState({ visible1: false });
  };
  public File = () => {
    this.setState({ visible1: false });
  };
  public Circulate = () => {
    this.setState({ visible1: false });
  };




  columns  = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      render: text => <a onClick={this.showModal.bind(this,'65')} id='buttonck'>{text}</a>,
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

  private getPage(itemId) {


    sp.web.lists.getByTitle('审批').items.filter('ApproveID eq ' + itemId).getAll().then(items => {

      
      if (items.length > 0) {
       
        this.setState({

          dataList: items

        })

      }

    });  

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
    const { visible1,  visible, loading,data,dataList } = this.state;
    console.log(data);
    return (
    
      <div  >
        <Menu mode='horizontal' defaultSelectedKeys={['1']} className={styles.menu} >
          <Menu.Item key='1' onClick={this.getPageList.bind(this)}>待办</Menu.Item>
          <Menu.Item key='2' onClick={this.handleChange.bind(this)}>已办</Menu.Item>
          <Menu.Item key='3' onClick={this.handleMyApply.bind(this)}>我的</Menu.Item>
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


        {/* yufan */}
        <Modal
          width='800'
          visible={visible1}
          title='待审阅'
          centered
          onCancel={this.handleCancel}
          footer={null}
        >            
             <Table columns={this.columns} rowKey='ApproveID' dataSource={dataList} size='small' /> 
            
            {/* <div>{dataList.ApproveID}</div> */}
            <table>
              <tbody id='items'>
                <tr>
                  <td>标题:</td>
                  <td>dffddf</td>
                </tr>
              </tbody>
            </table>
            <Button key='Circulate' onClick={this.Circulate}>
              传阅
            </Button>

            <Button key='submit' type='primary' loading={loading} onClick={this.handleOk}>
            处理
            </Button>
            <Button key='back' type='danger' onClick={this.handleCancel}>
            退回
            </Button>
            <Button key='File' onClick={this.File}>
            归档
            </Button>
        </Modal>


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
