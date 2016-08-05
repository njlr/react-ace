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
      defaultValue: '// Hello world',
      code: null,
    };
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
          defaultValue={this.state.defaultValue}
          value={this.state.code}
          onChange={code => this.setState({code})}
          commands={[myCommand]} />
        <button onClick={() => {this.setState({defaultValue: 'xxx'})}}>
          Change default value
        </button>
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
