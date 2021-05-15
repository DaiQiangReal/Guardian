import axios from 'axios';
import lodash, { range } from 'lodash-es';


function getRequestFunc(serverIP){
    if(!(/http/.test(serverIP))){
        serverIP='http://'+serverIP;
    }
    return async (target:string)=>{
        return (await axios.get(serverIP+'/get',{
            params:{
                target
            }
        })).data
    }
}

export const getGraphData=async (serverIP:string,category:string,graphName:string,rangeStart:number,rangeEnd:number)=>{

    const request=getRequestFunc(serverIP);


    const dataArray=[];
    for(let i=rangeStart;i<=rangeEnd;i++){
        const aData=await request(`${category}.${graphName}.data.${i}`)
        if(!aData){
            return [dataArray,rangeStart,i-1];
        }else{
            dataArray.push(aData);
        }
    }

    return [dataArray,rangeStart,rangeEnd]


}





export default async (serverIP:string,limit:number)=>{

    const request=getRequestFunc(serverIP);

    const data= await request('allkeys')
    const categoryList=Object.keys(data);
    for(const category of categoryList){
        const graphList=Object.keys(data[category]);
    
        for(const graphName of graphList ){
            const graphDataLength=Number(await request(`${category}.${graphName}.data.length`));
            let graphData:Object[]=[];
                
    
            if(graphDataLength>limit){
                for(let i=0;i<limit;i++){
                    graphData.push(await request(`${category}.${graphName}.data.${graphDataLength-1-i}`));
                }
                graphData=graphData.reverse();
            }else{
                graphData=await request(`${category}.${graphName}.data`)
            }
            lodash.set(data,[category,graphName,'data'],graphData);
        }
       
    }

    return data;

}