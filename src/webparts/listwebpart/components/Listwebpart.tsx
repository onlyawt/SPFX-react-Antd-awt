import * as React from 'react';
import styles from './Listwebpart.module.scss';
import { IListwebpartProps } from './IListwebpartProps';
import { escape } from '@microsoft/sp-lodash-subset';
import 'antd/dist/antd.css';
import Button from 'antd/lib/button';

export default class Listwebpart extends React.Component < IListwebpartProps, {} > {
  public render(): React.ReactElement<IListwebpartProps> {
    return(
      <div>
    <button type='primary'>Primary</button>
    <Button type='primary'>Primary</Button>
    </div>
    );
  }
}
