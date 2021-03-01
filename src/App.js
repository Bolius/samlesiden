import React from 'react';

import PostIndbrudTotal    from './PostIndbrudTotal';
import KommuneSelector from './KommuneSelector';

function IndbrudTotalIncluder(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="toggler">
      <PostIndbrudTotal />
    </div>
  );
}


function KommuneSelectorIncluder(props) {
  if (!props.show) {
    return null;
  }
  return (
    <div className="toggler">
      <KommuneSelector />
    </div>
  );
}

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showTotalIndbrud: false,
      showKommuneSelector: false,
    };
    this.handleToggleIndbrudTotal = this.handleToggleIndbrudTotal.bind(this);
    this.handleToggleKommunerSelector = this.handleToggleKommunerSelector.bind(this);
  }

  handleToggleIndbrudTotal() {
    this.setState(state => ({
      showTotalIndbrud: !state.showTotalIndbrud
    }));
  }

  handleToggleKommunerSelector() {
    this.setState(state => ({
      showKommuneSelector: !state.showKommuneSelector
    }));
  }

  render() {
    return (
      <div>
        <button onClick={this.handleToggleIndbrudTotal}>
          {this.state.showTotalIndbrud ? 'Skjul indbrud i Danmark' : 'Alle indbrud i Danmark'}
        </button>
        <button onClick={this.handleToggleKommunerSelector}>
          {this.state.showKommuneSelector ? 'Skjul kommunevælger' : 'Kommunevælger'}
        </button>
        <IndbrudTotalIncluder show={this.state.showTotalIndbrud} />
        <KommuneSelectorIncluder show={this.state.showKommuneSelector} />
      </div>
    );
  }
}

export default App;
