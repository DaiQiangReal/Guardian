const presets=[
    [
        "@babel/env",
        {
          "targets": {
            "firefox": "60",
            "chrome": "67",
            "safari": "11.1"
          },
          "useBuiltIns": "usage",
          "corejs": "3.6.5"
        }
      ],
    ["@babel/preset-react",{
        development: process.env.DEV === "develop",
    }],
    "@babel/preset-typescript"
      
    
];

module.exports={
    presets
}