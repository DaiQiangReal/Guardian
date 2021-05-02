
import React, { useState } from 'react';
import { Menu, Button } from 'antd';

import {MenuUnfoldOutlined,MenuFoldOutlined} from '@ant-design/icons';


export default ({navData=[],onSelect}:{navData:string[],onSelect:(key)=>void}):JSX.Element => {
    const [collapsed, setCollapsed] = useState(false);
    const toggleCollapsed = () => {
        setCollapsed(!collapsed);
    };

    return <div style={{ width: 256 }}>
        <Button type="primary" onClick={toggleCollapsed} style={{ marginBottom: 16 }}>
            {React.createElement(collapsed ? MenuUnfoldOutlined : MenuFoldOutlined)}
        </Button>
        <Menu
            mode="inline"
            theme="dark"
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
            
        </Menu>
    </div>
}

