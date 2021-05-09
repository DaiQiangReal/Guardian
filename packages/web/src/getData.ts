import axios from 'axios';
import lodash from 'lodash-es';




export default async (serverIP:string)=>{

    const requestUrl=serverIP+'/get';
    const limit=5;
    const request=async (target:string)=>{
        return (await axios.get(requestUrl,{
            params:{
                target
            }
        })).data
    }

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