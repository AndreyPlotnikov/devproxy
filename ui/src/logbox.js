import React from 'react';

var LogItem = React.createClass({
	render: function(){
		var logText = this.props.req_path;
		if(this.props.resp_code){
			logText += (' - ' + this.props.resp_code);
		}
		return (
			<div className="log-item">
				{logText}
			</div>
		)
	}
});


var LogBox = React.createClass({
	getInitialState: function(){
		return {data: [
			{key: '1', reqPath: '/api/checkIt?aaa=1', respCode:'200'},
			{key: '2', reqPath: '/api/checkIt?aaa=22'}
		]};
	},

	componentDidMount: function(){
		window.logBox = this;
	},

	render: function(){
		var logItems = this.state.data.map(function(logItem){
			return (
				<LogItem key={logItem.key} req_path={logItem.reqPath} resp_code={logItem.respCode} />
			);
		});
		return (
			<div className="log-box">
				{logItems}
			</div>
		);
	}
});

export default LogBox;
