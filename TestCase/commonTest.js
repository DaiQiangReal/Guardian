// @ts-nocheck
const axios=require('axios');

const sleep=(ms)=>{
    return new Promise(resolve=>{
        setTimeout(resolve,ms);
    })
}



const serverIP="http://localhost:3000";
const post=async (data)=>{
    await axios.post(serverIP+'/set',data);
    return;
}

const get=async (data)=>{
    return (await axios.get(serverIP+'/get',{
        params:{
            target:data
        }
    })).data;
}

async function main(){
    
    const GAN=await get('深度学习模型监控.GAN_网络损失监控.data');
    const originGAN=JSON.parse(JSON.stringify(GAN));
 
    GAN.push({ "name": "生成器", "x": "120", "y": 50 });
    await post({
        target:"深度学习模型监控.GAN_网络损失监控.data",
        value:GAN
    })
    await sleep(1000);
    GAN.push({ "name": "生成器", "x": "140", "y": 40 });
    await post({
        target:"深度学习模型监控.GAN_网络损失监控.data",
        value:GAN
    })
    await sleep(1000);
    GAN.push({ "name": "生成器", "x": "160", "y": 70 });
    await post({
        target:"深度学习模型监控.GAN_网络损失监控.data",
        value:GAN
    })
    await sleep(1000);
    GAN.push({ "name": "生成器", "x": "180", "y": 60 });
    await post({
        target:"深度学习模型监控.GAN_网络损失监控.data",
        value:GAN
    })
    await sleep(1000);
    GAN.push({ "name": "生成器", "x": "200", "y": 50 });
    await post({
        target:"深度学习模型监控.GAN_网络损失监控.data",
        value:GAN
    })
    await sleep(1000);
    // await post({
    //     target:"深度学习模型监控.GAN_网络损失监控.data",
    //     value:originGAN
    // })
}


main();