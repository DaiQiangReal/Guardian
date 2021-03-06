import React, { ReactElement, useMemo } from 'react';
import { Column } from '@ant-design/charts'
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
        height: 400,
        xField: xName,
        yField: yName,
        isGroup: true,
        point: {
            size: 5,
        },
    }),[xName,yName])
    return <div className={'line'}>
        <Title title={title} x={xName} y={yName}/>
        <Column {...config} data={graphData} />;
    </div>

}