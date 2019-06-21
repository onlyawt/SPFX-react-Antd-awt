import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp} from '@pnp/sp';
import * as strings from 'BusinessApplicationWebPartStrings';
import BusinessApplication from './components/BusinessApplication';
import { IBusinessApplicationProps } from './components/IBusinessApplicationProps';

export interface IBusinessApplicationWebPartProps {
  description: string;
}

export default class BusinessApplicationWebPart extends BaseClientSideWebPart<IBusinessApplicationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBusinessApplicationProps > = React.createElement(
      BusinessApplication,
      {
        description: this.properties.description
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }
  //根据ID展示列表具体属性
  private showItems(): void {
    const itemsDom: Element = this.domElement.querySelector('#input');
  sp.web.lists.getByTitle('分类').items.getById(1).get().then(items => {
    // itemsDom.innerHTML+= `${items.map(i => `<span>${i.Title}</span>`).join('')}`;
    itemsDom.innerHTML += `<span>${items.Title}</span>`;
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
