import * as React from 'react'
import { render } from "react-dom"
import { HashRouter, Switch, Route, RouteComponentProps } from "react-router-dom"
import * as PropTypes from "prop-types"
import { createStore, bindActionCreators } from "redux"
import { Provider, connect } from "react-redux"
import InputItem from "antd-mobile/es/input-item"
import "antd-mobile/es/input-item/style/index.css"

interface Props {
    name: string;
}

interface IAction {
    type: string;
    [key: string]: any;
}

interface IState {
    counter: number;
}

function addCreator(): IAction {
    return {
        type: "Add"
    }
}

function reducer(state: IState = {counter: 0}, action: IAction) {
    let currentState = {...state};
    switch(action.type) {
        case "Add":
        currentState.counter += 1;
        break;

        case "Dec":
        currentState.counter -= 1;
        break;
    }

    return currentState;
}

let store = createStore(reducer);

store.subscribe(() => {
    console.log("state", store.getState());
})

function mapStateToProps(state: IState) {
    return {
        num: state.counter
    }
}

function mapDispatchToProps(dispatch: any) {
    return {
        add: bindActionCreators(addCreator, dispatch),
    }
}



class ReduxApp extends React.Component <{
    num: number;
    add: any;
}, {
    text: string;
}> {
    constructor(props: {num: number, add: any}) {
        super(props);
        this.state = {
            text: "haha"
        }
        this.handleChange = this.handleChange.bind(this);
        this.handleInput = this.handleInput.bind(this);
    }
    componentDidMount() {
        console.log(this.context);
        console.log(this.props);
    }

    handleChange(e: any) {
        console.log("change");
        console.log(e.target.value);
        this.setState({
            text: "haha"
        });
    }

    handleInput(e: any) {
        console.log("input");
        console.log(e.target.value);
        // e.target.value = e.target.value;
        return ""

    }
    render() {
        const { num, add } = this.props;
        return (
            <div>
                <input value={"ha"} onChange={this.handleChange} onInput={this.handleInput}/>
                <input type="checkbox" onChange={this.handleChange} onInput={this.handleInput}/>
                <h1 onClick={() => {
                    console.log("haha");
                    add();
                }}>{num}</h1>
            </div>
        )
    }
}

let Kop = connect(mapStateToProps, mapDispatchToProps)(ReduxApp);


interface State {
    num: number;
    arr: number[];
    person: {
        name: string;
    };
}

class Text extends React.Component {
    componentWillMount() {
        console.log("Text will Mount");
    }

    componentWillUnmount() {
        console.log("Text will unmount");
    }

    componentDidMount() {
        // console.log(document.querySelector(".koko"));
    }



    render() {
        return <div className="koko">Text</div>;
        
    }
}

class Text2 extends React.Component<{}, {}> {
    static contextTypes = {
        name: PropTypes.string
    }
    componentWillUnmount() {
        console.log("Text2 will unmount");
    }
    componentDidMount() {
        console.log(this.props);
        console.log(this.context);
    }
    render() {
        return (

            // <div onClick={() => {
            //     this.props.history.push("text");
            // }}>Text2</div>
            <h1>Text2</h1>
        )
    }
}

function StateLess(props: any) {
    return <div>stateless component</div>
}

class Text3 extends React.Component<{person: {name: string}}, {}> {
    render() {
        return (
            <h1>{this.props.person.name}</h1>
        )
    }    
}

class TestChild extends React.PureComponent<{
    person: {
        name: string;
    }
}, {}> {
    render() {
        return (
            <div>
                <h2>{this.props.person.name}</h2>
                {this.props.children}
            </div>
        )
    }
}


class App extends React.Component<Props, State> {
    a: any;
    static childContextTypes = {
        name: PropTypes.string
    };
    constructor(props: any) {
        super(props);
        this.state = {
            num: 1,
            arr: [3, 2, 1],
            person: {name: "Jack"}
        };
        this.add = this.add.bind(this);
        this.changeArr = this.changeArr.bind(this);
        this.deleteArr = this.deleteArr.bind(this);
        this.changePerson = this.changePerson.bind(this);
        this.a = {};
    }

    getChildContext() {
        return {
            name: "Messi"
        }
    }


    componentWillMount() {
        console.log("will mount");
    }

    componentDidMount() {
        // console.log(document.querySelector(".wrap"));
    }

    add() {
        let num: number = this.state.num + 1;
        this.setState({
            num,
        })
    }

