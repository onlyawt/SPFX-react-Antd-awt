import * as React from 'react';
import styles from './Alertwebpart.module.scss';
import { IAlertwebpartProps } from './IAlertwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { Modal, Button, Input, Table, Menu, Popover, Row, Col, Steps, Upload, Divider} from 'antd';
import 'antd/dist/antd.css';
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
    buttonState: false, // 审阅按钮状态
    modalText: null, // 对话框标题
    loading: false,
    itemContent: null, // 添加正文
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

  private showModal = (row, index) => {
    console.log(this.state.defaultFiletext);
    this.approvlaContent(row);
    this.state.defaultFiletext.splice(0);
    this.timeLine(row.ApproveID);
    this.getFile(row.Id);
    this.setState({
      selindex: index,
      visible: true,
    });
  }
  private handleOk = () => {
    this.setState({
      processVisible: true,
    });
  }

  private handleCancel = () => {
    console.log('Clicked cancel button');
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
    for (let i = 0; i < ele.CCUserId.length; i++) {
      name = await sp.web.getUserById(ele.CCUserId[i]).get();
      cname[i] = name.Title;
    }
    for (let i = 0; i < ele.ReadUsersId.length; i++) {
      name = await sp.web.getUserById(ele.ReadUsersId[i]).get();
      rname[i] = name.Title;
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
    console.log(this.state.defaultFiletext);

    let item = sp.web.lists.getByTitle('审批').items.getById(fileId);

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
      buttonState: false,
      modalTitle: '审阅',
    });
    let ccuser = null;
    sp.web.currentUser.get().then(currentUser => {
      if (element.key == 1) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      else if (element.key == 2) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} eq ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
        this.setState({
          modalTitle: '已审阅',
          buttonState: true,
        });
      }
      else {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
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
    let msg = strDate.replace(/<\/?[^>]*>/g, ''); // 去除HTML Tag
    msg = msg.replace(/[|]*\n/, ''); // 去除行尾空格
    msg = msg.replace(/&npsp;/ig, ''); // 去掉npsp
    return msg;
  }
  //添加窗口正文
  handleChangeContent(event) {
    this.setState({ itemContent: event.target.value });
  }  

  /**
 * 处理确定按钮
 */
  public processOk = () => {
    if(this.state.itemContent == null){
      this.setState({itemContent:'已审阅'})
    }
    this.setState({
      loading: true
    });
    setTimeout(() => {
      this.setState({
        loading: false,
        processVisible: false,
        visible: false,
      });
    }, 2000);
    setTimeout(()=>console.log(this.state.itemContent),2000)
    
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
    let id = ID;
    // console.log(id);
    let itemId = id; // 打断数据传输
    const Line = [];
    const lineC = [];

    let Items = await sp.web.lists.getByTitle('审批意见记录').items.filter('ApproveID eq ' + itemId).orderBy('CreateTime', true).get();
    // console.log(Items);
    if (Items.length > 0) {
      let strname: string = '123';
      for (let index = 0; index < Items.length; index++) {
        let username = await sp.web.getUserById(Items[index]['CreateUserStringId']).get();
        strname = username.Title;
        if (Items[index]['Content'] != null) {
          let msgT: string = Items[index]['Content'];
          let msg = this.optimizingData(msgT);
          Line.push(<Steps.Step title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm') + ']'}
            description={'审批意见：' + msg} />);
        }
        else {
          Line.push(<Steps.Step title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  hh:mm') + ']'}
            description={'审批意见：' + '无审批意见'} />);
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
      });

    }
  }

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
            width={800}
            title={this.state.modalTitle}
            visible={visible}
            onCancel={this.handleCancel}
            footer={null}
          >
            <Row gutter={24}>
              <Col span={14}>
                <table>
                  <tr>
                    <td>抄送人：</td>
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
                        <Upload defaultFileList={this.state.defaultFiletext ? this.state.defaultFiletext : null}>
                        </Upload>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <Divider></Divider>
                <Button disabled={this.state.buttonState} key='submit' type='primary' onClick={this.handleOk} >审阅</Button>
              </Col>
              <Col span={10}>
                <Steps direction='vertical' style={{ marginTop: '10px' }} current={2} status='finish' size='small' /* progressDot={customDot} */>
                  <Steps.Step title={'申请人：' + (this.state.applicant ? this.state.applicant : '没有数据！') + '[' + (data ? moment(data[0].createTime).format('YYYY-MM-DD  hh:mm') : '没有数据！') + ']'} />
                  {this.state.timeList}
                  <Steps.Step title='已结束' description='已结束' />

                </Steps>
              </Col>
            </Row>
            <Modal
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
              <Button style={{ marginLeft: '150px' }} key='submit' type='primary' loading={loading} onClick={this.processOk}>
                确认
              </Button>
              <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.processCancel}>
                取消
              </Button>
            </Modal>
          </Modal>
        </div>
      </div>
    );
  }
}
