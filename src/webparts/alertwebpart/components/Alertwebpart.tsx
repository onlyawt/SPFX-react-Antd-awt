import * as React from 'react';
import styles from './Alertwebpart.module.scss';
import { IAlertwebpartProps } from './IAlertwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Modal, Button, Input, Table, Menu, Popover, Row, Col, Steps, Upload, Divider, Icon } from 'antd';
import 'antd/dist/antd.css';
import 'core-js/es6/array';
import "es6-map/implement";
import 'es6-shim';
import "core-js/modules/es6.array.find";
import { sp } from '@pnp/sp';
import * as moment from 'moment';

export default class Alertwebpart extends React.Component<IAlertwebpartProps, {}> {
  state = {
    data: null, // 列表查询数据
    applicant: null, // 申请人姓名
    visible: false,
    timeList: null, // 初始时间轴
    selindex: 0,
    Title: null,
    ccName: [], // 抄送人姓名
    readName: [], // 已审阅姓名
    defaultFiletext: [],
    iFNUM: 0,
    modalTitle: '审阅',
    processVisible: false,
    buttonState: 'block', // 审阅按钮状态
    modalText: null, // 对话框标题
    loading: false,
    itemContent: null, // 添加正文
    id: null, //  审批ID
    menuKey: [],
    status:"wait",
    waitList:null,//待审批
    lineContent: null,// 初始化时间轴内容
  };

