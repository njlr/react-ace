import ace from 'brace';
import React, { Component, PropTypes } from 'react';
import isEqual from 'lodash.isequal';

const editorOptions = [
  'minLines',
  'maxLines',
  'readOnly',
  'highlightActiveLine',
  'tabSize',
  'enableBasicAutocompletion',
  'enableLiveAutocompletion',
  'enableSnippets '
];

export default class ReactAce extends Component {
  constructor(props) {
    super(props);
    [
      'onChange',
      'onFocus',
      'onBlur',
      'onCopy',
      'onPaste',
      'handleOptions',
    ]
    .forEach(method => {
      this[method] = this[method].bind(this);
    });
    this.silent = false;
  }

  componentDidMount() {
    const { onBeforeLoad } = this.props;
    if (onBeforeLoad) {
      onBeforeLoad(ace);
    }
  }

  initEditor(element) {
    if (element === null || element === this.lastElement) {
      return;
    }
    this.lastElement = element;
    this.silent= true;
    const {
      mode,
      theme,
      fontSize,
      value,
      cursorStart,
      showGutter,
      wrapEnabled,
      showPrintMargin,
      showInvisibles, 
      keyboardHandler,
      onLoad,
      commands,
    } = this.props;

    this.editor = ace.edit(element);

    this.editor.$blockScrolling = Infinity;

    const editorProps = Object.keys(this.props.editorProps);
    for (let i = 0; i < editorProps.length; i++) {
      this.editor[editorProps[i]] = this.props.editorProps[editorProps[i]];
    }

    this.editor.getSession().setMode(`ace/mode/${mode}`);
    this.editor.setTheme(`ace/theme/${theme}`);
    this.editor.setFontSize(fontSize);
    this.editor.setValue(value, cursorStart || -1);
    this.editor.renderer.setShowGutter(showGutter);
    this.editor.getSession().setUseWrapMode(wrapEnabled);
    this.editor.setShowPrintMargin(showPrintMargin);
    this.editor.setShowInvisibles(showInvisibles);
    this.editor.on('focus', this.onFocus);
    this.editor.on('blur', this.onBlur);
    this.editor.on('copy', this.onCopy);
    this.editor.on('paste', this.onPaste);
    this.editor.on('change', this.onChange);

    this.handleOptions(this.props);

    for (let i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
      this.editor.setOption(option, this.props[option]);
    }

    if (Array.isArray(commands)) {
      commands.forEach((command) => {
        this.editor.commands.addCommand(command);
      });
    }

    if (keyboardHandler) {
      this.editor.setKeyboardHandler('ace/keyboard/' + keyboardHandler);
    }

    this.silent = false;

    if (onLoad) {
      onLoad(this.editor);
    }
  }

  componentWillReceiveProps(nextProps) {
    const oldProps = this.props;

    for (let i = 0; i < editorOptions.length; i++) {
      const option = editorOptions[i];
      if (nextProps[option] !== oldProps[option]) {
        this.editor.setOption(option, nextProps[option]);
      }
    }

    if (nextProps.mode !== oldProps.mode) {
      this.editor.getSession().setMode('ace/mode/' + nextProps.mode);
    }
    if (nextProps.theme !== oldProps.theme) {
      this.editor.setTheme('ace/theme/' + nextProps.theme);
    }
    if (nextProps.fontSize !== oldProps.fontSize) {
      this.editor.setFontSize(nextProps.fontSize);
    }
    if (nextProps.wrapEnabled !== oldProps.wrapEnabled) {
      this.editor.getSession().setUseWrapMode(nextProps.wrapEnabled);
    }
    if (nextProps.showPrintMargin !== oldProps.showPrintMargin) {
      this.editor.setShowPrintMargin(nextProps.showPrintMargin);
    }
    if (nextProps.showInvisibles !== oldProps.showInvisibles) {
      this.editor.setShowInvisibles(nextProps.showInvisibles);
    }
    if (nextProps.showGutter !== oldProps.showGutter) {
      this.editor.renderer.setShowGutter(nextProps.showGutter);
    }
    if (!isEqual(nextProps.setOptions, oldProps.setOptions)) {
      this.handleOptions(nextProps);
    }
    if (this.editor.getValue() !== nextProps.value) {
      // editor.setValue is a synchronous function call, change event is emitted before setValue return.
      this.silent = true;
      this.editor.setValue(nextProps.value, nextProps.cursorStart || -1);
      this.silent = false;
    }
  }

  componentWillUnmount() {
    this.editor.destroy();
    this.editor = null;
  }

  onChange() {
    if (this.props.onChange && !this.silent) {
      const value = this.editor.getValue();
      if (value !== this.props.value) {
        this.props.onChange(value);
      }
    }
  }

  onFocus() {
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  }

  onBlur() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
  }

  onCopy(text) {
    if (this.props.onCopy) {
      this.props.onCopy(text);
    }
  }

  onPaste(text) {
    if (this.props.onPaste) {
      this.props.onPaste(text);
    }
  }

  handleOptions(props) {
    const setOptions = Object.keys(props.setOptions);
    for (let y = 0; y < setOptions.length; y++) {
      this.editor.setOption(setOptions[y], props.setOptions[setOptions[y]]);
    }
  }

  render() {
    const { name, className, width, height } = this.props;
    const divStyle = { width, height };
    return (
      <div
        id={name}
        className={className}
        style={divStyle}
        ref={(element) => this.initEditor(element)}>
      </div>
    );
  }
}

ReactAce.propTypes = {
  mode: PropTypes.string,
  theme: PropTypes.string,
  name: PropTypes.string,
  className: PropTypes.string,
  height: PropTypes.string,
  width: PropTypes.string,
  fontSize: PropTypes.number,
  showGutter: PropTypes.bool,
  onChange: PropTypes.func,
  onCopy: PropTypes.func,
  onPaste: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  value: PropTypes.string,
  onLoad: PropTypes.func,
  onBeforeLoad: PropTypes.func,
  minLines: PropTypes.number,
  maxLines: PropTypes.number,
  readOnly: PropTypes.bool,
  highlightActiveLine: PropTypes.bool,
  tabSize: PropTypes.number,
  showPrintMargin: PropTypes.bool,
  cursorStart: PropTypes.number,
  editorProps: PropTypes.object,
  setOptions: PropTypes.object,
  keyboardHandler: PropTypes.string,
  wrapEnabled: PropTypes.bool,
  enableBasicAutocompletion: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  enableLiveAutocompletion: PropTypes.oneOfType([
    PropTypes.bool,
    PropTypes.array,
  ]),
  commands: PropTypes.array,
};

ReactAce.defaultProps = {
  name: 'brace-editor',
  mode: '',
  theme: '',
  height: '500px',
  width: '500px',
  value: '',
  fontSize: 12,
  showGutter: true,
  onChange: null,
  onPaste: null,
  onLoad: null,
  minLines: null,
  maxLines: null,
  readOnly: false,
  highlightActiveLine: true,
  showPrintMargin: true,
  showInvisibles: false, 
  tabSize: 4,
  cursorStart: null,
  editorProps: {},
  setOptions: {},
  wrapEnabled: false,
  enableBasicAutocompletion: false,
  enableLiveAutocompletion: false,
};
