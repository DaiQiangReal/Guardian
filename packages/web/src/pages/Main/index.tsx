import React, { useEffect, useState } from "react";
import SideNav from '../../components/SideNav'
import Line from '../../components/Line'
import Column from '../../components/Column'
import Point from '../../components/Point'
import './index.scss'
import axios from "axios";
import { Input } from "antd";
const {Search} = Input;


export default () => {

    const [serverIP, setServerIP] = useState(null);
    // useEffect(() => {
    //     (async () => {
    //         let data = axios.get('')
    //     })()
    // }, [serverIP])



    return <div className={'main'}>
        <Search placeholder="input search text"  enterButton="Search" size="large" onSearch={(s)=>alert(s)} />
        
        {
            serverIP && <><div className={'sidenav'}>
                <SideNav navData={['dawd', 'dwadawdwadawd', '42455']} onSelect={(key) => console.log(key)} />
            </div>
            <div className={'content'}>
                <Line title={'测试折线图'} />
                <Column />
                <Point />
            </div></>
        }
    </div>;

}