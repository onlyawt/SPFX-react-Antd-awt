import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Menu, Drawer,message, Form, Radio,Col, Row, Input, Select, Upload, DatePicker, Icon, Modal, Popover } from 'antd';
import { sp, Items } from '@pnp/sp';
import * as moment from 'moment';
import { ApproveListItem } from './ApproveListItem';
import { IBusinessApplicationState } from './IBusinessApplicationState';
import { SPUser } from '@microsoft/sp-page-context';
export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    loading: false,
    data: null,
    visible: false,//添加抽屉状态
    visible1: false,
    Title: null,
   // typeList: null //分类list
    approveDiv:"办" ,//办、阅状态
    itemTitle:null,//添加标题
    itemContent:null, //添加正文
    itemType:null,//添加类型
  }

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
  private showModal = (itemId) => {

    this.getPage(itemId);
    this.setState({

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

  colhigt = styles.colheight;

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: '50%',
      // sortOrder: 'ascend',
      // sortDirections: ['descend'],
      render: (text,row) =><Popover placement="topLeft" content={
        <div>
          <p>标题：{text}</p>
          <p>申请人：{row.createUserName}</p>
          <p>申请时间：{moment(row.createTime).format('YYYY-MM-DD HH:MM')}</p>
        </div>
      }> <a onClick={this.showModal.bind(this, '65')} id='buttonck' className={styles.titlestyle}>{text}</a></Popover>,
    },

    // {
    //   title: '申请人',
    //   dataIndex: 'createUserName',
    //   key: 'createUserName',
    //   width: '20%',
    //   render: (text) => <span className={styles.titlestyle}>{text}</span>,
    // },

    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sortDirections: ['ascend'],
      render: text => <a className={styles.titlestyle}>{moment(text).format('YYYY-MM-DD')}</a> // TODO：日期格式化
    }
  ];

  constructor(props) {
    super(props);
    this.getPageList(props);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleChangetype = this.handleChangetype.bind(this);
  }

//添加窗口标题
  handleChangeTitle(event) {
    this.setState({itemTitle: event.target.value});
  }
  //添加窗口正文
  handleChangeContent(event)
  {
    this.setState({itemContent:event.target.value});
  }
  //添加窗口类型
  handleChangetype(event)
  {
    this.setState({itemType:event.target.value});
  }

  //显示添加窗体
  public createItem(){
    this.setState({
      visible: true
    });
   // this.getType();
  }

 //




  //添加Item数据
  public itemAdd(){
    const hide = message.loading(`正在保存文件`);
    var createdate = new Date();
    var approve=createdate.getFullYear().toString()+createdate.getMonth().toString();
    approve+=createdate.getDay().toString()+createdate.getHours().toString()+createdate.getMinutes().toString()
    approve+=createdate.getSeconds().toString()+createdate.getMilliseconds().toString();
    setTimeout(hide, 500);
    sp.web.currentUser.get().then(current_user => {
      console.log(current_user);

    var uid=current_user.Id;
    var ulgon=current_user.LoginName;
    console.log(uid);
    sp.web.lists.getByTitle(this.props.ApprovealListName).items.add({
         Title:this.state.itemTitle, //标题
         Content:this.state.itemContent,//正文
         TypeId:this.state.itemType,
         createTime:createdate,
         ApprovalState:"待审阅",
         ApproveID:parseInt(approve),
        // createUser:uid,
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
  * 根据id查询单条数据
  * 返回弹出层需要的数据
  */
  public getPage(itemId) {
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
  }
  /**
  * 已办查询
  */
  /**
  * 我的发起查询
  */
  /**
  * 页面渲染
  */
  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { visible1, visible, loading,data, Title } = this.state;
   console.log(data);
  
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

        <Modal
          width={800}
          visible={visible1}
          title='待审阅'
          centered
          onCancel={this.handleCancel}
          footer={null}
        >
          {/* <Table columns={this.columns} rowKey='ApproveID' dataSource={dataList} size='small' />   */}

          {/* <div>{dataList.ApproveID}</div> */}
          <table>
            <tbody id='items'>
              <tr>
                <td>标题:</td>
                <td>{Title}</td>
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
          width={580}
          style={{ marginBottom: 0 }}
          onClose={this.onClose}
          visible={this.state.visible}
        >
          <Form layout="vertical" >
            {/* <Row gutter={16}>
              <Col span={12}>
                <Form.Item label="单位">
                  <label ></label>
                </Form.Item>
              </Col>
              <Col span={12}>
                <Form.Item label="类型">

                  <Select placeholder="请选择类型"
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
                  
                  <input value={this.state.itemTitle}  onChange={this.handleChangeTitle}  className={styles.inputCWe}/>
                </Form.Item>
              </Col>
            </Row>

            <Row gutter={16}>
              <Col span={24}>
                <Form.Item label="内容">
                  <Input.TextArea rows={4} value={this.state.itemContent} onChange={this.handleChangeContent}     placeholder="请输入内容" className={styles.textalign} />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={8}>
              <Col span={24}>
                <Form.Item label="附件">
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

