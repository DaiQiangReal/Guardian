import React, { useState, useEffect } from 'react';
import { Scatter, G2 } from '@ant-design/charts';
// Subjects of registered point | interval | polygon | line , etc., detailed reference G2: https://g2.antv.vision/

const DemoScatter: React.FC = () => {
    const [data, setData] = useState([]);
    useEffect(() => {
        asyncFetch();
    }, []);
    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/3e4db10a-9da1-4b44-80d8-c128f42764a8.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data: data,
        xField: 'xG conceded',
        yField: 'Shot conceded',
        shape: 'custom-shape',
        pointStyle: { fillOpacity: 1, fill: 'skyblue' },
       
        tooltip: {
            showMarkers: false,
            fields: ['xG conceded', 'Shot conceded'],
        },
    };
    return <Scatter {...config} />;
};

export default DemoScatter;