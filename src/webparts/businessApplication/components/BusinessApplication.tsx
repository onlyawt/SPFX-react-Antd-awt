import * as React from 'react';
import styles from './BusinessApplication.module.scss';
import { IBusinessApplicationProps } from './IBusinessApplicationProps';
import 'antd/dist/antd.css';
import { Tabs, Button, Table, Menu, Drawer, message, Form, Radio, Col, Row, Input, Select, Steps, Upload, Divider, Icon, Modal, Popover, Spin } from 'antd';
import { sp, Items, AttachmentFileInfo } from '@pnp/sp';
import * as moment from 'moment';
import 'core-js/es6/array';
import "es6-map/implement";
import "core-js/modules/es6.array.find";
import { ApproveListItem } from './ApproveListItem';
import { IBusinessApplicationState } from './IBusinessApplicationState';
import { SPUser } from '@microsoft/sp-page-context';
import { escape, debounce } from '@microsoft/sp-lodash-subset';
import Search from 'antd/lib/input/Search';
const { TabPane } = Tabs;
export default class BusinessApplication extends React.Component<IBusinessApplicationProps, {}> {

  state = {
    loading: false,// 处理异步等待
    data: null,
    visible: false,// 添加抽屉状态
    visible1: false,
    Title: null,
    typeList: null, // 分类list
    selindex: 0,
    timeList: null,// 初始时间轴
    waitList:null,//待审批
    lineContent: null,// 初始化时间轴内容
    approveDiv: null,
    strusername: null,
    itemTitle: null,
    adata: null,
    menuKey:1,//切换页面
    validateStatus:null,// 表单状态
    help:null,// 表单校验文案
    validateStatus_1:null,// 表单状态
    help_1:null,// 表单校验文案
    itemContent: null, // 添加正文
    fileContent:null,// 归档意见
    backContent:null,// 退回意见
    processContent:null,// 处理意见
    itemType: null,// 添加类型
    processVisible: false,// 处理
    backVisible:false,// 退回
    fileVisible:false,// 归档
    CirculateVisible: false,// 传阅
    people_data: [],// 审阅搜索
    people_data_1:[],// 传阅搜索
    people_fetching: false,
    people_fetching_1: false,
    defaultFiletext: [],
    nameList: null,
    nameListView:[],
    status:"wait",
    iFNUM: 0,
    applicant: null,// 申请人姓名
    modalTitle: null,
    cButtonState:'inline-block', // 处理按钮状态
    tButtonState:'inline-block', // 退回按钮状态
    gButtonState:'inline-block', // 归档按钮状态
    ID:null, // 当前一条ID
    current:null,
    Cvalue:[],
    Svalue:[],
    upfile:[],
    inputDisplay:'none',
    searchContent:null,
  }

  private upload_file = [];// 上传附件

  columns = [
    {
      title: '标题',
      dataIndex: 'Title',
      key: 'Title',
      width: '75%',
      // sortOrder: 'ascend',
      // sortDirections: ['descend'],
      render: (text, row, index) =>
        <Popover placement='right' content={<div>
          <p>标题：{row.Title}</p>
          <p>申请人：{this.state.applicant}</p>
          <p>申请时间：{moment(row.createTime).format('YYYY-MM-DD HH:mm')}</p>
        </div>} >
          <a onClick={this.showModal.bind(this, row, index)} id='buttonck' className={styles.titlestyle} onMouseOver={this.approvlaContent.bind(this, row)}>
            {text}</a>
        </Popover>,
    },
    {
      title: '申请时间',
      dataIndex: 'createTime',
      key: 'createTime',
      sortDirections: ['ascend'],
      render: text => <span className={styles.titlestyle}>{moment(text).format('YYYY-MM-DD')}</span>,// TODO：日期格式化
    }
  ];

  /**
   * 获取人名
   */
  private async approvlaContent(ele) {
    let userName = null;
    let neme = await sp.web.getUserById(ele.createUserId).get()
    userName = neme.Title;
    this.setState(
      { applicant: userName }
    );
  }
  /**
   * 获取审阅下拉框的数据
   */
  public handleValue = (value) => {  
    console.log(value)
    this.setState({ 
      validateStatus_1:null,// 表单状态
      help_1:null,// 表单校验文案
      Svalue:value,
    }); 
    var userid:number =value.key;
    this.state.nameList=userid;
  }
  /**
   * 获取传阅下拉框的数据
   */
  public handleValueView = async (value) => {
    this.setState({
      Cvalue:value,
    })
    const usageView = value.map(value => ({
      id: value.key,
      Title: value.label,
    }));
    
    var k_1:number=usageView.length;
    let nameli=[];
    
    if(k_1!=0){
    for(var i=0;i<k_1;i++){
      if(usageView[i].Title.indexOf("CWE") != -1)
      {
        sp.web.lists.getByTitle('通讯录').items.filter("deptName eq '"+usageView[i].Title.substr(4)+"'").get().then(users => {
        users.map((user,index) => {
          if(user._x59d3__x540d_StringId!=null)
          {
          nameli.push(user._x59d3__x540d_StringId);
            }
         // nameli.push({user}.)
           });
      });
      }
     else
       {
       nameli.push(Number(usageView[i].id));
       }
    }
    }
    else{nameli=[]}
    console.log(nameli);
    this.state.nameListView=nameli;
  }
  /**
   * 添加页面
   */
  private onClose = () => {
    this.setState({
      visible: false,
      validateStatus:null,// 表单状态
      help:null,// 表单校验文案
      validateStatus_1:null,// 表单状态
      help_1:null,// 表单校验文案
      itemTitle:null,
      itemContent:null,
      itemType:null,
      Cvalue:[],
      Svalue:[],
      upfile:[],
});
  }
  /**
   * 显示弹出层(当前数据id)
   * 根据id查询一条数据
   */
  private showModal = async (row, index) => {
    this.approvlaContent(row);
    this.state.people_data.splice(0);
    this.state.defaultFiletext.splice(0);
    this.timeLine(row.ApproveID);
    this.waitLine(row);
    await this.getFile(row.Id);
    this.setState({
      ID: row.ID,
      selindex: index,
      visible1: true,
      fileContent:null,// 归档意见
      backContent:null,// 退回意见
      processContent:null,// 处理意见
      nameList: null,// 审阅人
      nameListView:[],// 传阅人
    });
    if(this.state.menuKey == 3){
      if(row.ApprovalUserId != null){
        this.setState({
          cButtonState:'inline-block', // 处理按钮状态
          tButtonState:'none', // 退回按钮状态
          gButtonState:'inline-block', // 归档按钮状态  
            });
      }
      else {
        this.setState({
          cButtonState:'none', // 处理按钮状态
          tButtonState:'none', // 退回按钮状态
          gButtonState:'none', // 归档按钮状态      
        })
      }
    }
  }
  /**
   * 审阅人员选取组件
   */
  private last_fetch_id;
  private last_fetch_id_1;