  constructor(props) {
    super(props);
    this.getApprove(props);
    this.handleChangeContent = this.handleChangeContent.bind(this);
  }

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: '75%',
      render: (text, row, index) =>
        <Popover placement='right' content={<div>
          <p>标题：{row.Title}</p>
          <p>申请人：{this.state.applicant}</p>
          <p>申请时间：{moment(row.createTime).format('YYYY-MM-DD hh:mm')}</p>
        </div>} >
          <a onClick={this.showModal.bind(this, row, index)} id='buttonck' className={styles.titlestyle} onMouseOver={this.approvlaContent.bind(this, row)}>
            {text}</a>
        </Popover>,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      render: text => <span className={styles.titlestyle}>{moment(text).format('YYYY-MM-DD')}</span>, // TODO：日期格式化
    }
  ];

  private showModal = async (row, index) => {
    // console.log(this.state.defaultFiletext);
    // console.log(this.props.ApprovealListName)
    this.approvlaContent(row);
    this.state.defaultFiletext.splice(0);
    this.timeLine(row.ApproveID);
    this.waitLine(row);
    await this.getFile(row.Id);
    this.setState({
      selindex: index,
      visible: true,
      id: row.ID,
    });
  }
  private handleOk = async ( id) => {
    let readUsersId = [];
    if (this.state.itemContent == null) {
      this.setState({ itemContent: '已审阅' })
    }
    this.setState({
      loading: true
    });
    let createUser = await sp.web.currentUser.get()
    // console.log(createUser.Id)
    let currentUser = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(id).get();
    let appId = currentUser.ApproveID;
    readUsersId = currentUser.ReadUsersId;
    readUsersId.push(createUser.Id)
    // console.log(readUsersId)
    await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(id).update({
      ReadUsersId: {
        results: readUsersId,
      },
    });
    setTimeout(async () => {
      await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
        Title: '审批意见',
        Content: this.state.itemContent,
        ApproveID: appId,
        ApprovalState: '阅读传阅',
        ItemId: appId.toString(),
        CreateUserId: createUser.Id,
      }); 
      this.setState({
        loading: false,
        visible: false,
      }), 500
    });
    this.getApprove(this.state.menuKey)
  }

  private handleCancel = () => {
    // console.log('Clicked cancel button');
    this.setState({
      visible: false,
    });
  }
  /**
 * 获取申请人名
 */
  private async approvlaContent(ele) {
    const rname = [];
    const cname = [];
    let userName = null;
    let name = null;
    let neme = await sp.web.getUserById(ele.createUserId).get();
    userName = neme.Title;
    this.setState({
      applicant: userName,
    });
    let sb = new Set(ele.ReadUsersId);
    let minus = ele.CCUserId.filter(x => !sb.has(x));
    for (let i = 0; i < minus.length; i++) {
      name = await sp.web.getUserById(minus[i]).get();
      cname[i] = name.Title + ' ';
    }
    for (let i = 0; i < ele.ReadUsersId.length; i++) {
      name = await sp.web.getUserById(ele.ReadUsersId[i]).get();
      rname[i] = name.Title + ' ';
    }
    this.setState({
      readName: rname,
      ccName: cname,
    });
  }

  /**
 * 获取附件
 */
  // uploadOnChange = (info)=>{

  //   if (info.file.status !== 'uploading') {
  //     console.log(info.file, info.fileList);
  //   }
  //   if (info.file.status === 'done') {
  //     // this.getFile()
  //      message.success(`${info.file.name} 上传成功`);
  //   } else if (info.file.status === 'error') {
  //     message.error(`${info.file.name} file upload failed.`);
  //   }
  // }

  private async getFile(fileId) {
    // console.log(this.state.defaultFiletext);

    let item = sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(fileId);

    // get all the attachments
    let fileName = await item.attachmentFiles.get();

    // console.log(f);
    for (let key in fileName) {

      this.state.defaultFiletext.push({
        uid: this.state.iFNUM,
        name: fileName[key].FileName,
        status: 'done',
        response: 'Server Error 500',
        url: fileName[key].ServerRelativeUrl,
      });
      // console.log(this.state.defaultFiletext);
      this.state.iFNUM--;
    }

  }

  /**
 * 审阅信息查询
 * 'ReadUsersId eq ' + currentUser.Id
 */
  private getApprove(element) {
    this.setState({
      selindex: 0,
      buttonState: 'block',
      modalTitle: '审阅',
      menuKey: element,
    });
    let ccuser = null;
    sp.web.currentUser.get().then(currentUser => {
      if (element.key == 1) {
        ccuser = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      else if (element.key == 2) {
        ccuser = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter(`${'ReadUsersId'} eq ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
        this.setState({
          modalTitle: '已审阅',
          buttonState: 'none',
        });
      }
      else {
        ccuser = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      ccuser.then(Items => {
        if (Items.length > 0) {
          this.setState({
            data: Items
          });
        }
        else {
          this.setState({
            data: null
          });
        }
      });
    });
  }
  /**
 * 处理多行文本 
 */
public optimizingData(strDate): string {
  if(strDate!=null){
  var msg = strDate.replace(/<\/?[^>]*>/g,''); //去除HTML Tag
  msg = msg.replace(/[|]*\n/, '') //去除行尾空格
  msg = msg.replace(/&npsp;/ig, ''); //去掉npsp    
  return msg;
}
else{
  return null;
}
}
  //添加窗口正文
  handleChangeContent(event) {
    this.setState({ itemContent: event.target.value });
  }

  /**
 * 处理确定按钮
 */
  public processOk = async (key, id) => {
    let readUsersId = [];
    if (this.state.itemContent == null) {
      this.setState({ itemContent: '已审阅' })
    }
    this.setState({
      loading: true
    });
    let createUser = await sp.web.currentUser.get()
    // console.log(createUser.Id)
    let currentUser = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(id).get();
    let appId = currentUser.ApproveID;
    readUsersId = currentUser.ReadUsersId;
    readUsersId.push(createUser.Id)
    // console.log(readUsersId)
    await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(id).update({
      ReadUsersId: {
        results: readUsersId,
      },
    })
    setTimeout(async () => {
      await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
        Title: '审批意见',
        Content: this.state.itemContent,
        ApproveID: appId,
        ApprovalState: '阅读传阅',
        ItemId: appId.toString(),
        CreateUserId: createUser.Id,
      }), 2000
    });
    setTimeout(() => {
      this.setState({
        loading: false,
        processVisible: false,
        visible: false,
        menuKey: key,
      });
    }, 2000);
    // console.log(this.state.menuKey);
    this.getApprove(this.state.menuKey)
  }

  /**
 * 处理取消按钮
 */
  public processCancel = () => {
    this.setState({ processVisible: false });
  }

  /**
 *模态框 步骤页面渲染
 */
public async timeLine(ID) {
  var id = ID;
  //console.log(id);
  var itemId = id;//打断数据传输
  //console.log(itemId);
  const Line = [];
  const lineC = [];

  let Items = await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.filter(`${'ApprovalState'} ne '阅读传阅' and ${'ApproveID'} eq ${itemId}`).orderBy('CreateTime', true).get();
  //console.log(Items);
  if (Items.length > 0) {
    var strname: string = '123';
    for (let index = 0; index < Items.length; index++) {
      let username = await sp.web.getUserById(Items[index]['CreateUserStringId']).get();
      strname = username.Title;
      if (Items[index]['Content'] != null) {
        var msgT: string = Items[index]['Content'];
        var msg = this.optimizingData(msgT);
        // console.log(Items[index]['ApprovalState'])
        if(Items[index]['ApprovalState']=="退回"){
          Line.push(<Steps.Step icon={<Icon type="close-circle"/>}  status="error" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'审批内容：' + msg} />);      
        }
        else if(Items[index]['ApprovalState']=="结束"){
          Line.push(<Steps.Step icon={<Icon type="check-circle" />} status="finish" title={'归档人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'已结束'} />);
        }
        else{
          Line.push(<Steps.Step status="finish" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'审批内容：' + msg} />);
        }
      }
      else {
        if(Items[index]['ApprovalState']=="退回"){
          Line.push(<Steps.Step icon={<Icon type="close-circle"/>}  status="error" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'审批内容：' + '已退回'} />);
        }
        else if(Items[index]['ApprovalState']=="结束"){
          Line.push(<Steps.Step icon={<Icon type="check-circle" />} status="finish" title={'归档人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'已结束'} />);
        }
        else{
          Line.push(<Steps.Step status="finish" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'审批内容：' + '无审批意见'} />);    
        }
      }
      lineC.push(Items[index]['Content']);  
    }

    this.setState({
      timeList: Line,
      lineContent: lineC,

    });
  }
  else {
    this.setState({
      timeList: null
    })

  }
}
/**
 * 时间轴中待审批
 */
public waitLine = async (waitText)=>{
  //console.log(waitText);
  //let Items = await sp.web.lists.getByTitle('审批').items.filter('Id eq ' + Id).orderBy('CreateTime', true).get();
  const Linewait = [];
  
  
  if(waitText.ApprovalUserStringId!=null){
    let Approvalname = await sp.web.getUserById(waitText['ApprovalUserStringId']).get();
    var strname:string = Approvalname.Title;
    //console.log(waitText.ApprovalUserStringId);
  Linewait.push(<Steps.Step status="process" icon={<Icon type="loading" />} title={'当前处理人：' + strname + '[' + moment(waitText['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
          description={'审批内容：' + '待审批...'} />);
  }
  else{
    this.state.status="finish",
    //console.log(this.state.status);
    Linewait.push(null);
  }
  this.setState({
    waitList: Linewait,
  });
  //console.log(this.state.waitList);
}
/**
 * 
 */
public handleChange() {
  return false;
}
/**
 * 
 */

  public render(): React.ReactElement<IAlertwebpartProps> {

    const { data, visible, loading } = this.state;
    // console.log(data)
    return (
      <div className={styles.alertwebpart} >
        <div >
          <Menu mode='horizontal' defaultSelectedKeys={['1']} >
            <Menu.Item key='1' onClick={this.getApprove.bind(this)}>待阅</Menu.Item>
            <Menu.Item key='2' onClick={this.getApprove.bind(this)}>已阅</Menu.Item>
          </Menu>
          <Table columns={this.columns} rowClassName={() => styles.colheight} rowKey='ApproveID' dataSource={data} size='small' pagination={{ pageSize: 5 }} />
          <Modal
            width={'50%'}
            title={this.state.modalTitle}
            visible={visible}
            centered
            onCancel={this.handleCancel}
            footer={null}
          >
            <Row gutter={24}>
            <Col xs={24} lg={14} >
                <table>
                  <tr>
                    <td>待审阅：</td>
                    <td>{this.state.ccName}</td>
                  </tr>
                  <tr>
                    <td>已审阅：</td>
                    <td>{this.state.readName}</td>
                  </tr>
                </table>
                <Divider></Divider>
                <table style={{ marginBottom: '20px' }}>
                  <tbody className={styles.itemsStyles} >
                    <tr style={{ lineHeight: '40px' }}>
                      <td style={{ width: 80 }}>标题:</td>
                      <td>{data ? data[this.state.selindex].Title : '没有数据！'}</td>
                    </tr>
                    <tr >
                      <td>内容:</td>
                      <td>{this.optimizingData(data ? data[this.state.selindex].Content : '没有数据！')}</td>
                    </tr>
                    <tr style={{ lineHeight: '40px' }}>
                      <td>附件</td>
                      <td>
                        <Upload showUploadList={{showRemoveIcon: false}} defaultFileList={this.state.defaultFiletext ? this.state.defaultFiletext : null}>
                        </Upload>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Divider></Divider>
                <div style={{ display: this.state.buttonState }}>
                  <Button key='submit' type='primary' loading={loading} onClick={this.handleOk.bind(this,  this.state.id)} style={{ marginLeft: '35%' }}>已阅</Button>
                </div>
              </Col>
              <Col xs={24} lg={10}>
              <Steps direction="vertical" style={{ marginTop: '10px' }} size='small' /* progressDot={customDot} */>
                  <Steps.Step status="finish"  icon={<Icon type="user" />} title={'申请人：' + (this.state.applicant ? this.state.applicant : '没有数据！') + '[' + (data ? moment(data[this.state.selindex].createTime).format('YYYY-MM-DD  HH:mm') : '没有数据！') + ']'} />
                  {this.state.timeList}
                  {this.state.waitList}
                  {/* <Steps.Step style={{}} status={'wait'} icon={<Icon type="check-circle" />} title='未结束'/> */}

                </Steps>
              </Col>
            </Row>
            {/* <Modal
              title='审阅'
              visible={this.state.processVisible}
              centered
              footer={null}
              onCancel={this.processCancel}
            >
              <div>
                <Input.TextArea
                  placeholder='已审阅'
                  autosize={{ minRows: 2, maxRows: 6 }}
                  value={this.state.itemContent}
                  onChange={this.handleChangeContent}
                />
              </div>
              <div style={{marginTop:'30px'}}>
              <Button style={{ marginLeft: '150px' }} key='submit' type='primary' loading={loading} onClick={this.processOk.bind(this,this.state.menuKey,this.state.id)}>
                确认
              </Button>
              <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.processCancel}>
                取消
              </Button>
              </div>
            </Modal> */}
          </Modal>
        </div>
      </div>
    );
  }
}
