import * as React from 'react';
import styles from './HelloWorld.module.scss';
import { IHelloWorldProps } from './IHelloWorldProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class HelloWorld extends React.Component < IHelloWorldProps, {} > {
  public render(): React.ReactElement<IHelloWorldProps> {
    return(
      <div className = { styles.helloWorld } >
  <div className={styles.container}>
    <div className={styles.row}>
      <div className={styles.column}>
        <span className={styles.title}>Welcome to SharePoint!</span>
        <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
        <p className={styles.description}>{escape(this.props.description)}</p>
        <p className={styles.description}>{escape(this.props.test)}</p>       
        <a href='https://aka.ms/spfx' className={styles.button}>
<<<<<<< HEAD
          <span className={styles.label}>更多</span>
=======
          <span className={styles.label}>Learn </span>
>>>>>>> 1893427900dcb28109b43fe549795d1c27a26565
        </a>
      </div>
    </div>
  </div>
      </div >
    );
  }
}
