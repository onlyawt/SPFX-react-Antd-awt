import * as React from 'react';
import styles from './Hms.module.scss';
import { IHmsProps } from './IHmsProps';
import { escape } from '@microsoft/sp-lodash-subset';
import { ListView, IViewField, SelectionMode, GroupOrder, IGrouping } from "@pnp/spfx-controls-react/lib/ListView";
import { sp } from "@pnp/sp";
import { DateTimePicker, DateConvention, TimeConvention } from '@pnp/spfx-controls-react/lib/dateTimePicker';



export default class Hms extends React.Component < IHmsProps, {} > {

  private _getSelection(items: any[]) {
    console.log('Selected items:', items);
  }


  
  
  public render(): React.ReactElement<IHmsProps> {
 
    const items =  sp.web.lists.getByTitle('审批');

    return(
      

    );
  }
}
