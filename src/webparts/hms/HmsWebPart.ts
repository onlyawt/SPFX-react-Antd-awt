import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  BaseClientSideWebPart,
  IPropertyPaneConfiguration,
  PropertyPaneTextField
} from '@microsoft/sp-webpart-base';

import * as strings from 'HmsWebPartStrings';
import Hms from './components/Hms';
import { IHmsProps } from './components/IHmsProps';
import { sp } from "@pnp/sp";


export interface IHmsWebPartProps {
  description: string;
}

export default class HmsWebPart extends BaseClientSideWebPart<IHmsWebPartProps> {


  public onInit(): Promise<void> {

    return super.onInit().then(_ => {
    
    sp.setup({
    
    spfxContext: this.context
    
    });
    
    });
    
    }

  public render(): void {
    const element: React.ReactElement<IHmsProps > = React.createElement(
      Hms,
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