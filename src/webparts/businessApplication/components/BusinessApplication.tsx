import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Steps, Button, Table, Menu, Drawer, Form, Col, Row, Input, Select, Upload, Popover, Icon, Modal,Divider } from 'antd';
import { sp, Items, FieldLink } from '@pnp/sp';
import * as moment from 'moment';
import { ApproveListItem } from './ApproveListItem';
import { IBusinessApplicationState } from './IBusinessApplicationState';

export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    loading: false,
    data: null,
    visible: false,// 添加抽屉状态
    visible1: false,
    Title: null,
    typeList: null, // 分类list
    selindex: 1,
    timeList:null,// 初始时间轴
    lineContent:null,//初始化时间轴内容


  }

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      render: (text,row,index) => <a onClick={this.showModal.bind(this,row,index)} id='buttonck'>{text}</a>,
    },

    {
      title: '申请人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      
    },

    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <span>{moment(text).format('YYYY-MM-DD  hh:mm')}</span>,// TODO：日期格式化
      
    }
  ];
  /**
   * 退回按钮
   */
  private onClose = () => {
    this.setState({
      visible: false,
    });
  };
  /**
   * 显示弹出层(当前数据id) 
   * 根据id查询一条数据
   */
  private showModal = (row,index) => {
    console.log(row.Id);
    this.timeLine(row.Id);
    this.setState({
      selindex: index,
      visible1: true,
    });
  };
  /**
   * 处理按钮
   */
  public handleOk = (e) => {
    this.setState({
      ModalText: '页面几秒后关闭',
      loading: true
    });
    setTimeout(() => {
      this.setState({ loading: false, visible1: false });
    }, 3000);
  };
  /**
   * 退回按钮
   */
  public handleCancel = () => {
    this.setState({ visible1: false });
  };
  /**
   * 归档按钮
   */
  public File = () => {
    this.setState({ visible1: false });
  };
  /**
   * 传阅按钮
   */
  public Circulate = () => {
    this.setState({ visible1: false });
  };

  constructor(props) {
    super(props);
    this.getPageList();
  }

  //添加Item
  public createItem() {
    this.setState({
      visible: true
    });
    this.getType();
  }

  //获取当前登录用户部门
  public getUserDeptName() {

  }

  //初始化分类
  public getType() {

    const options = [];
    sp.web.lists.getByTitle('分类').items.getAll().then(Items => {
      if (Items.length > 0) {
        for (let index = 0; index < Items.length; index++) {
          options.push(<Select.Option value={Items[index]['Title']}>{Items[index]['Title']}</Select.Option>);
        }
        this.setState({
          typeList: options,
        });
      }
    });
  }
  //初始时间轴
  public timeLine(ID) {
    var itemId=ID;//打断数据传输
    console.log(itemId);
    const Line = [];
    const lineC = [];

    sp.web.lists.getByTitle('审批意见记录').items.filter('ItemId eq ' + itemId).orderBy('createTime', true).getAll().then(Items => {
      if (Items.length > 0) {
        
        for (let index = 0; index < Items.length; index++) {    
          if(Items[index]['Content']!=null)    {
          Line.push(<Steps.Step title={'处理人：'+Items[index]['Title']+" —— "+'处理时间：'+moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm')}
          description={'审批意见：'+Items[index]['Content']}/>);}
          else{
          Line.push(<Steps.Step title={'处理人：'+Items[index]['Title']+" —— "+'处理时间：'+moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm')}
          description={'审批意见：'+'无审批意见'}/>);} 
          lineC.push(Items[index]['Content']);

          console.log(Items[index]);
          console.log(Items[index].CreateUserStringId);
          console.log(Items[index]['createUserId']);            
        }
        this.setState({
          timeList: Line,
          lineContent: lineC,
 
        });  
    };
  });
  }
  /**
   * 待办查询
   */
  public getPageList() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', true).getAll().then(items => {
        if (items.length > 0) {
          items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                data: items,
              });
            });
          });
        }
      });
    }
    );
  }
  /**
  * 根据id查询单条数据
  * 返回弹出层需要的数据
  */
  /* public getPage(itemId) {
    var options = [];
    sp.web.lists.getByTitle('审批').items.filter('ApproveID eq ' + itemId).getAll().then(items => {
      // console.log(items.length);
      // console.log(items[0]['ID']);
      if (items.length > 0) {
        // options.push(Items[0]['ID']); 
        options[0] = items[0]['Title'];
        // console.log(options);
        this.setState({
          Title: options
        })
      }
    });
  } */
  /**
  * 已办查询
  */
  public alreadyDone() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('ApprovalUsersId eq ' + current_user.Id).getAll().then(items => {
        if (items.length > 0) {
          items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                data: items,
              });
            });
          });
        }
      });
    }
    );
  }
  /**
  * 我的发起查询
  */
  public aboutMe() {
    sp.web.currentUser.get().then(current_user => {
      sp.web.lists.getByTitle('审批').items.filter('createUserId eq ' + current_user.Id).getAll().then(items => {
        if (items.length > 0) {
          items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                data: items,
              });
            });
          });
        }
      });
    }
    );
  }
  /**
  * 页面渲染
  */
  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { visible1, visible, loading, data, Title,lineContent} = this.state;
    const customDot = (dot, { status, index }) => (
      
      <Popover
        title="审批意见"
        placement='top'
        content={
          <div><p>意见内容:{lineContent[index]?lineContent[index]:'无审批意见'}</p>
               <p>step {index} status: {status} </p>
          </div>
        }
      >
        {dot}
      </Popover>
    );
    //console.log(data);
    return (

      <div  >
        <Menu mode='horizontal' defaultSelectedKeys={['1']} className={styles.menu} >
          <Menu.Item key='1' onClick={this.getPageList.bind(this)}>待办</Menu.Item>
          <Menu.Item key='2' onClick={this.alreadyDone.bind(this)}>已办</Menu.Item>
          <Menu.Item key='3' onClick={this.aboutMe.bind(this)}>我的</Menu.Item>
          <Button onClick={this.createItem.bind(this)} style={{ float: 'right' }}>申请</Button>
        </Menu>
        <div>
          <Table columns={this.columns} rowKey='ApproveID' dataSource={data} size='small' />
        </div>

        
        <Modal   
          width={800}    
          visible={visible1}
          title='待审阅'
          centered
          onCancel={this.handleCancel}
          footer={null}
        >
          <Row>
          {/* <Table columns={this.columns} rowKey='ApproveID' dataSource={dataList} size='small' />   */}

          {/* <div>{dataList.ApproveID}</div> */}
          <Col span={13} >
          <Steps direction="vertical" style={{ marginTop: 10 }}  current={2} status='error' size='small' /* progressDot={customDot} */>
            <Steps.Step title='申请人' description={data?data[this.state.selindex].createUserName:'没有数据！'} />
            {this.state.timeList}
            <Steps.Step title='已结束' description='已结束' />
            
          </Steps>
          </Col>
          <Col span={11} >         
          <table >
            <tbody id='items'>
              <tr>
                <td>标题:</td>
                <td>{data?data[this.state.selindex].Title:'没有数据！'}</td>
              </tr>
              <tr>
                <td>内容:</td>
                <td>{data?data[this.state.selindex].Content:'没有数据！'}</td>
              </tr>
              <tr>
                <td>申请人:</td>
                <td>{data?data[this.state.selindex].createUserName:'没有数据！'}</td>
              </tr>
              <tr>
                <td>申请时间:</td>
                <td>{data?moment(data[this.state.selindex].createTime).format('YYYY-MM-DD  hh:mm'):'没有数据！'}</td>
              </tr>
            </tbody>
          </table>
          </Col>
          </Row>
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
          title='提交业务申请'
          width={580}
          style={{ marginBottom: 0 }}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout='vertical' >
            <Row gutter={16}>
              <Col span={12}>
                <Form.Item label='单位'>
                  <label ></label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label='类型'>

                  <Select placeholder='请选择类型'
                  >
                    {this.state.typeList}
                  </Select>

                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label='标题'  >
                  <Input />
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label='内容'>
                  <Input.TextArea rows={4} placeholder='请输入内容' className={styles.textalign} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label='附件'>
                  <Upload.Dragger {...this.props}>
                    <p className='ant-upload-drag-icon'>
                      <Icon type='inbox' />
                    </p>
                    <p className='ant-upload-text'>点击或拖拽至此处</p>
                    <p className='ant-upload-hint'>
                      Support for a single or bulk upload. Strictly prohibit from uploading company data or other
                      band files
                    </p>
                  </Upload.Dragger>
                </Form.Item>
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
              padding: '5px 16px',
              background: '#fff',
              textAlign: 'right',
              marginBottom: 0,
            }}
          >
            <Button onClick={this.onClose} style={{ marginRight: 8 }}>
              取消
            </Button>
            <Button onClick={this.onClose} type='primary'>
              提交
            </Button>
          </div>
        </Drawer>


      </div>
    );
  }
}