  private fetchUser = value => {
    this.last_fetch_id += 1;
    const fetch_id = this.last_fetch_id;
    this.setState({ people_data: [], people_fetching: true });
    sp.web.siteUsers.filter("substringof('" + value + "',Title) or substringof('" + value + "',LoginName)").get().then(users => {
      if (fetch_id !== this.last_fetch_id) {
        return;
      }
      console.log(users);
      var a_test=/[0-9a-z]/i;
      users=users.filter(function(elem){
        if(a_test.test(elem.Title)){return false}
        else{
        return (elem.Title.indexOf("管理员")==-1);}
      }
      )
      console.log(users);
      const people_data1 = users.map(user => ({
        text: user.Title,
        value: user.Id,
      }));
      this.setState({ people_data: people_data1, people_fetching: false });
    });
  };
  //  传阅
   private fetchUser_1 = value => {
    console.log(123);
    console.log(value);
    // this.last_fetch_id_1 += 1;
    // const fetch_id = this.last_fetch_id_1;
    this.setState({ people_data_1: [], people_fetching_1: true });
    sp.web.siteUsers.filter("substringof('" + value + "',Title) or substringof('" + value + "',LoginName)").get().then(users => {
      console.log(users)
      /* if (fetch_id !== this.last_fetch_id_1) {
        return;
      } */
       var a_test=/[0-9a-z]/i;
      users=users.filter(function(elem){
        if(a_test.test(elem.Title)){return (elem.Title.indexOf('CWE')!=-1)}
        else{
        return (elem.Title.indexOf("管理员")==-1);}
      }
      ) 
      console.log(users);
      const people_data1 = users.map(user => ({
        text: user.Title,
        value: user.Id,
      }));

      this.setState({ people_data_1:people_data1, people_fetching_1: false });
    });
  };
  /**
   * 获取附件
   */
  uploadOnChange = (info) => {
    this.setState({
      upfile:info.fileList
    })
    this.upload_file=[];
      for(var i=0;i<info.fileList.length;i++){
      this.upload_file.push(info.fileList[i]);
      }
    if (info.file.status !== 'uploading') {
    }
    if (info.file.status === 'done') {     
      message.success(`${info.file.name} 上传成功`);
    } else if (info.file.status === 'error') {
      message.error(`${info.file.name} file upload failed.`);
    }
  }
  //添加附件
  public fileAdd(itemid) {
    const list = sp.web.lists.getByTitle(this.props.ApprovealListName);
    let fileInfos: AttachmentFileInfo[] = [];
    
    for (var i = 0; i < this.upload_file.length; i++) {
      fileInfos.push({
        name: this.upload_file[i].name,
        content: this.upload_file[i].originFileObj,
      });
    }
    console.log(fileInfos)
    list.items.getById(itemid).attachmentFiles.addMultiple(fileInfos).then(r => {
      console.log(r)
    });
  }
  //显示附件
  private async getFile(fileId) {

    let item = sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(fileId);

    // get all the attachments
    let fileName = await item.attachmentFiles.get()
    //console.log('http://bjweb/_layouts/15/WopiFrame.aspx?sourcedoc='+fileName[1].ServerRelativeUrl);  
    console.log(fileName);  
    console.log(sp.site.toUrl) 
    let url = await sp.web.get()
    for (let key in fileName) {
      let filename = fileName[key].FileName;
      let suffix = filename.substring(filename.lastIndexOf(".") + 1);
      if(suffix == 'doc' || suffix == 'docx' || suffix == 'xls' || suffix=='xlsx' || suffix=='ppt' || suffix=='pptx'){
        let url1=url.Url
        this.state.defaultFiletext.push({
          uid: this.state.iFNUM,
          name: fileName[key].FileName,
          status: 'done',
          response: 'Server Error 500',
          url:url1+'/_layouts/15/WopiFrame.aspx?sourcedoc='+fileName[key].ServerRelativeUrl,
        });  
      }
      else {
        this.state.defaultFiletext.push({
          uid: this.state.iFNUM,
          name: fileName[key].FileName,
          status: 'done',
          response: 'Server Error 500',
          url:fileName[key].ServerRelativeUrl,
        });  
      }
      this.state.iFNUM--;
    }
    
  }
  //处理窗口正文
  public processChangeContent = (event) => {
    this.setState({ processContent:event.target.value });
  }
  /**
   * 处理确定按钮
   */
  public processOk = async (itemid) => {
    if(this.state.nameList!=null){
      let pushUsersId = [];
      let current = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).get();
      pushUsersId = current.ApprovalUsersId;
      let createUser = await sp.web.currentUser.get();// 当前操作人
      //let creatUserid = current.creatUserId;// 申请人
      //console.log(creatUserid)
      let appId = current.ApproveID;
      pushUsersId.push(createUser.Id);
      await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).update({
        ApprovalUserId:this.state.nameList,
        ApprovalUsersId: {
          results: pushUsersId,
        },
      });
    this.setState({
      loading: true
    });
    setTimeout(async () => {
      await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
        Title: '审批意见',
        Content: this.state.processContent,
        ApproveID: appId,
        ApprovalState: '处理',
        ItemId: appId.toString(),
        CreateUserId: createUser.Id,
      }); 
      message.success(`已处理`);
      this.fileAdd(itemid);
      this.setState({
        loading: false,
        processVisible: false,
        visible1: false,
      });
    }, 500);
    this.getPageList(this.state.menuKey);
    this.state.waitList=[];
    this.setState({
      Svalue:[],
      upfile:[],  
    })
    }
    else{
      let pushUsersId = [];
      let current = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).get();
      pushUsersId = current.ApprovalUsersId;
      let createUser = await sp.web.currentUser.get();// 当前操作人
      let creatUserid = current.creatUserId;// 申请人
      //console.log(creatUserid)
      let appId = current.ApproveID;
      pushUsersId.push(createUser.Id);
      await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).update({
        ApprovalUserId:creatUserid,
        ApprovalUsersId: {
          results: pushUsersId,
        },
      });
      this.setState({
        loading: true
      });
      setTimeout(async () => {
        await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
          Title: '审批意见',
          Content: this.state.processContent,
          ApproveID: appId,
          ApprovalState: '处理',
          ItemId: appId.toString(),
          CreateUserId: createUser.Id,
        }); 
        message.success(`已处理`);
        this.fileAdd(itemid);
        this.setState({
          loading: false,
          processVisible: false,
          visible1: false,
        });
      }, 500);
      this.getPageList(this.state.menuKey);
      this.state.waitList=[];
      this.setState({
        Svalue:[],
        upfile:[],  
      })  
    }
  }
  /**
   * 处理取消按钮
   */

  public processCancel = () => {
    this.setState({ 
      processVisible: false,
      Svalue:[],
      processContent:null,
     });
  }
  //退回窗口正文
  public backChangeContent = (event) => {
    this.setState({ backContent:event.target.value });
  }
  /**
   * 退回确定按钮
   */
  public backOk = async (itemid) => {
    let pushUsersId = [];
    let current = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).get();
    pushUsersId = current.ApprovalUsersId;
    let createUser = await sp.web.currentUser.get();// 当前操作人
    let creatUserid = current.createUserId;// 申请人
    let appId = current.ApproveID;
    pushUsersId.push(createUser.Id);
    await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).update({
      ApprovalUserId:creatUserid,
      ApprovalUsersId: {
        results: pushUsersId,
      },
    });
    console.log(pushUsersId);
    this.setState({
      loading: true
    });
    setTimeout(async () => {
      await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
        Title: '审批意见',
        Content: this.state.backContent,
        ApproveID: appId,
        ApprovalState: '退回',
        ItemId: appId.toString(),
        CreateUserId: createUser.Id,
      }); 
      message.success(`已退回`);
      this.setState({
        loading: false,
        backVisible: false,
        visible1: false,
      });
    }, 500);
    this.getPageList(this.state.menuKey);
    this.state.waitList=[];
  }
  /**
   * 退回取消按钮
   */

  public backCancel = () => {
    this.setState({ 
      backVisible: false,
      backContent:null,
     });
  }
  //归档窗口正文
  public fileChangeContent = (event) => {
    this.setState({ fileContent:event.target.value });
  }
  /**
   * 归档确定按钮
   */
  public fileOk = async (itemid) => {
    let pushUsersId = [];
    let current = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).get();
    pushUsersId = current.ApprovalUsersId;
    let createUser = await sp.web.currentUser.get();
    let appId = current.ApproveID;
    pushUsersId.push(createUser.Id);
    await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).update({
      ApprovalUserId:null,
      ApprovalState:'已结束',
      ApprovalUsersId: {
        results: pushUsersId,
      },
    });
    console.log(pushUsersId);
    this.setState({
      loading: true
    });
    setTimeout(async () => {
      await sp.web.lists.getByTitle(this.props.ApprovealRecordListName).items.add({
        Title: '审批意见',
        Content: this.state.fileContent,
        ApproveID: appId,
        ApprovalState: '结束',
        ItemId: appId.toString(),
        CreateUserId: createUser.Id,
      }); 
      message.success(`已归档`);
      this.setState({
        loading: false,
        fileVisible: false,
        visible1: false,
      });
    }, 500);
    
    console.log(this.state.menuKey)
    this.getPageList(this.state.menuKey);
    this.state.waitList=[];
  }
  /**
   * 归档取消按钮
   */

  public fileCancel = () => {
    this.setState({ 
      fileVisible: false,
      fileContent: null,
     });
  }
  /**
   * 传阅确定按钮
   */
  public CirculateOk = async (itemid) => {
    console.log(itemid);
    //let createUser =await sp.web.currentUser.get()
    let currentUser = await sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).get();
    let CUserId = currentUser.CCUserId;
    for(var i=0;i<this.state.nameListView.length;i++){
      CUserId.push(this.state.nameListView[i])
    }
    console.log(this.state.nameListView)
    //CUserId.push(createUser.Id)
    console.log(CUserId)
    sp.web.lists.getByTitle(this.props.ApprovealListName).items.getById(itemid).update({
      CCUserId: {
        results: CUserId,
      },
    }).then(console.log);
    setTimeout(() => {
    this.setState({
      CirculateVisible: false,
      Cvalue:[],
    });
    message.success('传阅成功');
  }, 500);
    
  }
  /**
   * 传阅取消按钮
   */

  public CirculateCancel = () => {
    this.setState({ 
      CirculateVisible: false,
      Cvalue:[],
     });
  }
  /**
   * 弹出页面关闭
   */
  public pageCancel = () => {
    this.setState({
      visible1: false,
      upfile:[],
    });
    this.state.waitList=[];
    //this.state.status="wait"

  }
  /**
   * 处理按钮
   */
  public handleOk = (e) => {
    this.setState({
      processVisible: true,
    });
  }
  /**
   * 退回按钮
   */
  public handleCancel = () => {
    this.setState({
      backVisible: true
    });
  }
  /**
   * 归档按钮
   */
  public File = () => {
    this.setState({
      fileVisible: true
    });
  }
  /**
   * 传阅按钮
   */
  public Circulate = () => {

    this.setState({
      CirculateVisible: true
    });
  };

  constructor(props) {
    super(props);
    this.getPageList(props);
    //this.getApprove(props);
    this.handleChangeTitle = this.handleChangeTitle.bind(this);
    this.handleChangeContent = this.handleChangeContent.bind(this);
    this.handleChangetype = this.handleChangetype.bind(this);
    this.last_fetch_id = 0;
    this.fetchUser = debounce(this.fetchUser, 500);
  }
  
  public searchText = (event) => {
    console.log(event)
    this.setState({
      searchContent:event.target.value,
    })
  }

  //添加窗口标题
  async handleChangeTitle(event) {
    if(event.target.value!=''){
    await this.setState({ 
      itemTitle: event.target.value,
      validateStatus:null,// 表单状态
      help:null,// 表单校验文案
    });
    }
    else{
    await this.setState({ 
      itemTitle: null,
      validateStatus:null,// 表单状态
      help:null,// 表单校验文案
      });
    }
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
    this.state.people_data = []
    this.setState({
      itemType: '默认',
      visible: true
    });
    // this.getType();
  }

  //




  //添加Item数据
  public itemAdd() {
    if(this.state.itemTitle==null){
      this.setState({
        validateStatus:'error',
        help:'标题不可为空',
      });
      message.error(`保存失败`);
      return false;    
    }
    else if(this.state.nameList==null)
    {
      this.setState({
        validateStatus_1:'error',
        help_1:'审批人不可为空',
      });
      message.error(`保存失败`);
      return false;   
    }
    else{
    const hide = message.loading(`正在保存文件`);
    var createdate = new Date();
    var approve = createdate.getFullYear().toString() + createdate.getMonth().toString();
    approve += createdate.getDay().toString() + createdate.getHours().toString() + createdate.getMinutes().toString()
    approve += createdate.getSeconds().toString() + createdate.getMilliseconds().toString();
    setTimeout(hide, 500);
    console.log(this.state.nameListView)

    if(this.state.nameListView.length!=0){
    sp.web.currentUser.get().then(current_user => {
      /* var uid = current_user.Id;
      var ulgon = current_user.LoginName;     */  
      sp.web.lists.getByTitle(this.props.ApprovealListName).items.add({
        Title: this.state.itemTitle, //标题
        Content: this.state.itemContent,//正文
        TypeId: this.state.itemType,
        createTime: createdate,
        ApprovalState: "待审阅",
        ApproveID: parseInt(approve),
        createUserId: current_user.Id,
        ApprovalUserId:this.state.nameList,
        CCUserId:{
          results:this.state.nameListView
        }, 
      }).then(result => {
        result.item.select('id').get().then(d => {

          console.log(d)
          this.fileAdd(d.Id);
          message.success(`保存成功`);
          this.setState({
            validateStatus:null,// 表单状态
            help:null,// 表单校验文案
            validateStatus_1:null,// 表单状态
            help_1:null,// 表单校验文案
            visible: false,
            itemTitle:null,
            itemContent:null,
            itemType:null,
            Cvalue:[],
            Svalue:[],
            upfile:[], 
          });
          this.upload_file = [];
          //this.state.nameList=[]
        });
      }).catch(e => {
        message.error(`保存失败`);
      });
    });}
    else{
      sp.web.currentUser.get().then(current_user => {
        /* var uid = current_user.Id;
        var ulgon = current_user.LoginName;     */  
        sp.web.lists.getByTitle(this.props.ApprovealListName).items.add({
          Title: this.state.itemTitle, //标题
          Content: this.state.itemContent,//正文
          TypeId: this.state.itemType,
          createTime: createdate,
          ApprovalState: "待审阅",
          ApproveID: parseInt(approve),
          createUserId: current_user.Id,
          ApprovalUserId:this.state.nameList,
          /* CCUserId:{
            results:this.state.nameListView
            results:null
          },  */
        }).then(result => {
          result.item.select('id').get().then(d => {
  
            console.log(d)
            this.fileAdd(d.Id);
            message.success(`保存成功`);
            this.setState({
              validateStatus:null,// 表单状态
              help:null,// 表单校验文案
              validateStatus_1:null,// 表单状态
              help_1:null,// 表单校验文案
              visible: false,
              itemTitle:null,
              itemContent:null,
              itemType:null,
              Cvalue:[],
              Svalue:[],
              upfile:[], 
              });
            this.upload_file = [];
            //this.state.nameList=[]
          });
        }).catch(e => {
          message.error(`保存失败`);
        });
      });
    }
  }
  }
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
  private getPageList(element) {
    let pageKey=element
    this.setState({
      selindex: 0,
      modalTitle: '待办',
      cButtonState:'inline-block', // 处理按钮状态
      tButtonState:'inline-block', // 退回按钮状态
      gButtonState:'inline-block', // 归档按钮状态  
      inputDisplay:'none',
      menuKey:pageKey,
      Svalue:[],
      current:null,
    });
    let Approval = null;
    sp.web.currentUser.get().then(current_user => {
      if (pageKey == 1) {
        Approval = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      else if (pageKey == 2) {
        Approval = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter('ApprovalUsersId eq ' + current_user.Id).orderBy('createTime', false).get();
        this.setState({
          modalTitle: '已办',
          cButtonState:'none', // 处理按钮状态
          tButtonState:'none', // 退回按钮状态
          gButtonState:'none', // 归档按钮状态      
        });
      }
      else if (pageKey == 3) {
        Approval = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter('createUserId eq ' + current_user.Id).orderBy('createTime', false).get();
        this.setState({
          modalTitle: '我的发起',
        });
      }
      else {
        Approval = sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter('ApprovalUserId eq ' + current_user.Id).orderBy('createTime', false).get();
      }
      Approval.then(items => {
        if (items.length > 0) {
          this.setState({
            data: items
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
    sp.web.lists.getByTitle(this.props.ApprovealListName).items.filter('ApproveID eq ' + itemId).getAll().then(items => {
      if (items.length > 0) {
        options[0] = items[0]['Title'];
        this.setState({
          Title: options
        });
      }
    });
  }
  /**
   * 处理多行文本
   * 
   */
  public optimizingData(strDate): string {
    if(strDate!=null){
    var msg = strDate.replace(/<\/?[^>]*>/g, ''); //去除HTML Tag
    msg = msg.replace(/[|]*\n/, '') //去除行尾空格
    msg = msg.replace(/&npsp;/ig, ''); //去掉npsp    
    return msg;
  }
  else{
    return null;
  }
  }
  /**
   * 审阅信息查询
   * 'ReadUsersId eq ' + currentUser.Id
   */
  /* private getApprove(element) {
    let ccuser = null;
    sp.web.currentUser.get().then(currentUser => {
      if (element.key == 1) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      else if (element.key == 2) {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} eq ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      else {
        ccuser = sp.web.lists.getByTitle('审批').items.filter(`${'ReadUsersId'} ne ${currentUser.Id} and ${'CCUserId'} eq ${currentUser.Id}`).orderBy('createTime', false).get();
      }
      ccuser.then(Items => {
        if (Items.length > 0) {
          this.setState({
            adata: Items
          });
        }
        else {
          this.setState({
            adata: null
          });
        }
      })
    });
  } */
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
            Line.push(<Steps.Step icon={<Icon type="check-circle" />} status="finish" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
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
            Line.push(<Steps.Step icon={<Icon type="check-circle" />} status="finish" title={'处理人：' + strname + '[' + moment(Items[index]['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
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
    Linewait.push(<Steps.Step icon={<Icon type="history"/>} status="finish"  title={'当前处理人：' + strname + '[' + moment(waitText['CreateTime']).format('YYYY-MM-DD  HH:mm') + ']'}
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
  public getsearch = async () =>{
    let name = await sp.web.currentUser.get();
    let username = name.Id;
      this.setState({
        modalTitle: '查询',
        inputDisplay:'inline-block',
        data:null,
        selindex: 0,
        cButtonState:'none', // 处理按钮状态
        tButtonState:'none', // 退回按钮状态
        gButtonState:'none', // 归档按钮状态      
      });
      let camlquery={
        ViewXml:`<View><Query>
        <Where>
        <Or><Or>
        <Includes><FieldRef Name='ApprovalUsers' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes>
        <Includes><FieldRef Name='CCUser' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes></Or>
        <Eq><FieldRef Name='ApprovalUser' LookupId='True'/><Value Type='User'>${username}</Value></Eq>
        </Or>
        </Where>
        <OrderBy>
        <FieldRef Name='createTime' Ascending='False' />
        </OrderBy>
        </Query></View>`
        }
        sp.web.lists.getByTitle(this.props.ApprovealListName).getItemsByCAMLQuery(camlquery).then(items=>{    
          if(items.length == 0 ){
            this.setState({
              data:null
            })
          }
          else{
            this.setState({
              data:items,
              Svalue:[],
              searchContent:null,
              nameList:null,
            })
          }
        });
}

  public  async  searchValue(){
    let name = await sp.web.currentUser.get();
    let username = name.Id;
    if(this.state.Svalue.length != 0){
      if(this.state.searchContent == null){
        let camlquery={
          ViewXml:`<View><Query>
          <Where>
          <And>
          <Or><Or>
          <Includes><FieldRef Name='ApprovalUsers' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes>
          <Includes><FieldRef Name='CCUser' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes></Or>
          <Eq><FieldRef Name='ApprovalUser' LookupId='True'/><Value Type='User'>${username}</Value></Eq>
          </Or>
          <Eq><FieldRef Name='createUser' LookupId='True'/><Value Type='User'>${this.state.nameList}</Value></Eq>
          </And>
          </Where>
          <OrderBy>
          <FieldRef Name='createTime' Ascending='False' />
          </OrderBy>
          </Query></View>`
        }
        sp.web.lists.getByTitle(this.props.ApprovealListName).getItemsByCAMLQuery(camlquery).then(items=>{
           if(items.length == 0){
             this.setState({
               data:null
             })
           }
           else{
          this.setState({
            data:items,
            Svalue:[],
          })
        }
        })
      }
      else{
        let camlquery={
          ViewXml:` <View><Query>         
          <Where>
          <And>
          <And>
          <Or><Or>
          <Includes><FieldRef Name='ApprovalUsers' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes>
          <Includes><FieldRef Name='CCUser' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes></Or>
          <Eq><FieldRef Name='ApprovalUser' LookupId='True'/><Value Type='User'>${username}</Value></Eq>
          </Or>
          <Eq><FieldRef Name='createUser' LookupId='True'/><Value Type='User'>${this.state.nameList}</Value></Eq>
          </And>
          <Or>
          <Contains><FieldRef Name='Title' /><Value Type='Text'>${this.state.searchContent}</Value></Contains>
          <Contains><FieldRef Name='Content' /><Value Type='Text'>${this.state.searchContent}</Value></Contains>
          </Or>
          </And>
          </Where>
          <OrderBy>
          <FieldRef Name='createTime' Ascending='False' />
          </OrderBy>
          </Query></View>
          `
        }
        sp.web.lists.getByTitle(this.props.ApprovealListName).getItemsByCAMLQuery(camlquery).then(items=>{    
          if(items.length == 0 ){
            this.setState({
              data:null
            })
          }
          else{
            this.setState({
              data:items,
              Svalue:[],
              searchContent:null,
              nameList:null,
            })
          }
        });
      }
    }
    else{
      if(this.state.searchContent != null){
        let camlquery={
          ViewXml:`<View><Query>
          <Where>
          <And>
          <Or><Or>
          <Includes><FieldRef Name='ApprovalUsers' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes>
          <Includes><FieldRef Name='CCUser' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes></Or>
          <Eq><FieldRef Name='ApprovalUser' LookupId='True'/><Value Type='User'>${username}</Value></Eq>
          </Or>
          <Or>
          <Contains><FieldRef Name='Title' /><Value Type='Text'>${this.state.searchContent}</Value></Contains>
          <Contains><FieldRef Name='Content' /><Value Type='Text'>${this.state.searchContent}</Value></Contains>
          </Or>
          </And>
          </Where>
          <OrderBy>
          <FieldRef Name='createTime' Ascending='False' />
          </OrderBy>
          </Query></View>`
          }
          sp.web.lists.getByTitle(this.props.ApprovealListName).getItemsByCAMLQuery(camlquery).then(items=>{    
            if(items.length == 0 ){
              this.setState({
                data:null
              })
            }
            else{
              this.setState({
                data:items,
                Svalue:[],
                searchContent:null,
                nameList:null,
              })
            }
          });
      }
      else{
        let camlquery={
          ViewXml:`<View><Query>
          <Where>
          <Or><Or>
          <Includes><FieldRef Name='ApprovalUsers' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes>
          <Includes><FieldRef Name='CCUser' LookupId='True'/><Value Type='UserMulti'>${username}</Value></Includes></Or>
          <Eq><FieldRef Name='ApprovalUser' LookupId='True'/><Value Type='User'>${username}</Value></Eq>
          </Or>
          </Where>
          <OrderBy>
          <FieldRef Name='createTime' Ascending='False' />
          </OrderBy>
          </Query></View>`
          }
          sp.web.lists.getByTitle(this.props.ApprovealListName).getItemsByCAMLQuery(camlquery).then(items=>{    
            if(items.length == 0 ){
              this.setState({
                data:null
              })
            }
            else{
              this.setState({
                data:items,
                Svalue:[],
                searchContent:null,
                nameList:null,
              })
            }
          });
      }
    }
  }

  public render(): React.ReactElement<IBusinessApplicationProps> {
    const { visible1, visible, loading, data, Title, lineContent, approveDiv, adata } = this.state;
    //console.log(data);
    return (

      <div className={styles.businessApplication}>
        
          <Menu mode='horizontal' defaultSelectedKeys={['1']} >
            <Menu.Item key='1' onClick={this.getPageList.bind(this,1)}>待办</Menu.Item>
            <Menu.Item key='2' onClick={this.getPageList.bind(this,2)}>已办</Menu.Item>
            <Menu.Item key='3' onClick={this.getPageList.bind(this,3)}>我的</Menu.Item>
            <Menu.Item key='4' onClick={this.getsearch}>查询</Menu.Item>
            <Button onClick={this.createItem.bind(this)} className={styles.applyb}>申请</Button>
          </Menu>
          <div>
            <div style={{display:this.state.inputDisplay,width:'100%'}} >
            <Select
                  showSearch={true}
                  labelInValue
                  placeholder="搜索申请人"
                  notFoundContent={this.state.people_fetching ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchUser}
                  onChange={this.handleValue}
                  style={{ width: '40%' }}
                  value={this.state.Svalue}
                >
                  {this.state.people_data.map(t => (
                    <Select.Option key={t.value}>{t.text}</Select.Option>
                  ))}
                </Select>
                <Input.TextArea rows={1} 
                autosize={{ minRows: 1, maxRows: 1 }}
                value={this.state.searchContent} 
                onChange={this.searchText} 
                placeholder="请输入标题或内容"  
                style={{ width:'46%',marginLeft:'2%',marginRight:'2%' }}/>
          <Button  icon='search' type='primary' onClick={this.searchValue.bind(this)}/>
            </div>
            <Table columns={this.columns} rowClassName={() => styles.colheight} rowKey='ApproveID' dataSource={data} size='small' pagination={{ pageSize: 10 ,current:this.state.current,onChange:(page)=>{this.setState({current:page,});},}} />
          </div>

          {/* 显示数据和进度 */}
          <Modal
            width={800}
            visible={visible1}
            title={this.state.modalTitle}
            centered
            onCancel={this.pageCancel}
            footer={null}
          >
            <Row gutter={24}>
              {/* <Table columns={this.columns} rowKey='ApproveID' dataSource={dataList} size='small' />   */}

              {/* <div>{dataList.ApproveID}</div> */}

              <Col xs={24} lg={13} >
                <span style={{ fontSize: '20px' }}>审批信息</span>
                <Button style={{ float: 'right' }} key='Circulate' type='primary' onClick={this.Circulate}>
                  传阅
          </Button>
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
                        <Upload showUploadList={{showRemoveIcon: false}} defaultFileList={this.state.defaultFiletext? this.state.defaultFiletext:null}>
                        </Upload>
                      </td>
                    </tr>
                    <tr >
                      <td>附件上传</td>
                      <td>
                        <Upload onChange={this.uploadOnChange} fileList={this.state.upfile}>
                          <Button size="small">
                            <Icon type="upload" /> 上传附件
                          </Button>
                        </Upload>
                      </td>
                    </tr>
                  </tbody>
                </table>

                <Button style={{ marginLeft: '18%',display:this.state.cButtonState}} key='submit' type='primary' onClick={this.handleOk}>
                  处理
          </Button>
                <Button style={{ marginLeft: '10px' ,display:this.state.tButtonState}} key='back' type='danger' onClick={this.handleCancel}>
                  退回
          </Button>
                <Button style={{ marginLeft: '10px' ,display:this.state.gButtonState}} key='File' onClick={this.File}>
                  归档
          </Button>

              </Col>
              <Col xs={24} lg={11}>
                <Steps direction="vertical" style={{ marginTop: '10px' }} size='small' /* progressDot={customDot} */>
                  <Steps.Step status="finish"  icon={<Icon type="user" />} title={'申请人：' + (this.state.applicant ? this.state.applicant : '没有数据！') + '[' + (data ? moment(data[this.state.selindex].createTime).format('YYYY-MM-DD  HH:mm') : '没有数据！') + ']'} />
                  {this.state.timeList}
                  {this.state.waitList}
                  {/* <Steps.Step style={{}} status={'wait'} icon={<Icon type="check-circle" />} title='未结束'/> */}

                </Steps>
              </Col>
              {/* 处理模态框 */}
              <Modal
                title="处理"
                visible={this.state.processVisible}
                centered
                footer={null}
                onCancel={this.processCancel}
              >
                <div>
                转发：
                <Select
                          showSearch={true}
                          labelInValue
                          placeholder="请选择审阅人"
                          notFoundContent={this.state.people_fetching ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.fetchUser}
                          onChange={this.handleValue}
                          style={{ width: '100%'  ,marginBottom:'20px'}}
                          value={this.state.Svalue}
                        >
                          {this.state.people_data.map(d => (
                            <Select.Option key={d.value}>{d.text}</Select.Option>
                          ))}
                        </Select>
                意见：
                  <Input.TextArea
                    value={this.state.processContent}
                    onChange={this.processChangeContent}
                    placeholder="同意"
                    autosize={{ minRows: 2, maxRows: 6 }}
                    style={{marginBottom:'20px'}}
                  />
                </div>
                <Button style={{ marginLeft: '150px' }} key='submit' type='primary' loading={loading} onClick={this.processOk.bind(this,this.state.ID)}>
                  同意
          </Button>
                <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.processCancel}>
                  取消
          </Button>
              </Modal>
              {/* 退回模态框 */}
              <Modal
                title="退回"
                visible={this.state.backVisible}
                centered
                footer={null}
                onCancel={this.backCancel}
              >
                <div>
                  意见：
                  <Input.TextArea
                    value={this.state.backContent}
                    onChange={this.backChangeContent}
                    placeholder="退回"
                    autosize={{ minRows: 2, maxRows: 6 }}
                    style={{marginBottom:'20px'}}
                  />
                </div>
                <Button style={{ marginLeft: '150px' }} key='submit' type='primary' loading={loading} onClick={this.backOk.bind(this,this.state.ID)}>
                  确认
          </Button>
                <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.backCancel}>
                  取消
          </Button>
              </Modal>
              {/* 归档模态框 */}
              <Modal
                title="归档"
                visible={this.state.fileVisible}
                centered
                footer={null}
                onCancel={this.fileCancel}
              >
                <div>
                  意见：
                  <Input.TextArea
                    value={this.state.fileContent}
                    onChange={this.fileChangeContent}
                    placeholder="结束"
                    autosize={{ minRows: 2, maxRows: 6 }}
                    style={{marginBottom:'20px'}}
                  />
                </div>
                <Button style={{ marginLeft: '150px' }} key='submit' type='primary' loading={loading} onClick={this.fileOk.bind(this,this.state.ID)}>
                  确认
          </Button>
                <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.fileCancel}>
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
                <Select
                  mode="multiple"
                  labelInValue
                  placeholder="选择需要传阅的人"
                  notFoundContent={this.state.people_fetching_1 ? <Spin size="small" /> : null}
                  filterOption={false}
                  onSearch={this.fetchUser_1}
                  onChange={this.handleValueView}
                  style={{ width: '100%' ,marginBottom:'20px'}}
                  value={this.state.Cvalue}
                >
                  {this.state.people_data_1.map(t => (
                    <Select.Option key={t.value}>{t.text}</Select.Option>
                  ))}
                </Select>
                <Button style={{ marginLeft: '150px' }} key='submit' type='primary' onClick={this.CirculateOk.bind(this,this.state.ID)}>
                  确认
          </Button>
                <Button style={{ marginLeft: '15px' }} key='back' type='danger' onClick={this.CirculateCancel}>
                  取消
          </Button>
              </Modal>

            </Row>
          </Modal>

          <Drawer
            title='提交业务申请'
            width={'50%'}
            style={{ marginBottom: 0 }}
            onClose={this.onClose}
            visible={this.state.visible}
          >
            <Form layout='vertical' >
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="类型"  >
                    <Radio.Group defaultValue="默认" buttonStyle="solid" value={this.state.itemType} onChange={this.handleChangetype} >
                      <Radio.Button value="默认">默认</Radio.Button>
                      <Radio.Button value="IT服务申请">IT服务申请</Radio.Button>
                      <Radio.Button value="其他">其他</Radio.Button>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="标题"  validateStatus={this.state.validateStatus} help={this.state.help}>
                    {/* <input className={styles.antinput} value={this.state.itemTitle} onChange={this.handleChangeTitle} /> */}
                    <Input.TextArea rows={1} value={this.state.itemTitle} autosize={{ minRows: 1, maxRows: 1 }}  onChange={this.handleChangeTitle} placeholder="请输入标题" className={styles.textalign} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item label="内容">
                    <Input.TextArea rows={2} value={this.state.itemContent} onChange={this.handleChangeContent} placeholder="请输入内容" className={styles.textalign} />
                  </Form.Item>
                </Col>
              </Row>
              <Row gutter={8}>
                <Col span={24}>
                  <Form.Item label='附件'>
                    <Upload.Dragger onChange={this.uploadOnChange} multiple={true} fileList={this.state.upfile}>
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
                  <Form.Item label="审阅" validateStatus={this.state.validateStatus_1} help={this.state.help_1}>
                    <Tabs defaultActiveKey="1">
                      <TabPane tab="审阅" key="1">
                        <Select
                          showSearch={true}
                          labelInValue
                          placeholder="请选择审阅人"
                          notFoundContent={this.state.people_fetching ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.fetchUser}
                          onChange={this.handleValue}
                          style={{ width: '100%' }}
                          value={this.state.Svalue}
                        >
                          {this.state.people_data.map(d => (
                            <Select.Option key={d.value}>{d.text}</Select.Option>
                          ))}
                        </Select>
                      </TabPane>
                      <TabPane tab="传阅" key="2">
                        <Select
                          mode="multiple"
                          labelInValue
                          placeholder="请选择传阅人"
                          notFoundContent={this.state.people_fetching_1 ? <Spin size="small" /> : null}
                          filterOption={false}
                          onSearch={this.fetchUser_1}
                          onChange={this.handleValueView}
                          style={{ width: '100%' }}
                          value={this.state.Cvalue}
                        >
                          {this.state.people_data_1.map(d => (
                            <Select.Option key={d.value}>{d.text}</Select.Option>
                          ))}
                        </Select>
                      </TabPane>
                    </Tabs>
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

        
        {/* <div className={styles.tablewid}>
          <Menu mode='horizontal' defaultSelectedKeys={['1']} >
            <Menu.Item key='1' onClick={this.getApprove.bind(this)}>待阅</Menu.Item>
            <Menu.Item key='2' onClick={this.getApprove.bind(this)}>已阅</Menu.Item>
          </Menu>
          <Table columns={this.columns} rowClassName={() => styles.colheight} rowKey='ApproveID' dataSource={adata} size='small' pagination={{ pageSize: 5 }} />
        </div> */}
      </div>
    );
  }
}
