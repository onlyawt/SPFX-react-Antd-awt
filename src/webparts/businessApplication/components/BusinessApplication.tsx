import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Steps, Button, Table, Menu, Drawer, Form, Col, Row, Input,Radio, Select, Upload, Popover, Icon, Modal,Divider } from 'antd';
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
    selindex: 0,
    timeList:null,// 初始时间轴
    lineContent:null,//初始化时间轴内容
    approveDiv:null,
    strusername:null
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: '50%',
      // sortOrder: 'ascend',
      // sortDirections: ['descend'],
      render: (text,row,index) =><Popover placement="topLeft" content={
        <div>
          <p>标题：{text}</p>
          <p>申请人：{row.createUserName}</p>
          <p>申请时间：{moment(row.createTime).format('YYYY-MM-DD HH:MM')}</p>
        </div>
      }> <a onClick={this.showModal.bind(this,row,index)} id='buttonck'>{text}</a></Popover>,
    },
    /* {
      title: '申请人',
      dataIndex: 'createUserName',
      key: 'createUserName',
      
    }, */

    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sortDirections: ['ascend'],
      render: text => <span className={styles.titlestyle}>{moment(text).format('YYYY-MM-DD  hh:mm')}</span>,// TODO：日期格式化
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
    this.timeLine(row.ApproveID);
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
    this.getPageList(props);
  }

  //显示添加窗体
  public createItem(){
    this.setState({
      visible: true
    });
   // this.getType();
  }

  //添加Item数据
  public itemAdd(){
   
    
  }
 

  //初始化分类
 /*  public getType() {

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
  } */
  // 初始化办、阅人员选择内容;aid 标签状态1办，2是阅
public approveTypefn(aid,event) {
  var i=aid;
  if(i=="办"){
      this.setState({approveDiv:"办"});
  }
  else if(i=="阅")
  {
    this.setState({approveDiv:"阅"});
  }
}
private getPageList(key) {
    let Approval=null;
    sp.web.currentUser.get().then(current_user => {
    console.log(key.key)
    if(key.key==1){
      Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime',false).get();
    }
    else if(key.key==2){
      Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUsersId eq ' + current_user.Id).orderBy('createTime',false).get();
      console.log(Approval);
    }
    else if(key.key==3){
      Approval = sp.web.lists.getByTitle('审批').items.filter('createUserId eq ' + current_user.Id).orderBy('createTime',false).get();
    }
    else{
      Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime',false).get();
    }
      Approval.then(items => {
        if(items.length > 0){
          items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                data: items,
              });
            });
          });
        }
        else if(items.length == 0){
          this.setState({
            data: null
          })
        }
      });
    });
  }
  /**
  * 页面渲染
  */
 public timeLine(ID) {
  var id=ID;
  console.log(id);
  var itemId=2022;//打断数据传输
  console.log(itemId);
  const Line = [];
  const lineC = [];

  sp.web.lists.getByTitle('审批意见记录').items.filter('ItemId eq ' + itemId).orderBy('createTime', true).getAll().then(Items => {
    if (Items.length > 0) {
      var strname:string='123';
      for (let index = 0; index < Items.length; index++) {
        sp.web.getUserById(Items[index]['CreateUserStringId']).get().then(username => {
          strname=username.Title;
          console.log(strname);
        if(Items[index]['Content']!=null)    {     
        var msgT:string=Items[index]['Content'];
        var msg = msgT.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
        msg = msg.replace(/[|]*\n/, '') //去除行尾空格
        msg = msg.replace(/&npsp;/ig, ''); //去掉npsp    
        Line.push(<Steps.Step title={'处理人：'+strname+" — "+'处理时间：'+moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm')}
        description={'审批意见：'+msg}/>); }
        else{
        Line.push(<Steps.Step title={'处理人：'+strname+" — "+'处理时间：'+moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm')}
        description={'审批意见：'+'无审批意见'}/>);} 
        lineC.push(Items[index]['Content']);
      
        // console.log(Items[index]);
        // console.log(Items[index].CreateUserStringId);
        // console.log(Items[index]['createUserId']);       
        }) 
      }
      this.setState({
        timeList: Line,
        lineContent: lineC,

      });  
  };
});
}

  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { visible1, visible, loading, data, Title,lineContent,approveDiv} = this.state;
    //console.log(data);
    return (

      <div  className={styles.businessApplication}>
        <Menu mode='horizontal' defaultSelectedKeys={['1']} >
          <Menu.Item key='1' onClick={this.getPageList.bind(this)}>待办</Menu.Item>
          <Menu.Item key='2' onClick={this.getPageList.bind(this)}>已办</Menu.Item>
          <Menu.Item key='3' onClick={this.getPageList.bind(this)}>我的</Menu.Item>
          <Button onClick={this.createItem.bind(this)} className={styles.applyb}>申请</Button>
        </Menu>
        <div>
          <Table columns={this.columns} rowClassName={()=>styles.colheight} rowKey='ApproveID' dataSource={data} size='small' pagination={{pageSize:5}} />
        </div>

        {/* 显示数据和进度 */}
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
          <Steps direction="vertical" style={{ marginTop: 10 }}  current={2} status='finish' size='small' /* progressDot={customDot} */>
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
          <Form layout="vertical" >
            {/* <Row gutter={16}>
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
            </Row> */}
            <Row gutter={16}>
            <Col span={24}>
                <Form.Item label="类型"  >
                <Radio.Group defaultValue="a" buttonStyle="solid">
                <Radio.Button value="a">文档</Radio.Button>
                <Radio.Button value="b">设备维修</Radio.Button>
                <Radio.Button value="c">计算机耗材申请</Radio.Button>
                <Radio.Button value="d">其他</Radio.Button>
                </Radio.Group>
                </Form.Item>
            </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="标题" >
                  <Input  />
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
                   {/*  <p className="ant-upload-drag-icon">
                     
                    </p> */}
                    <p className="ant-upload-text"> <Icon type="inbox" />点击或拖拽至此处</p>
                    <p className="ant-upload-hint">
                    支持单个或批量上传，严谨传公司保密文件。
                    </p>
                  </Upload.Dragger>
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
               <Col span={24}>
                 <Form.Item label="审阅" >
                 <Menu mode='horizontal'  className={styles.menu} >
                  <Menu.Item key='1' onClick={this.approveTypefn.bind(this,'办')}>办</Menu.Item>
                  <Menu.Item key='2' onClick={this.approveTypefn.bind(this,'阅')}>阅</Menu.Item>
                  </Menu>
                  <div>
                  {this.state.approveDiv}
                  </div>
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
            <Button onClick={this.itemAdd.bind(this)} type="primary">
              提交
            </Button>
          </div>
        </Drawer>


      </div>
    );
  }
}

