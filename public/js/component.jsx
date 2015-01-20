var Content = React.createClass({
  render: function () {
    return (
      <div className="content">
        <h1>{this.props.title}</h1>
        <p>{this.props.body}</p>
      </div>
    );
  }
});

var ContentForm = React.createClass({
  handleSubmit: function(e) {
    e.preventDefault();
    var title = this.refs.title.getDOMNode().value.trim();
    var body = this.refs.body.getDOMNode().value.trim();
    if (!title) {
      return;
    }
    this.props.onContentSubmit({title: title, body: body});
    this.refs.title.getDOMNode().value = '';
    this.refs.body.getDOMNode().value = '';
    return;
  },
  render: function () {
    return (
      <form className="contentForm" onSubmit={this.handleSubmit}>
        <input type="text" placeholder="What is thy problem?"
               ref="title" />
        <input type="text" placeholder="What solution doth thou propose?"
               ref="body" />
        <input type="submit" value="So it shall be known" />
      </form>
    );
  }
});


var ContentList = React.createClass({
  loadContentFromServer: function () {
    var that = this;
    var r = new XMLHttpRequest();
    r.open("GET", this.props.url, true);
    r.onload = function () {
      if (r.status >= 200 && r.status <= 400) {
        console.log('GET rockin\'');
        that.setState({data: JSON.parse(r.responseText)});
      } else {
        console.log('GET failed');
      }
    };
    r.send();
  },
  handleContentSubmit: function(subContent) {
    var that = this;
    var content = this.state.data;
    var newContent = content.concat([subContent]);
    this.setState({data: newContent});

    var request = new XMLHttpRequest();
    request.open('POST', this.props.url, true);
    request.onreadystatechange = function () {
      if (request.readyState != 4 || request.status != 200) return;
      that.setState({data: newContent});
    };
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.send(JSON.stringify(subContent));
  },
  getInitialState: function () {
    return {data: []};
  },
  componentDidMount: function() {
    this.loadContentFromServer();
    setInterval(this.loadContentFromServer, this.props.pollInterval);
  },
  render: function () {
    var contentNodes = this.state.data.map(function (content) {
      return (
        <Content key={content.id} title={content.title} body={content.body}/>
      );
    });
    return (
      <div className="contentList">
        <h1>You know you have a developer problem when ...</h1>
        {contentNodes}
        <ContentForm onContentSubmit={this.handleContentSubmit} />
      </div>
    );
  }
});

var Container = React.createClass({
  render: function () {
    return (
      <div className="container">
        <ContentList url="content.json" pollInterval={60000} />
      </div>
    );
  }
});


React.render(
  <Container />,
  document.getElementById('content')
);
