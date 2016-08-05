import React from 'react';
import ReactDOM from 'react-dom';
import AceEditor from 'react-ace';
import brace from 'brace';

import 'brace/mode/java';
import 'brace/theme/github';
import 'brace/ext/language_tools';

class Example extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      code: "hello world"
    };
  }
  onChange(value) {
    this.setState({code: value});
  }
  render() {
    const myCommand = {
      name: 'myCommand',
      bindKey: 'Alt-Enter',
      exec: (editor) => {
        console.log("HELLO");
      },
      readOnly: true
    };
    return (
      <div>
        <AceEditor
          mode="java"
          theme="github"
          height="20em"
          value={this.state.code}
          onChange={(x) => this.onChange(x)}
          commands={[myCommand]} />
        <pre style={{borderRadius: '4px', background: '#eee', padding: '1em'}}>
          <code>
            {this.state.code}
          </code>
        </pre>
      </div>
    );
  }
}

ReactDOM.render(
  <Example />,
  document.getElementById('root')
);
