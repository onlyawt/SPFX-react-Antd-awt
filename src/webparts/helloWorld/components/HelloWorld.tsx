import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';
require('./HelloWorld.module.scss');

export default class HelloWorld extends React.Component<IHelloWorldProps, {}> {
  public render(): React.ReactElement<IHelloWorldProps> {
    return (
      <div className={`${ styles.helloWorld}`}>
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
                          <span className={styles.width2}></span>
                          <span >] 第</span>
                          <span className={styles.hao}></span>
                          <span >号</span>
                        </div></td>
                      </tr>
                      <tr>
                        <td className={styles.ldps} ><span  >领导批示</span></td>
                        <td className={styles.ldpst} colSpan={8}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.huiqian} ><span >会签</span></td>
                        <td className={styles.biankuang} colSpan={4}><span className={styles.spantext}></span></td>
                        <td className={styles.huiqian} colSpan={2}><span >核稿</span></td>
                        <td className={styles.biankuang} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.huiqian}><span >团组名称</span></td>
                        <td className={styles.biankuang} colSpan={4}><span className={styles.spantext}></span></td>
                        <td className={styles.huiqian} colSpan={2}><span >拟稿</span></td>
                        <td className={styles.biankuang} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.huiqian}><span >国别/地区</span></td>
                        <td className={styles.biankuang} colSpan={4}><span className={styles.spantext}></span></td>
                        <td className={styles.huiqian} colSpan={2}><span >人力资源部</span></td>
                        <td className={styles.biankuang} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.huiqian}><span >联系人及联系方式</span></td>
                        <td className={styles.biankuang} colSpan={4}><span className={styles.spantext}></span></td>
                        <td className={styles.huiqian} colSpan={2}><span >资产财务部</span></td>
                        <td className={styles.biankuang} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.border1} rowSpan={4}><span >事由</span></td>
                        <td className={styles.shiyouspan} colSpan={8}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.zutuan} colSpan={2}><span >组团单位</span></td>
                        <td className={styles.borderr} colSpan={6}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.border0} colSpan={2}><span >人数</span></td>
                        <td className={styles.border0} colSpan={2}><span className={styles.spantext}></span><span>人</span></td>
                        <td className={styles.border0} colSpan={2}><span >派出时间</span></td>
                        <td className={styles.borderr} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td colSpan={2}><span >在外时间</span></td>
                        <td colSpan={2}><span className={styles.spantext}></span><span>天</span></td>
                        <td colSpan={2}><span >派出类别</span></td>
                        <td className={styles.borderr} colSpan={2}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.tzheight} colSpan={2}><span >团组成员（单位）</span></td>
                        <td className={styles.border1} colSpan={7}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.tzheight} colSpan={2}><span >拟乘坐舱位</span></td>
                        <td className={styles.border1} colSpan={7}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.borderlr} rowSpan={4} colSpan={4}><span >经费来源：</span><span className={styles.spantext}></span></td>
                        <td className={styles.borderlr}><span >邀请单位：</span></td>
                        <td className={styles.borderlr} colSpan={4}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.borderlr}><span >地址：</span></td>
                        <td className={styles.borderlr} colSpan={4}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.borderlr}><span >电话：</span></td>
                        <td className={styles.borderlr} colSpan={4}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.borderlr}><span >邮箱：</span></td>
                        <td className={styles.borderlr} colSpan={4}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.fjheight} colSpan={2}><span >附件</span></td>
                        <td className={styles.border1} colSpan={7}><span className={styles.spantext}></span></td>
                      </tr>
                      <tr>
                        <td className={styles.bzheight} colSpan={2}><span >备注</span></td>
                        <td className={styles.border1} colSpan={7}><span className={styles.spantext}></span></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    );
  }
}