    changeArr() {
        console.time("diff start");
        let arr = this.state.arr;
        arr.unshift(arr[0] + 1);
        this.setState({
            arr,
        });
        console.timeEnd("diff start");

    }

    deleteArr() {
        let arr = this.state.arr;
        arr.pop();

        this.setState({
            arr,
        });
    }

    changePerson() {
        let p = this.state.person;
        p.name = "messi";
        /*
        this.setState({
            person: p
        }, () => {
            console.log("state update");
        });
        */

        this.setState((state: State, props: Props) => {
            console.log(state, props);
            return {
                person: p
            }
        }, () => {
            console.log("cb");
        })
    }


    render() {
        // return createElement("h1", {"class": "title"}, ["hello"]);
        /*
        let classname: string;
        let aaa: JSX.Element;

        if (this.state.num % 2 === 0) {
            classname = "title_even";
            aaa = <Text ref={(e) => console.log("TEXT", e)}/>;
        } else {
            classname = "title_odd";
            aaa = <Text2 ref={(e) => console.log("text2", e)}/>;
        }
        */



        var arrElement: JSX.Element[] = this.state.arr.map((num: number, index: number) => <h3 key={num}>{num}</h3>);
        return (
            
            //test context
            // <Text2/>
            /*
            <HashRouter>
                <Switch>
                    <Route path="/" exact component={Text2}/>
                    <Route path="/text" exact component={Text}/>
                </Switch>
            </HashRouter>
            */
            // <div onClick={this.add}>{this.state.num}</div>

            // <div onClick={this.changePerson}>
            //     <TestChild person={this.state.person}>
            //         <h1>hahaha</h1>
            //     </TestChild>
            // </div>

            // <TestChild person={this.state.person}>
            //     <h1>hahaha</h1>
            //     <h2>hehehe</h2>
            // </TestChild>
            
            // <div>haha</div>
            // <StateLess/>
            <div className="wrap" onClick = {this.changeArr}>
                {arrElement}
                <div>{this.state.num}</div>
            </div>
            
        )
    }
}
/*
class App2 extends Component {
    render() {
        return (
            <HashRouter>
                <Switch>
                    <Route path="/" component={Text2}/>
                </Switch>
            </HashRouter>
        )
    }
}

function getDisplayName(component: React.ComponentClass): string {
    return component.displayName || "Component";
}


function withHeader(WrappedComponent: ComponentClass): ComponentClass {
    return class HOC extends React.Component {
        static displayName = `HOC(${getDisplayName(WrappedComponent)})`;
        render() {
            return (
                <div>
                    <h1>Title</h1>
                    <WrappedComponent {...this.props}/>
                </div>
            )
        }
    }
}


class Demo extends Component {
    static displayName = "Demo";
    render() {
        return (
            <div>Component</div>
        )
    }
}

let Hoc: ComponentClass = withHeader(Demo);
*/

/*
const modalRoot = document.createElement("div");
document.body.appendChild(modalRoot);


class Modal extends React.Component {
    constructor(props: any) {
        super(props);
    }

    render() {
        return createPortal(this.props.children, modalRoot);
    }
}

function Child() {
    return (
        <div>
            <button>Click</button>
        </div>
    )
}


class Parent extends React.Component<{}, {
    clicks: number;
}> {
    constructor(props: any) {
        super(props);
        this.state = {
            clicks: 0
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick() {
        this.setState((prevState) => {
            return {
                clicks: prevState.clicks + 1,
            }
        })
    }

    render() {
        return (
            <div onClick={this.handleClick}>
                <p>clicks, {this.state.clicks}</p>
                <Modal><Child/></Modal>
            </div>
        )
    }


}
*/
interface PPState {
    person: {
        name: string;
    };
}

class TestPpComponent extends React.Component<{}, PPState> {
    constructor() {
        super();
        this.state = {
            person: {
                name: 'Messi'
            }
        }

        this.changeName = this.changeName.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }
    
    changeName() {
        
        this.setState((prevState: PPState) => {
            console.log(prevState);
            let p = prevState.person;
            p.name = "Kaka";
            return {
                person: p,
            }
        })
    }

    handleChange(e: any) {
        console.log(e.target.value);
        let v = e.target.value;
        let p = this.state.person;
        p.name = v;
        this.setState({
            person: p,
        });
    }
    render() {
        return (
            <div>
                <h1 onClick={this.changeName}>{this.state.person.name}</h1>
                <input value={this.state.person.name} onChange={this.handleChange}/>
            </div>
        )
    }
}





render(<TestPpComponent />, document.getElementById("root"));











































