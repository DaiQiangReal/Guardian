import React from 'react';
import './title.scss'
interface props{
    title:string,
    x:string,
    y:string
}

export default ({title='',x=null,y=null}:props)=>{
    return <div className={'title'}>
        <span className={'titleText'}>{title}</span>
        {x&&y&&<span className={'axis'}>{`${y} / ${x}`}</span>}
    </div>
}