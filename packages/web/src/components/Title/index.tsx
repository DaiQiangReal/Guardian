import React from 'react';
import './title.scss'
interface props{
    title:string
}

export default ({title=''}:props)=>{
    return <div className={'title'}>
        {title}
    </div>
}