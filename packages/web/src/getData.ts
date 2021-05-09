import axios from 'axios';
import lodash from 'lodash-es';


function getRequestFunc(serverIP){
    return async (target:string)=>{
        return (await axios.get(serverIP+'/get',{
            params:{
                target
            }
        })).data
    }
}

const getGraphData=async (serverIP:string,category:string,graphName:string,rangeStart:number,rangeEnd:number)=>{

    const request=getRequestFunc(serverIP);
    const graphLength= Number(await request(`${category}.${graphName}.data.length}`));
    if(Math.abs(rangeStart-rangeEnd+1)>length){
        rangeStart=0;
        rangeEnd=graphLength;
    }

    const dataArray=[];
    for(let i=rangeStart;i<=rangeEnd;i++){
        dataArray.push(await request(`${category}.${graphName}.data.${i}`));
    }

    return dataArray


}


// export 


export default async (serverIP:string)=>{

    const limit=5;
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