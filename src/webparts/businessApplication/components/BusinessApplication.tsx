import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Menu, Drawer, message, Form, Radio, Col, Row, Input, Select, Steps, Upload, Divider, Icon, Modal, Popover, Spin } from 'antd';
import { sp, Items } from '@pnp/sp';
import * as moment from 'moment';
import { ApproveListItem } from './ApproveListItem';
import { IBusinessApplicationState } from './IBusinessApplicationState';
import { SPUser } from '@microsoft/sp-page-context';
import { escape, debounce } from '@microsoft/sp-lodash-subset';

export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

   state = {
    loading: false,// 处理异步等待
    data: null,
    visible: false,// 添加抽屉状态
    visible1: false,
    Title: null,
    typeList: null, // 分类list
    selindex: 0,
    timeList:null,// 初始时间轴
    lineContent:null,// 初始化时间轴内容
    approveDiv:null,
    strusername:null,
    itemTitle:null,
    adata:null,
    itemContent:null, //添加正文
    itemType:null,// 添加类型
    processVisible:false,// 处理
    modalText:null,// 模态框内容
    CirculateVisible:false,// 传阅
    people_data: [],
    people_fetching: false,
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: '75%',
      // sortOrder: 'ascend',
      // sortDirections: ['descend'],
      render: (text, row, index) => <Popover placement='right' content={
        <div>
          <p>标题：{text}</p>
          <p>申请人：{row.createUserName}</p>
          <p>申请时间：{moment(row.createTime).format('YYYY-MM-DD hh:mm')}</p>
        </div>
      }> <a onClick={this.showModal.bind(this, row, index)} id='buttonck' className={styles.titlestyle}>{text}</a></Popover>,
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
      render: text => <span className={styles.titlestyle}>{moment(text).format('YYYY-MM-DD')}</span>,// TODO：日期格式化
    }
  ];


  /**
   * 添加页面
   */
  private onClose = () => {
    this.setState({
      visible: false
    });
  }
  /**
   * 显示弹出层(当前数据id)
   * 根据id查询一条数据
   */
  private showModal = (row, index) => {
    console.log(row.Id);
    this.timeLine(row.ApproveID);
    this.setState({
      selindex: index,
      visible1: true,
    });
  }
  /**
   * 处理确定按钮
   */
  public processOk = () => {
    this.setState({
      loading:true
    });
    setTimeout(() => {
      this.setState({
        loading:false,
        processVisible: false,
        visible1: false,
      });
    }, 2000);
  }
  /**
   * 处理取消按钮
   */

  public processCancel = () => {
    this.setState({ processVisible: false });
  }
  /**
   * 处理确定按钮
   */
  public CirculateOk = () => {
    this.setState({
 
        CirculateVisible: false,
      });
  }
  /**
   * 处理取消按钮
   */

  public CirculateCancel = () => {
    this.setState({ CirculateVisible: false });
  }
  /**
   * 关闭
   */
  public pageCancel = () => {
    this.setState({ 
      visible1: false});
  }
  /**
   * 处理按钮
   */
  public handleOk = (e) => {
    this.setState({
      modalText:<div>处理</div>,
      processVisible:true,
    });
  }
  /**
   * 退回按钮
   */
  public handleCancel = () => {
    this.setState({ 
      modalText:<div>是否确认退回</div>,
      processVisible: true });
  }
  /**
   * 归档按钮
   */
  public File = () => {
    this.setState({ 
      modalText:<div>是否确认归档'</div>,
      processVisible: true });
  }
  /**
   * 传阅按钮
   */
  public Circulate = () => {
    this.setState({ 
      modalText:<Select
      mode="multiple"
      labelInValue
      placeholder="选择需要传阅的人"
      notFoundContent={this.state.people_fetching ? <Spin size="small" /> : null}
      filterOption={false}
      onSearch={this.fetchUser}
      onChange={this.handleChange}
      style={{ width: '100%' }}
    >
      {this.state.people_data.map(d => (
        <Select.Option key={d.value}>{d.text}</Select.Option>
      ))}
    </Select>,
      CirculateVisible: true });
  };

  constructor(props) {
    super(props);
    this.getPageList(props);
    this.getApprove(props);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleChangetype = this.handleChangetype.bind(this);
    this.last_fetch_id = 0;
    this.fetchUser = debounce(this.fetchUser, 500);
  }

  //添加窗口标题
  handleChangeTitle(event) {
    this.setState({ itemTitle: event.target.value });
  }
  //添加窗口正文
  handleChangeContent(event) {
    this.setState({ itemContent: event.target.value });
  }
  //添加窗口类型
  handleChangetype(event) {
    this.setState({ itemType: event.target.value });
  }

  // 显示添加窗体
  public createItem() {
    this.setState({
      visible: true
    });
    // this.getType();
  }

  //




  //添加Item数据
  public itemAdd() {
    const hide = message.loading(`正在保存文件`);
    var createdate = new Date();
    var approve = createdate.getFullYear().toString() + createdate.getMonth().toString();
    approve += createdate.getDay().toString() + createdate.getHours().toString() + createdate.getMinutes().toString()
    approve += createdate.getSeconds().toString() + createdate.getMilliseconds().toString();
    setTimeout(hide, 500);
    sp.web.currentUser.get().then(current_user => {
      //console.log(current_user);

      var uid = current_user.Id;
      var ulgon = current_user.LoginName;
      //console.log(uid);
      sp.web.lists.getByTitle(this.props.ApprovealListName).items.add({
        Title: this.state.itemTitle, //标题
        Content: this.state.itemContent,//正文
        TypeId: this.state.itemType,
        createTime: createdate,
        ApprovalState: "待审阅",
        ApproveID: parseInt(approve),
        createUserId: current_user.Id,
        // createUser:{
        //  results: [ 624, 45 ]
        // }

      }).then(result => {
        result.item.select('id').get().then(d => {
          message.success(`保存成功`);
          this.setState({
            visible: false,
          });
        });
      }).catch(e => {
        message.error(`保存失败`);
      });
    });

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
  public approveTypefn(aid, event) {
    var i = aid;
    if (i == "办") {

      this.setState({ approveDiv: "办" });

    }
    else if (i == '阅') {
      this.setState({ approveDiv: '阅' });
    }
  }
  /** 
   * 业务申请待办，已办，我的发起数据查询排序
   * 传入菜单项的key值
   * */
  private getPageList(key) {
    let Approval = null;
    sp.web.currentUser.get().then(current_user => {
      if (key.key == 1) {
        Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      else if (key.key == 2) {
        Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUsersId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      else if (key.key == 3) {
        Approval = sp.web.lists.getByTitle('审批').items.filter('createUserId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      else {
        Approval = sp.web.lists.getByTitle('审批').items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      Approval.then(items => {
        if (items.length > 0) {
          items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                data: items
              });
            });
          });
        }
        else if (items.length == 0) {
          this.setState({
            data: null
          });
        }
      });
    });
  }
  /**
  * 根据id查询单条数据
  * 返回弹出层需要的数据
  */
  public getPage(itemId) {
    let options = [];
    sp.web.lists.getByTitle('审批').items.filter('ApproveID eq ' + itemId).getAll().then(items => {
      // console.log(items.length);
      // console.log(items[0]['ID']);
      if (items.length > 0) {
        // options.push(Items[0]['ID']); 
        options[0] = items[0]['Title'];
        // console.log(options);
        this.setState({
          Title: options
        });
      }
    });
  }
  private optimizingData(strDate): string {
    var msg = strDate.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
    msg = msg.replace(/[|]*\n/, '') //去除行尾空格
    msg = msg.replace(/&npsp;/ig, ''); //去掉npsp    
    return msg;
  }
  /**
   * 审阅信息查询
   * 
   */
  private getApprove(key) {
    let ccuser = null;
    sp.web.currentUser.get().then(currentUser => {
      if (key.key == 1) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      else if (key.key == 2) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter('ReadUsersId eq ' + currentUser.Id).orderBy('createTime', false).get();
      }
      else {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      ccuser.then(Items => {
        if (Items.length > 0) {
          Items.forEach(item => {
            sp.web.getUserById(item.createUserId).get().then(user => {
              item.createUserName = user.Title;
              this.setState({
                adata: Items
              });
            });
          });
        }
        else {
          this.setState({
            adata: null
          });
        }
      })
    });
  }
   /**
  *模态框 页面渲染
  */
 public async timeLine(ID) {
  var id=ID;
  //console.log(id);
  var itemId=2022;//打断数据传输
  //console.log(itemId);
  const Line = [];
  const lineC = [];

  let Items = await sp.web.lists.getByTitle('审批意见记录').items.filter('ItemId eq ' + itemId).orderBy('CreateTime', true).get();
  //console.log(Items);
    if (Items.length > 0) {
      var strname: string = '123';
      for (let index = 0; index < Items.length; index++) {
        let username = await sp.web.getUserById(Items[index]['CreateUserStringId']).get();
        strname = username.Title;
        if (Items[index]['Content'] != null) {
          var msgT: string = Items[index]['Content'];
          var msg = this.optimizingData(msgT);
          Line.push(<Steps.Step title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm') + ']'}
            description={'审批意见：' + msg} />);
        }
        else {
          Line.push(<Steps.Step title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm') + ']'}
            description={'审批意见：' + '无审批意见'} />);
        }
        lineC.push(Items[index]['Content']);

        // console.log(Items[index]);
        // console.log(Items[index].CreateUserStringId);
        // console.log(Items[index]['createUserId']);        
      }
      this.setState({
        timeList: Line,
        lineContent: lineC,

      });
    }
  }

  /**
   * 人员选取组件
   */
  private last_fetch_id;

  private fetchUser = value => {
    console.log('fetching user', value);
    this.last_fetch_id += 1;
    const fetch_id = this.last_fetch_id;
    this.setState({ people_data: [], people_fetching: true });
    sp.web.siteUsers.filter("substringof('" + value + "',Title) or substringof('" + value + "',LoginName)").get().then(users => {
      console.log('siteUsers', users);
      if (fetch_id !== this.last_fetch_id) {
        // for fetch callback order
        return;
      }
      const people_data = users.map(user => ({
        text: user.Title,
        value: user.Id,
      }));
      this.setState({ people_data, people_fetching: false });
      console.log(people_data);
    });
  };
  /**
   * 直接删除某一个item
   * 删除成功则返回true
   */
  public handleChange() {
    return false;
  }

  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { visible1, visible, loading, data, Title, lineContent, approveDiv, adata } = this.state;
    //console.log(data);
    return (

      <div className={styles.businessApplication}>
        <div className={styles.tablewid}>
          <Menu mode='horizontal' defaultSelectedKeys={['1']} >
            <Menu.Item key='1' onClick={this.getPageList.bind(this)}>待办</Menu.Item>
            <Menu.Item key='2' onClick={this.getPageList.bind(this)}>已办</Menu.Item>
            <Menu.Item key='3' onClick={this.getPageList.bind(this)}>我的</Menu.Item>
            <Button onClick={this.createItem.bind(this)} className={styles.applyb}>申请</Button>
          </Menu>
          <div>
            <Table columns={this.columns} rowClassName={() => styles.colheight} rowKey='ApproveID' dataSource={data} size='small' pagination={{ pageSize: 5 }} />
          </div>

        {/* 显示数据和进度 */}
        <Modal   
          width={800}    
          visible={visible1}
          title='待审阅'
          centered
          onCancel={this.pageCancel}
          footer={null}
        >
          <Row gutter={24}>
          {/* <Table columns={this.columns} rowKey='ApproveID' dataSource={dataList} size='small' />   */}

          {/* <div>{dataList.ApproveID}</div> */}
          
          <Col span={14} >
          <span style={{fontSize:'20px'}}>审批信息</span>
          <Button style={{float:'right'}} key='Circulate' type='primary' onClick={this.Circulate}>
            传阅
          </Button>
          <Divider></Divider>      
          <table style={{marginBottom:'20px'}}>
            <tbody className={styles.itemsStyles} >
              <tr style={{lineHeight:'40px'}}>
                <td style={{width:80}}>标题:</td>
                <td>{data?data[this.state.selindex].Title:'没有数据！'}</td>
              </tr>
              <tr >
                <td>内容:</td>
                <td>{data?data[this.state.selindex].Content:'没有数据！'}</td>
              </tr>
              <tr >
                <td>附件</td>
                <td></td>
              </tr>
            </tbody>
          </table>
          
          <Button style={{marginLeft:'80px'}} key='submit' type='primary' onClick={this.handleOk}>
            处理
          </Button>
          <Button style={{marginLeft:'15px'}} key='back' type='danger' onClick={this.handleCancel}>
            退回
          </Button>
          <Button style={{marginLeft:'15px'}} key='File' onClick={this.File}>
            归档
          </Button>  
          
          </Col>
          <Col span={10}>
          <Steps direction="vertical" style={{ marginTop: '10px'}}  current={2} status='finish' size='small' /* progressDot={customDot} */>
            <Steps.Step title={'申请人：'+(data?data[this.state.selindex].createUserName:'没有数据！')+'['+(data?moment(data[this.state.selindex].createTime).format('YYYY-MM-DD  hh:mm'):'没有数据！')+']'}/>
            {this.state.timeList}
            <Steps.Step title='已结束' description='已结束' />
            
          </Steps>
          </Col> 
          {/* 按钮模态框 */}
          <Modal
          title="传阅"
          visible={this.state.processVisible}
          centered
          footer={null}
          onCancel={this.processCancel}
          >
          {this.state.modalText}
          <Button style={{marginLeft:'150px'}} key='submit' type='primary' loading={loading} onClick={this.processOk}>
            确认
          </Button>
          <Button style={{marginLeft:'15px'}} key='back' type='danger' onClick={this.processCancel}>
            取消
          </Button>
          </Modal>
          {/* 传阅模态框 */}
          <Modal
          title="传阅"
          visible={this.state.CirculateVisible}
          centered
          footer={null}
          onCancel={this.CirculateCancel}
          >
          {this.state.modalText}
          <Button style={{marginLeft:'150px'}} key='submit' type='primary' onClick={this.CirculateOk}>
            确认
          </Button>
          <Button style={{marginLeft:'15px'}} key='back' type='danger' onClick={this.CirculateCancel}>
            取消
          </Button>
          </Modal>

          </Row>
        </Modal>
        
        <Drawer
          title='提交业务申请'
          width={580}
          style={{ marginBottom: 0 }}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout='vertical' >
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
                    <Radio.Group defaultValue="文档" buttonStyle="solid" value={this.state.itemType} onChange={this.handleChangetype} >
                      <Radio.Button value="文档">文档</Radio.Button>
                      <Radio.Button value="设备维修">设备维修</Radio.Button>
                      <Radio.Button value="计算机耗材申请">计算机耗材申请</Radio.Button>
                      <Radio.Button value="其他">其他</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="标题"  >

                    <input value={this.state.itemTitle} onChange={this.handleChangeTitle} className={styles.inputCWe} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="内容">
                    <Input.TextArea rows={4} value={this.state.itemContent} onChange={this.handleChangeContent} placeholder="请输入内容" className={styles.textalign} />
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
                    <Menu mode='horizontal' className={styles.menu} >
                      <Menu.Item key='1' onClick={this.approveTypefn.bind(this, '办')}>办</Menu.Item>
                      <Menu.Item key='2' onClick={this.approveTypefn.bind(this, '阅')}>阅</Menu.Item>
                    </Menu>
                    <div>
                      {this.state.approveDiv}
                      <Select
                        mode="multiple"
                        labelInValue
                        placeholder="Select users"
                        notFoundContent={this.state.people_fetching ? <Spin size="small" /> : null}
                        filterOption={false}
                        onSearch={this.fetchUser}
                        onChange={this.handleChange}
                        style={{ width: '100%' }}
                      >
                        {this.state.people_data.map(d => (
                          <Select.Option key={d.value}>{d.text}</Select.Option>
                        ))}
                      </Select>

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
                marginBottom: 0
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
        <div className={styles.tablewid}>
          <Menu mode='horizontal' defaultSelectedKeys={['1']} >
            <Menu.Item key='1' onClick={this.getApprove.bind(this)}>待审阅</Menu.Item>
            <Menu.Item key='2' onClick={this.getApprove.bind(this)}>已审阅</Menu.Item>
          </Menu>
          <Table columns={this.columns} rowClassName={() => styles.colheight} rowKey='ApproveID' dataSource={adata} size='small' pagination={{ pageSize: 5 }} />
        </div>
      </div>
    );
  }
}
