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
        <span className={styles.title}>欢迎 to SharePoint!</span>
        <p className={styles.subTitle}>Customize SharePoint experiences using Web Parts.</p>
        <p className={styles.description}>{escape(this.props.description)}</p>
        <p className={styles.description}>{escape(this.props.test)}</p>       
        <a href='https://aka.ms/spfx' className={styles.button}>
          <span className={styles.label}>更多</span>
        </a>
              <div className={ styles.row }>
                <button className={styles.button} id="showItemButton"><span>显示item</span></button>
              </div>
              <div className={ styles.row }>
                <span className={styles.title}>输入标题:</span>
                <input type="text" id="titleTxtCreate"/>
                <span className={styles.title}>输入描述:</span>
                <input type="text" id="descriptionTxtCreate"/>
                <button className={styles.button} id="createButton"><span>新建item</span></button>
              </div>
              <div className={ styles.row }>
                <span className={styles.title}>输入ID:</span>
                <input type="text" id="idTxtUpdate"/>
                <span className={styles.title}>更新标题:</span>
                <input type="text" id="titleTxtUpdate"/>
                <span className={styles.title}>更新描述:</span>
                <input type="text" id="descriptionTxtUpdate"/>
                <button className={styles.button} id="updateButton"><span>更新item</span></button>
              </div> 
              <div className={ styles.row }>
                <span className={styles.title}>输入ID:</span>
                <input type="text" id="idTxtDelete"/>
                <button className={styles.button} id="deleteButton"><span>删除item</span></button>
              </div>
              <div className={ styles.row }>
                <span className={styles.title}>当前状态:</span>
                <span id="message" className={styles.title}></span>
              </div>
              <p id="lists"></p>
              <table id="items"></table>
      </div>
    </div>
  <div id="spListContainer" />
    </div>
      </div >
    );
  }
}
