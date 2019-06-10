import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneCheckbox,
  PropertyPaneDropdown,
  PropertyPaneToggle
} from '@microsoft/sp-webpart-base';
import {
  Environment,
  EnvironmentType
} from '@microsoft/sp-core-library';
import MockHttpClient from './MockHttpClient';
import {
  SPHttpClient,
  SPHttpClientResponse   
} from '@microsoft/sp-http';
import * as strings from 'HelloWorldWebPartStrings';
import{
  sp
}from '@pnp/sp'
import HelloWorld from './components/HelloWorld';
import { IHelloWorldProps } from './components/IHelloWorldProps';
import styles from '../../../lib/webparts/helloWorld/components/HelloWorld.module.scss';

export interface IHelloWorldWebPartProps {
  test: string;
    test1: boolean;
    test2: string;
    test3: boolean;
  description: string;
  listName:string;
}
export interface ISPLists {
  value: ISPList[];
}

export interface ISPList {
  Title: string;
  Id: string;
}
export default class HelloWorldWebPart extends BaseClientSideWebPart<IHelloWorldWebPartProps> {
  private _getListData(): Promise<ISPLists> {
    return this.context.spHttpClient.get(this.context.pageContext.web.absoluteUrl + `/_api/web/lists?$filter=Hidden eq false`, SPHttpClient.configurations.v1)
      .then((response: SPHttpClientResponse) => {
        return response.json();
      });
  }
  private _getMockListData(): Promise<ISPLists> {
    return MockHttpClient.get()
      .then((data: ISPList[]) => {
        var listData: ISPLists = { value: data };
        return listData;
      }) as Promise<ISPLists>;
  }
  private _renderList(items: ISPList[]): void {
    let html: string = '';
    items.forEach((item: ISPList) => {
      html += `
      <ul class="${styles.list}">
      <li class="${styles.listItem}">
        <span class="ms-font-l">${item.Title}</span>
      </li>
    </ul>`;
    });
  
    const listContainer: Element = this.domElement.querySelector('#spListContainer');
    listContainer.innerHTML = html;
  }

  private _renderListAsync(): void {
    // Local environment
    if (Environment.type === EnvironmentType.Local) {
      this._getMockListData().then((response) => {
        this._renderList(response.value);
      });
    }
    else if (Environment.type == EnvironmentType.SharePoint || 
              Environment.type == EnvironmentType.ClassicSharePoint) {
      this._getListData()
        .then((response) => {
          this._renderList(response.value);
        });
    }
  }
  //按钮绑定onclick事件
  private bindButtonEvent(){
    const webpart:HelloWorldWebPart = this;
    this.domElement.querySelector("#showListButton").addEventListener('click', ()=> {webpart.showAllList();});
    this.domElement.querySelector("#showItemButton").addEventListener('click', ()=> {webpart.showItems();});
    this.domElement.querySelector("#createButton").addEventListener('click', ()=> {webpart.createNewItem();});
    this.domElement.querySelector("#updateButton").addEventListener('click', ()=> {webpart.updateItem();});
    this.domElement.querySelector("#deleteButton").addEventListener('click', ()=> {webpart.deleteItem();});
  }
  //showAllList()方法
  private showAllList():void {
    const listDom : Element = this.domElement.querySelector("#lists");
    sp.web.lists.get().then(lists=>{
      listDom.innerHTML += `<ul>${lists.map(l=>`<li>${l.Title}</li>`).join("")}</ul>`;
    });
  }
  //showItems()
  private showItems():void{
    const itemsDom : Element = this.domElement.querySelector("#items");
    if(this.properties.listName != ""){
      sp.web.lists.getByTitle(this.properties.listName).items.get().then(items=>{
        itemsDom.innerHTML += `<ul>${items.map(i=>`<li>${i.Title}</li>`).join("")}</ul>`;
      });
    } 
    else{
      itemsDom.innerHTML += "请指定列表";
    }
  }
  //createNewItem()创建项目
  private createNewItem():void{
    const messageDom = this.domElement.querySelector("#message");
    messageDom.innerHTML = "正在创建item...";
    const createTitleDom : HTMLInputElement = <HTMLInputElement>this.domElement.querySelector("#titleTxtCreate");
    console.log(createTitleDom.value);
    let newItemTitle:string = createTitleDom.value;    
    sp.web.lists.getByTitle(this.properties.listName).items.add({
      Title: newItemTitle
    }).then(result =>{
      result.item.select("id").get().then(d => {messageDom.innerHTML = "item创建成功! item id: " + d.Id});
    }).catch(e =>{
      messageDom.innerHTML = "创建失败！ 错误： " + e.message;
    });
  }
  //更新
  private updateItem():void{
    const messageDom = this.domElement.querySelector("#message");
    messageDom.innerHTML = "正在更新item...";
    const updateIdDom : HTMLInputElement = <HTMLInputElement>this.domElement.querySelector("#idTxtUpdate");
    console.log(updateIdDom.value);
    let updateItemId:string = updateIdDom.value;
    sp.web.lists.getByTitle(this.properties.listName).items.getById(parseInt(updateItemId)).update({
      Title: `标题 ${new Date()}`
    }).then(result => { 
      result.item.get().then(d => {messageDom.innerHTML = "item更新成功! item title: " + d.Title});
     }).catch(e =>{
        messageDom.innerHTML = "更新失败！ 错误： " + e.message;
    });
  
  }
 //删除
  private deleteItem():void{
    const messageDom = this.domElement.querySelector("#message");
    messageDom.innerHTML = "正在删除item...";
    const deleteIdDom : HTMLInputElement = <HTMLInputElement>this.domElement.querySelector("#idTxtDelete");
    console.log(deleteIdDom.value);
    let deleteItemId:string = deleteIdDom.value;
    sp.web.lists.getByTitle(this.properties.listName).items.getById(parseInt(deleteItemId)).delete().then(result=>{
      messageDom.innerHTML = "删除成功！";
    }).catch(e=>{
      messageDom.innerHTML = "删除失败！ 错误： " + e.message;
    });
    }
  
  public render(): void {
    
    const element: React.ReactElement<IHelloWorldProps > = React.createElement(
      HelloWorld,
      {
        description: this.properties.description,
        test: this.properties.test,

      }
    );

    ReactDom.render(element, this.domElement);
    this._renderListAsync();
    this.bindButtonEvent();
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }
  protected get disableReactivePropertyChanges():boolean{
    return true;
  }
  protected get dataVersion(): Version {
    return Version.parse('1.0');
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
                label: 'Description'
              }),
              PropertyPaneTextField('test', {
                label: 'Multi-line Text Field',
                multiline: true
              }),
              PropertyPaneCheckbox('test1', {
                text: 'Checkbox'
              }),
              PropertyPaneDropdown('test2', {
                label: 'Dropdown',
                options: [
                  { key: '1', text: 'One' },
                  { key: '2', text: 'Two' },
                  { key: '3', text: 'Three' },
                  { key: '4', text: 'Four' }
                ]}),
              PropertyPaneToggle('test3', {
                label: 'Toggle',
                onText: 'On',
                offText: 'Off'
              }),
              PropertyPaneTextField('listName',{
                label:'列表名称'
              })
            ]
            }
          ]
        }
      ]
    };
  }
}
