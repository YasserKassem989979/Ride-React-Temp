// assuming this.state.count === 0
this.setState({ count: this.state.count + 1 })
this.setState({ count: this.state.count + 1 })
this.setState({ count: this.state.count + 1 })
// this.state.count  ? 

//answer === 1, not 3

this.setState((prevState, props) => ({
    count: prevState.count + props.increment
  }))

  // answer === 3

/////////////////////////////////////////////////////////////////////

//How to focus an input element on page load?
class App extends React.Component{
    
    render() {
      return (
        <div>
          <input
            defaultValue={'Won\'t focus'}
          />
          <input
            defaultValue={'Will focus'}
          />
        </div>
      )
    }
  }
//////////////////////////////////////////////////////////////////
// How to update a component every second?
// You need to use setInterval() to trigger the change, but you also need to clear the timer when the component unmounts to prevent errors and memory leaks.

// componentDidMount() {
//   this.interval = setInterval(() => this.setState({ time: Date.now() }), 1000)
// }
// componentWillUnmount() {
//   clearInterval(this.interval)
// }
/////////////////////////////////////////////////////////////////////


//What would be the result of 2+5+”3″?
///////////////////////////////////////////////////////////////////////
var len = 10 
function fn(){
  console.log(this.len)
}

var obj = {
  len:5,
  method:function(fn){
    fn();
    arguments[0]();
  }
  }
obj.method(fn,1)
/////////////////////////////////////////////////////////////////////////
refactor with hooks
//////////////////////////////////////////
class App extends React.Component {
  state = {
    value: localStorage.getItem("info") || ""
  };
  componentDidUpdate() {
    localStorage.setItem("info", this.state.value);
  }
  onChange = event => {
    this.setState({ value: event.target.value });
  };
  render() {
    const { value } = this.state;
    return (
      <div>
        <input value={value} type="text" onChange={this.onChange} />
        <p>{value}</p>
      </div>
    );
  }
}
