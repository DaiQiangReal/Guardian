import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import SideNav from "../../components/SideNav";
import Line from "../../components/Line";
import Column from "../../components/Column";
import Point from "../../components/Point";
import Area from "../../components/Area";
import "./index.scss";
import IpInputModal from "components/IpInputModal";
import axios from "axios";
import { Input, notification } from "antd";
import { CloseCircleTwoTone } from "@ant-design/icons";
import { Button } from "@material-ui/core";
import lodash from "lodash-es";
import getData,{getGraphData} from '../../getData';
import WebsocketListener from '../../websocket';
const { Search } = Input;

export default () => {
    const [serverIP, setServerIP] = useState("localhost:3000");
    const [serverIPModalShow, setServerIPModalShow] = useState(false);
    const [data, setData] = useState({});
    const [currentCategory, setCurrentCategory] = useState(null);
    const [limit,setLimit]=useState({});
    const ref=useRef({
        websocketListener:null
    });
    const defaultLimit=Number.MAX_SAFE_INTEGER;

    const onDataChanged=useCallback((target,value)=>{
        lodash.set(data,target,value);
        setData({
            ...data
        })
    },[data]);

    ref.current.websocketListener?.setDataChangeListener(onDataChanged);

    const category = useMemo(() => {
        const category = Object.keys(data);
        setCurrentCategory(category[0]);
        ref.current.websocketListener?.subscribe([category]);
        return category;
    }, [data]);

    useEffect(() => {
        serverIP &&
            (async () => {
                let requestUrl = serverIP;
                if (!/http/.test(requestUrl)) {
                    requestUrl = "http://" + requestUrl;
                }
                try {
                    const data=await getData(requestUrl,defaultLimit);
                    if(ref.current.websocketListener){
                        ref.current.websocketListener.close();
                    }
                    ref.current.websocketListener=new WebsocketListener(serverIP);
                    ref.current.websocketListener?.subscribe([Object.keys(data)[0]]);
                    setData(data);
                } catch (e) {
                    notification.open({
                        message: "获取数据错误",
                        description: e.toString(),
                        duration: 0,
                        icon: <CloseCircleTwoTone twoToneColor={"red"} />,
                    });
                }
            })();
    }, [serverIP]);

   

    // const reflashNewData=async (graphName,method:'add'|'reduce')=>{
    //     const graphLimit=lodash.get(limit,graphName,defaultLimit);
    //     let userStart;
    //     let userEnd;
    //     if(method==='add'){
    //         userStart=lodash.get(ref.current,[graphName,1],0);
    //         userEnd=userStart+graphLimit;    
    //     }else{
    //         userStart=lodash.get(ref.current,[graphName,1],0)
    //     }
    //     const requesed=await getGraphData(serverIP,currentCategory,graphName,userStart,userEnd);
    //     console.log('test',userStart,userEnd,requesed);
        
    //     const [newGraphData,dataStart,dataEnd]=requesed;
    //     lodash.set(ref.current,graphName,[dataStart,dataEnd]);

    //     const originData=lodash.get(data,[currentCategory,graphName,'data'],[]);
    //     for(let i=Number(dataStart),j=0;i<=dataEnd;i++,j++){
    //         originData[i]=newGraphData[j];
    //     }
    //     console.log(originData);
        
    //     lodash.set(data,[currentCategory,graphName,'data'],originData);
    //     console.log(data);
        
    //     setData({
    //         ...data
    //     })

      
        
    // }

    

    const generatorGraphMap = (
        singleCategoryData: any,
        reflashGraphNameList: string[] = []
    ) => {
        if (!singleCategoryData) {
            return {};
        }
        const graphComponentsMap = {};
        const reflashGraphNameSet = new Set(
            reflashGraphNameList.length === 0
                ? Object.keys(singleCategoryData)
                : reflashGraphNameList
        );
        for (const graphName in singleCategoryData) {
           
            
            if (reflashGraphNameSet.has(graphName)) {
                const { type, xName, yName, data: graphData } = singleCategoryData[
                    graphName
                ];

                switch (type) {
                case `line`: {
                   
                    graphComponentsMap[graphName] = (
                        <Line
                            key={graphName}
                            xName={xName}
                            yName={yName}
                            title={graphName}
                            data={graphData}
                            //     onRangeAdd={
                            //         ()=>{
                            //             reflashNewData(graphName,'add')
                            //         }
                            //     }
                            //     onRangeReduce={()=>{
                    
                            //         reflashNewData(graphName,'reduce')
                            
                        
                        // }}
                        />
                    );
                    break;
                }
                case `column`: {
                    graphComponentsMap[graphName] = (
                        <Column
                            key={graphName}
                            xName={xName}
                            yName={yName}
                            title={graphName}
                            data={graphData}
                        />
                    );
                    break;
                }
                case `area`: {
                    graphComponentsMap[graphName] = (
                        <Area
                            key={graphName}
                            xName={xName}
                            yName={yName}
                            title={graphName}
                            data={graphData}
                        />
                    );
                    break;
                }
                }
            }
        }
        return graphComponentsMap;
    };

    const graphMap = generatorGraphMap(data[currentCategory]);

    return (
        <div className={"main"}>
            <IpInputModal
                isOpen={serverIPModalShow}
                onClose={() => setServerIPModalShow(false)}
                onChange={(val) => setServerIP(val)}
            />
            {serverIP && category.length > 0 && (
                <>
                    <div className={"sidenav"}>
                        <SideNav
                            navData={category}
                            serverIp={serverIP}
                            onSelect={(category) => setCurrentCategory(category)}
                            onServerIpButtonClicked={() => setServerIPModalShow(true)}
                        />
                    </div>
                    <div className={"content"}>
                        {lodash
                            .entries(graphMap)
                            .map(([graphName, graphComponent]) => graphComponent)}
                    </div>
                </>
            )}
        </div>
    );
};
