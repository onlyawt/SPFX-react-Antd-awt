import * as React from 'react';
import styles from './Listwebpart.module.scss';
import { IListwebpartProps } from './IListwebpartProps';
import zhCN from 'antd/lib/locale-provider/zh_CN';
import 'moment/locale/zh-cn';
import { escape } from '@microsoft/sp-lodash-subset';
import 'antd/dist/antd.css';
import { Icon,Upload,message,Radio,Input,InputNumber,LocaleProvider,DatePicker,Button} from 'antd';
import { size } from 'lodash';
const { TextArea } = Input;
export default class Listwebpart extends React.Component < IListwebpartProps, {} > {
  public render(): React.ReactElement<IListwebpartProps> {
    function onChange(date, dateString) {
      console.log(date,dateString);
    }
    function onChange1(value) {
      console.log('changed', value);
    }
    function onChange2(value) {
      console.log('changed', value);
    }
    function onChange3(value) {
      console.log('changed', value);
    }
    const props = {
      name: 'file',
      action: 'https://www.mocky.io/v2/5cc8019d300000980a055e76',
      headers: {
        authorization: 'authorization-text',
      },
      onChange(info) {
        if (info.file.status !== 'uploading') {
          console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
          message.success(`${info.file.name} 文件上载成功`);
        } else if (info.file.status === 'error') {
          message.error(`${info.file.name} 文件上载失败.`);
        }
      },
    };
    return(
      <div className={`${ styles.listwebpart}`}>
      <table className={styles.table}>
        <colgroup>
        </colgroup>
        <tbody>
          <tr>
            <td >
              <div>
                <span className={styles.font} >中国水利水电对外有限公司</span>
              </div>
              <div><span className={ styles.font } >出国/赴港澳台任务批件</span></div>
              <div>
                <table className={ styles.table }>
                  <colgroup>
                    <col className={styles.colwidth1} />
                    <col className={styles.colwidth2} />
                    <col className={styles.colwidth3} />
                    <col className={styles.colwidth4} />
                    <col className={styles.colwidth5} />
                    <col className={styles.colwidth6} />
                    <col className={styles.colwidth7} />
                    <col className={styles.colwidth8} />
                    <col className={styles.colwidth9} />

                  </colgroup>
                  <tbody className={styles.font1}>
                    <tr><td></td></tr>
                    <tr>
                      <td className={`${ styles.borderb} ${styles.font2}`} colSpan={9}><div >
                        <span >水电外任字[</span>
                        <InputNumber style={{border:'0px',fontSize:'18px',color:'#000000'}} min={0} max={100000} defaultValue={0} onChange={onChange2} id='shuidianwai'/>
                        <span >] 第</span>
                        <InputNumber style={{border:'0px',fontSize:'18px',color:'#000000'}} min={0} max={100000} defaultValue={0} onChange={onChange3} id='hao'/>
                        <span >号</span>
                      </div></td>
                    </tr>
                      <tr>
                        <td className={styles.ldps} ><span  >领导批示</span></td>
                        <td className={styles.ldpst} colSpan={8}>{/* <TextArea
                          placeholder='批示内容'
                          autosize={{ minRows: 2, maxRows: 3 }}
                          id='lingdaopishi'
                          style={{border:'0px',fontSize:'18px',color:'#000000'}}
                        /> */}</td>
                      </tr>
                    <tr>
                      <td className={styles.huiqian} ><span >会签</span></td>
                      <td className={styles.biankuang} colSpan={4}>{/* <input className={styles.input}  id='huiqian'></input> */}</td>
                      <td className={styles.huiqian} colSpan={2}><span >核稿</span></td>
                      <td className={styles.biankuang} colSpan={2}>{/* <input className={styles.input} id='hegao'/> */}</td>
                    </tr>
                    <tr>
                      <td className={styles.huiqian}><span >团组名称</span></td>
                      <td className={styles.biankuang} colSpan={4}><input className={styles.input} id='zutuanmingcheng'/></td>
                      <td className={styles.huiqian} colSpan={2}><span >拟稿</span></td>
                      <td className={styles.biankuang} colSpan={2}>{/* <input className={styles.input} id='nigao'/> */}</td>
                    </tr>
                    <tr>
                      <td className={styles.huiqian}><span >国别/地区</span></td>
                      <td className={styles.biankuang} colSpan={4}><input className={styles.input} id='guobie'/></td>
                      <td className={styles.huiqian} colSpan={2}><span >人力资源部</span></td>
                      <td className={styles.biankuang} colSpan={2}>{/* <input className={styles.input} id='renliziyuan'/> */}</td>
                    </tr>
                    <tr>
                      <td className={styles.huiqian}><span >联系人及联系方式</span></td>
                      <td className={styles.biankuang} colSpan={4}><input className={styles.input} id='lianxiren'/></td>
                      <td className={styles.huiqian} colSpan={2}><span >资产财务部</span></td>
                      <td className={styles.biankuang} colSpan={2}>{/* <input className={styles.input} id='zichancaiwu'/> */}</td>
                    </tr>
                    <tr>
                      <td className={styles.border1} rowSpan={4}><span >事由</span></td>
                      <td className={styles.shiyouspan} colSpan={8}><TextArea
                          placeholder='事由内容'
                          autosize={{ minRows: 2, maxRows: 3 }}
                          id='shiyou'
                          style={{border:'0px',fontSize:'18px',color:'#000000'}}
                        /></td>
                    </tr>
                    <tr>
                      <td className={styles.zutuan} colSpan={2}><span >组团单位</span></td>
                      <td className={styles.borderr} colSpan={6}><input className={styles.input} id='zutuandanwei'/></td>
                    </tr>
                    <tr>
                      <td className={styles.border0} colSpan={2}><span >人数</span></td>
                      <td className={styles.border0} colSpan={2}><InputNumber style={{border:'0px',fontSize:'18px'}} min={0} max={100000} defaultValue={0} onChange={onChange1} id='renshu'/><span>人</span></td>
                      <td className={styles.border0} colSpan={2}><span >派出时间</span></td>
                      <td className={styles.borderr} colSpan={2}><LocaleProvider locale={zhCN}><DatePicker style={{border:'0px'}} onChange={onChange} id='paichushijian' /></LocaleProvider></td>
                    </tr>
                    <tr>
                      <td colSpan={2}><span >在外时间</span></td>
                      <td colSpan={2}><InputNumber style={{border:'0px',fontSize:'18px'}} min={0} max={100000} defaultValue={0} onChange={onChange1} id='zaiwaishijian'/><span>天</span></td>
                      <td colSpan={2}><span >派出期限</span></td>
                        <td className={styles.borderr} colSpan={2}><Radio.Group style={{border:'0px'}} defaultValue='短期' buttonStyle='solid' id='paichuqixian'>
                          <Radio.Button style={{border:'0px'}} value='长期'>长期</Radio.Button>
                          <Radio.Button style={{border:'0px'}} value='短期'>短期</Radio.Button>
                        </Radio.Group></td>
                    </tr>
                    <tr>
                      <td className={styles.tzheight} colSpan={2}><span >团组成员（单位）</span></td>
                      <td className={styles.border1} colSpan={7}><TextArea
                          placeholder='组团成员'
                          autosize={{ minRows: 1, maxRows: 1 }}
                          id='tuanzuchengyuan'
                          style={{border:'0px',fontSize:'18px',color:'#000000'}}
                        /></td>
                    </tr>
                    <tr>
                      <td className={styles.tzheight} colSpan={2}><span >拟乘坐舱位</span></td>
                      <td className={styles.border1} colSpan={7}><input className={styles.input} id='nichengzuocangwei'/></td>
                    </tr>
                    <tr>
                      <td className={styles.borderlr} rowSpan={4} colSpan={4}><span >经费来源：</span><TextArea
                          placeholder='组团成员'
                          autosize={{ minRows: 4, maxRows: 4 }}
                          id='jingfeilaiyuan'
                          style={{border:'0px',fontSize:'18px',color:'#000000'}}
                        /></td>
                      <td className={styles.borderlr}><span >邀请单位：</span></td>
                      <td className={styles.borderlr} colSpan={4}><input className={styles.input} id='yaoqiangdanwei'/></td>
                    </tr>
                    <tr>
                      <td className={styles.borderlr}><span >地址：</span></td>
                      <td className={styles.borderlr} colSpan={4}><input className={styles.input} id='dizhi'/></td>
                    </tr>
                    <tr>
                      <td className={styles.borderlr}><span >电话：</span></td>
                      <td className={styles.borderlr} colSpan={4}><input className={styles.input} id='dianhua'/></td>
                    </tr>
                    <tr>
                      <td className={styles.borderlr}><span >邮箱：</span></td>
                      <td className={styles.borderlr} colSpan={4}><input className={styles.input} id='youxiang'/></td>
                    </tr>
                    <tr>
                      <td className={styles.fjheight} colSpan={2}><span >附件</span></td>
                        <td className={styles.border1} colSpan={7}><Upload {...props} >
                          <Button style={{border:'0px'}}>
                            <Icon type='upload' />点击上传文件
                          </Button>
                        </Upload></td>
                    </tr>
                    <tr>
                      <td className={styles.bzheight} colSpan={2}><span >备注</span></td>
                      <td className={styles.border1} colSpan={7}><TextArea
                          placeholder='事由内容'
                          autosize={{ minRows: 2, maxRows: 3 }}
                          id='beizhu'
                          style={{border:'0px',fontSize:'18px',color:'#000000'}}
                        /></td>
                    </tr>
                  </tbody>
                </table>

                <Button id='savebutton'>
                            <Icon type='upload' />提交
                          </Button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    );
  }
}
