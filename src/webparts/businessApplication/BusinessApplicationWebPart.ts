import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'BusinessApplicationWebPartStrings';
import BusinessApplication from './components/BusinessApplication';
import { IBusinessApplicationProps } from './components/IBusinessApplicationProps';

export interface IBusinessApplicationWebPartProps {
  ApprovealListName: string;
  ApprovealRecordListName:string;
}

export default class BusinessApplicationWebPart extends BaseClientSideWebPart<IBusinessApplicationWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IBusinessApplicationProps > = React.createElement(
      BusinessApplication,
      {
        ApprovealListName:this.properties.ApprovealListName,
        ApprovealRecordListName:this.properties.ApprovealRecordListName
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
                PropertyPaneTextField('ApprovealListName', {
                  label: "审批列表库名称"
                }),
                PropertyPaneTextField('ApprovealRecordListName', {
                  label: "审批意见列表库名称"
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
