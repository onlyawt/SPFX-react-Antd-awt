import * as React from 'react';
import * as ReactDom from 'react-dom';
import 'antd/dist/antd.css';
import {Button,message,} from 'antd';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {
  sp
} from '@pnp/sp';
import * as strings from 'ListwebpartWebPartStrings';
import Listwebpart from './components/Listwebpart';
import { IListwebpartProps } from './components/IListwebpartProps';

export interface IListwebpartWebPartProps {
  description: string;
}

export default class ListwebpartWebPart extends BaseClientSideWebPart<IListwebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IListwebpartProps > = React.createElement(
      Listwebpart,
      {
        description: this.properties.description
      }
    );
    ReactDom.render(element, this.domElement);
    this.bindButtonEvent();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  // 按钮绑定onclick事件
  private bindButtonEvent() {
    const webpart: ListwebpartWebPart = this;
    this.domElement.querySelector('#savebutton').addEventListener('click', () => { webpart.createNewItem(); });
  }
  
  private createNewItem(): void {
    // const messageDom = this.domElement.querySelector('#message');
  
    const hide = message.loading(`正在保存文件`);
    setTimeout(hide, 500);
    const createshuidianwai: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#shuidianwai');
    const createhao: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#hao');
    const createzutuanmingcheng: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#zutuanmingcheng');
    const createguobie: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#guobie');
    const createlianxiren: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#lianxiren');
    const createshiyou: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#shiyou');
    const createzutuandanwei: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#zutuandanwei');
    const createrenshu: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#renshu');
    const createpaichushijian: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#paichushijian');
    const createzaiwaishijian: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#zaiwaishijian');
    const createtuanzuchengyuan: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#tuanzuchengyuan');
    const createnichengzuocangwei: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#nichengzuocangwei');
    const createjingfeilaiyuan: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#jingfeilaiyuan');
    const createyaoqiangdanwei: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#yaoqiangdanwei');
    const createpaichuqixian: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#paichuqixian');
    const createdizhi: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#dizhi');
    const createdianhua: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#dianhua');
    const createyouxiang: HTMLInputElement = <HTMLInputElement>this.domElement.querySelector('#youxiang');
    console.log(createshuidianwai.value);
    console.log(createhao.value);
    console.log(createzutuanmingcheng.value);
    console.log(createguobie.value);
    console.log(createlianxiren.value);
    console.log(createshiyou.value);
    console.log(createzutuandanwei.value);
    console.log(createrenshu.value);
    console.log(createpaichushijian.value);
    console.log(createzaiwaishijian.value);
    console.log(createtuanzuchengyuan.value);
    console.log(createnichengzuocangwei.value);
    console.log(createjingfeilaiyuan.value);
    console.log(createyaoqiangdanwei.value);
    console.log(createpaichuqixian.value);
    const newshuidianwai: string = createshuidianwai.value;
    const newhao: string = createhao.value;
    const newzutuanmingcheng: string = createzutuanmingcheng.value;
    const newguobie: string = createguobie.value;
    const newlianxiren: string = createlianxiren.value;
    const newshiyo: string = createshiyou.value;
    const newzutuandanwei: string = createzutuandanwei.value;
    const newrenshu:string = createrenshu.value;
    const newpaichushijian: string = createpaichushijian.value;
    const newzaiwaishijian: string = createzaiwaishijian.value;
    const newtuanzuchengyuan: string = createtuanzuchengyuan.value;
    const newnichengzuocangwei: string = createnichengzuocangwei.value;
    const newjingfeilaiyuan: string = createjingfeilaiyuan.value;
    const newyaoqiangdanwei: string = createyaoqiangdanwei.value;
    const newpaichuqixian: string = createpaichuqixian.value;
    const newdizhi: string = createdizhi.value;
    const newdianhua: string = createdianhua.value;
    const newyouxiang: string = createyouxiang.value;
    sp.web.lists.getByTitle('出国测试数据').items.add({
      year: newshuidianwai,// 年份
      Title: newhao,// 序号
      zutuanmingcheng: newzutuanmingcheng,// 团组名称
      guobie: newguobie,// 国别
      zutuandanwei:newzutuandanwei,// 组团单位
      lianxiren:newlianxiren,// 联系人
      shiyo:newshiyo,// 事由
      renshu:newrenshu,//人数
      paichushijian:newpaichushijian,// 派出时间
      zaiwaishijian:newzaiwaishijian,//在外时间
      tuanzuchengyuan:newtuanzuchengyuan,// 团组成员
      nichengzuocangwei:newnichengzuocangwei,// 拟乘坐舱位
      jingfeilaiyuan:newjingfeilaiyuan,// 经费来源
      yaoqiangdanwei:newyaoqiangdanwei,// 邀请单位
      paichuqixian:newpaichuqixian,// 长短期
      dizhi:newdizhi,// 地址
      dianhua:newdianhua,// 电话
      youxiang:newyouxiang// 邮箱
    }).then(result => {
      result.item.select('id').get().then(d => { 
        console.log('保存成功');
    
        // const success = () => {
         message.success(`保存成功`); 
      });
    }).catch(e => {
      console.log('保存失败');
   
      
      
      
       message.error(`保存失败`);
    });
  }
  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
