const isDev=()=>process.env.DEV === "develop";
module.exports={
    "compilerOptions": {
        "outDir": "./dist/",
        "sourceMap":isDev(),
        "noImplicitAny": true,
        "module": "ES6",
        "target": "es5",
        "jsx": "react",
        "declaration":true,
        "allowJs": true,
        "baseUrl":'.',
        "paths":{
            "pages/*":["src/pages/*"],
            "components/*":["src/components/*"]
        }
    },
    
}