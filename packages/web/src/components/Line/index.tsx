import { Line } from '@ant-design/charts';
import { Button } from 'antd';
import React, { FC, ReactElement, useMemo } from 'react';
import Title from '../Title'
import "./line.scss"
interface props {
    title: string,
    xName:string,
    yName:string,
    data:{
        name:string,
        x:number,
        y:number,
        
    }[],
    // onRangeAdd:()=>void;
    // onRangeReduce:()=>void;
}

export default ({ title = "",data,xName,yName,/*onRangeAdd,onRangeReduce*/}: props): ReactElement => {

    const graphData=data.map(item=>({
        name:item.name,
        [xName]:item.x,
        [yName]:item.y,
    }))

    const config = useMemo(()=>({
        seriesField:'name',
        height: 400,
        xField: xName,
        yField: yName,
        point: {
            size: 5,
        },
    }),[xName,yName])

    return <div className={'line'}>
        <Title title={title} x={xName} y={yName}/>
        {/* <Button onClick={()=>onRangeReduce()}>-</Button>
        <Button onClick={()=>onRangeAdd()}>+</Button> */}
        <Line {...config} data={graphData} />;
    </div>

}