import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';
import { sp } from '@pnp/sp';
import * as strings from 'AlertwebpartWebPartStrings';
import Alertwebpart from './components/Alertwebpart';
import { IAlertwebpartProps } from './components/IAlertwebpartProps';

export interface IAlertwebpartWebPartProps {
  ApprovealListName: string;
  ApprovealRecordListName:string;
}

export default class AlertwebpartWebPart extends BaseClientSideWebPart<IAlertwebpartWebPartProps> {

  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
      sp.setup({
        spfxContext: this.context
      });
    });
  }

  public render(): void {
    const element: React.ReactElement<IAlertwebpartProps> = React.createElement(
      Alertwebpart,
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
