import * as React from 'react';
import styles from './ShowPage.module.scss';
import { IShowPageProps } from './IShowPageProps';
import { escape } from '@microsoft/sp-lodash-subset';

export default class ShowPage extends React.Component < IShowPageProps, {} > {
  public render(): React.ReactElement<IShowPageProps> {
    return(
      <div className = {styles.showPage} >
        <div className={`${styles.four} ${styles.columns} ${styles.categorypreview}`}>
          <div className={`${styles.bgwhite} ${styles.categorypreviewouter}`}>
            <div className={`${styles.aligncenter} ${styles.mb4x}`}>
              
                            <div className={`${styles.categoryimageouter} ${styles.mt3x}${styles.mt1x} `}>
                                <div className={styles.categoryimagebg}></div>
                                <div className={styles.categoryimage} ></div>
                            </div>
                            <h3 className={`${styles.lh1} ${styles.pnone} ${styles.mnone} ${styles.cheading4}`} style={{color: '#4295D1'}}>保持高效</h3>
              
            </div>
            <div className={styles.ph2x}>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
            </div>
            <div></div>
          </div>
        </div>
        
        <div className={`${styles.four} ${styles.columns} ${styles.categorypreview}`}>
          <div className={`${styles.bgwhite} ${styles.categorypreviewouter}`}>
            <div className={`${styles.aligncenter} ${styles.mb4x}`}>
              
                            <div className={`${styles.categoryimageouter} ${styles.mt3x}${styles.mt1x} `}>
                                <div className={styles.categoryimagebg}></div>
                                <div className={styles.categoryimage} ></div>
                            </div>
                            <h3 className={`${styles.lh1} ${styles.pnone} ${styles.mnone} ${styles.cheading4}`} style={{color: '#4295D1'}}>保持高效</h3>
              
            </div>
            <div className={styles.ph2x}>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor:'#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor:'#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
            </div>
            <div></div>
          </div>
        </div>
        
        <div className={`${styles.four} ${styles.columns} ${styles.categorypreview}`}>
          <div className={`${styles.bgwhite} ${styles.categorypreviewouter}`}>
            <div className={`${styles.aligncenter} ${styles.mb4x}`}>
              
                            <div className={`${styles.categoryimageouter} ${styles.mt3x}${styles.mt1x} `}>
                                <div className={styles.categoryimagebg}></div>
                                <div className={styles.categoryimage} ></div>
                            </div>
                            <h3 className={`${styles.lh1} ${styles.pnone} ${styles.mnone} ${styles.cheading4}`} style={{color: '#4295D1'}}>保持高效</h3>
              
            </div>
            <div className={styles.ph2x}>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
                            <button className={styles.tipitem} data-tip='63'>
                                <span className={styles.tipitemcard}  style={{backgroundColor: '#4295D1'}}></span>
                                <span className={styles.tipcheckmark}>
                                    <svg viewBox='0 0 50 50' version='1.1' xmlns='http://www.w3.org/2000/svg'>
                                        <g id='check-on' fill='none' fill-rule='evenodd'>
                                            <polygon className={styles.tipcheckmarkcorner} points='0 0 50 0 50 50'></polygon>
                                            <polygon className={styles.tipcheckmarkcheck} points='32.4356804 21 26 14.3412147 27.9402989 12.3648649 32.4356804 17.0033768 42.0597088 7 44 8.97634979'></polygon>
                                        </g>
                                    </svg>                                </span>


                                <span className={`${styles.tipitemdesc}`}>停止自动播放视频</span>
                            </button>
            </div>
            <div></div>
          </div>
        </div>
        
        
      </div >
    );
  }
}
