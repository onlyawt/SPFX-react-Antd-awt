import * as React from 'react';
import * as ReactDom from 'react-dom';
import 'antd/dist/antd.css';
import {Button} from 'antd';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

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