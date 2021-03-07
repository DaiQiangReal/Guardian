import React from "react";
import {Button,Modal} from 'antd'
import styles from './index.module.scss'
export interface MainProps { }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export interface TestProps { compiler: string; }


export default class Main extends React.Component<MainProps, {}> {
    render() {
        return <div >
            <div className={styles['main']}>hellp</div>
            <Button type="primary">test</Button>
        </div>;
    }
}