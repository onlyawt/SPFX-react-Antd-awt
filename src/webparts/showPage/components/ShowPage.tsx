import * as React from 'react';
import styles from './ShowPage.module.scss';
import { IShowPageProps } from './IShowPageProps';
import { escape } from '@microsoft/sp-lodash-subset';
import 'antd/dist/antd.css';
import { Upload, message, Button, Icon } from 'antd';
import { sp,AttachmentFileInfo } from '@pnp/sp';
// import { ConsoleListener, Web, Logger, LogLevel, ODataRaw } from "@pnp/sp";
// import { auth } from "./auth";
export default class ShowPage extends React.Component < IShowPageProps, {} > {
   //declare var require: (s: string) => any;
   state = {

   }

  //let $ = require("jquery");
    
  constructor(props) {
    super(props);
   
    //this.getApprove(props);
    this.fileAdd = this.fileAdd.bind(this);
   
   
  }

  private upload_file = [];// 上传附件
  uploadOnChange = (info) => {
    console.log(info)
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
  public fileAdd=()=> {
    // const list = sp.web.lists.getByTitle(this.props.ApprovealListName);
    let fileInfos: AttachmentFileInfo[] = [];
    
    for (var i = 0; i < this.upload_file.length; i++) {
      fileInfos.push({
        name: this.upload_file[i].name,
        content: this.upload_file[i].originFileObj,
      });
    }
    console.log(fileInfos)
    sp.web.getFolderByServerRelativeUrl("/yfTest_1/a/").files.addChunked(this.upload_file[0].name,this.upload_file[0].originFileObj, data => {

    }, true).then();
  }
  public render(): React.ReactElement<IShowPageProps> {
    
    return(
      <div className = {styles.showPage} >
            <div> <Upload.Dragger onChange={this.uploadOnChange} multiple={true}>
                      {/*  <p className="ant-upload-drag-icon">
                     
                    </p> */}
                      <p className="ant-upload-text"> <Icon type="inbox" />点击或拖拽至此处</p>
                      <p className="ant-upload-hint">
                        支持单个或批量上传，严谨传公司保密文件。
                    </p>
                    </Upload.Dragger>
            </div>
                <button onClick={this.fileAdd}>上传</button>
      </div >
    );
  }
}
