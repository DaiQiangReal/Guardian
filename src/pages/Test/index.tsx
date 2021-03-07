import React from "react";

export interface HelloProps { }

// 'HelloProps' describes the shape of props.
// State is never set so we use the '{}' type.
export interface TestProps { compiler: string; }
class Test extends React.Component<TestProps,{}>{
    render(){
        return <div>test {this.props.compiler}</div>
    }
}

export default class Hello extends React.Component<HelloProps, {}> {
    render() {
        return <h1>Hello from ! <Test compiler="ttt"/></h1>;
    }
}