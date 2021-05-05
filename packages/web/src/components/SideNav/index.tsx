
import React, { useState } from 'react';
import { Menu } from 'antd';
import { Button } from '@material-ui/core'
import {MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons';
import './sideNav.scss'

interface props{
    navData:string[];
    onSelect:(key)=>void;
    onServerIpButtonClicked:()=>any,
    serverIp:string
}

export default ({navData=[],onSelect,onServerIpButtonClicked,serverIp=null}:props):JSX.Element => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return <div style={{ width: 256,height:'100vh'}}>
        {/* <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button> */}
        <Menu
            theme="dark"
            style={{height:'100%'}}
            inlineCollapsed={collapsed}
            onSelect={({key})=>{
                onSelect(key);           
            }}
        >
            {navData.map(name=>{
                return <Menu.Item key={name}>
                    {name}
                </Menu.Item>
            })}
            <Button className={'ipButton'} variant="contained" color="secondary" onClick={onServerIpButtonClicked}>
                    切换数据源
            </Button>

            <div className={"serverIp"}>
                {serverIp&&`当前数据源: ${serverIp}`}
            </div>
            
        </Menu>
    </div>
}

