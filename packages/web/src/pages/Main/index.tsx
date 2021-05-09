import React, { useEffect, useMemo, useState } from "react";
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
import getData from '../../getData';
const { Search } = Input;

export default () => {
    const [serverIP, setServerIP] = useState("localhost:3000");
    const [serverIPModalShow, setServerIPModalShow] = useState(false);
    const [data, setData] = useState({});
    const [currentCategory, setCurrentCategory] = useState(null);
    useEffect(() => {
        serverIP &&
            (async () => {
                let requestUrl = serverIP;
                if (!/http/.test(requestUrl)) {
                    requestUrl = "http://" + requestUrl;
                }
                try {
                    const { data } = await axios.get(requestUrl + "/get");
                    const data2=await getData(requestUrl);
                    console.log('data',data,data2);

                    setData(data2);
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

    const category = useMemo(() => {
        const category = Object.keys(data);
        setCurrentCategory(category[0]);
        return category;
    }, [data]);

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
                console.log( singleCategoryData[
                    graphName
                ]);
                
                switch (type) {
                case `line`: {
                    graphComponentsMap[graphName] = (
                        <Line
                            key={graphName}
                            xName={xName}
                            yName={yName}
                            title={graphName}
                            data={graphData}
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
