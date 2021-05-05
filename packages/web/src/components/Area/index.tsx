import React, { useState, useEffect, useMemo, ReactElement } from 'react';
import { Area } from '@ant-design/charts';
import Title from 'components/Title';


interface props {
    title: string,
    xName:string,
    yName:string,
    data:{
        name:string,
        x:number,
        y:number,
        
    }[]
}


export default ({ title = "",data,xName,yName}: props): ReactElement => {

    const graphData=data.map(item=>({
        name:item.name,
        [xName]:item.x,
        [yName]:item.y,
    }))

    const config = useMemo(()=>({
        seriesField:'name',
        xField: xName,
        yField: yName,
        isGroup: true,
        point: {
            size: 5,
        },
        annotations: [
            {
                type: 'text',
                position: ['min', 'median'],
                content: '中位数',
                offsetY: -4,
                style: { textBaseline: 'bottom' },
            },
            {
                type: 'line',
                start: ['min', 'median'],
                end: ['max', 'median'],
                style: {
                    stroke: 'red',
                    lineDash: [2, 2],
                },
            },
        ],
    }),[xName,yName])
    return <div className={'line'}>
        <Title title={title} x={xName} y={yName}/>
        <Area {...config} data={graphData} />;
    </div>

}