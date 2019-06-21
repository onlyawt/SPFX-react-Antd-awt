import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import {
  sp
} from '@pnp/sp';
import * as strings from 'AlertwebpartWebPartStrings';
import Alertwebpart from './components/Alertwebpart';
import { IAlertwebpartProps } from './components/IAlertwebpartProps';

export interface IAlertwebpartWebPartProps {
  description: string;
}

export default class AlertwebpartWebPart extends BaseClientSideWebPart<IAlertwebpartWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IAlertwebpartProps > = React.createElement(
      Alertwebpart,
      {
        description: this.properties.description
      }
    );
    
    ReactDom.render(element, this.domElement);
    this.showItems();
    this.showxinxi();
    this.bindButtonEvent();
  }
  private bindButtonEvent() {
    const webpart: AlertwebpartWebPart = this;
    this.domElement.querySelector('#select1').addEventListener('change', () => { webpart.showxinxi(); });
  }  
  private showItems(): void {
    const itemsDom: Element = this.domElement.querySelector('#select1');
      sp.web.lists.getByTitle('新项目测试数据').items.get().then(items => {
        itemsDom.innerHTML+= `${items.map(i => `<Option value="${i.id}">${i.Title}</Option>`).join('')}`;
      });
  }
  private showxinxi(): void {
    const itemsDom: Element = this.domElement.querySelector('#select1');
    //const obj: string=itemsDom.nodeValue;
    const createshowxinxi: Element = this.domElement.querySelector('#showxinxi');
    const newshowxinxi: string = itemsDom.textContent;
    console.log(newshowxinxi+'1');
    createshowxinxi.innerHTML=newshowxinxi ;
      
  }
  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
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
