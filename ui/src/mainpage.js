import React from 'react';
import LogBox from './logbox';

var MainPage = React.createClass({
	render: function(){
		return (
			<div className="container">
				<h1>Dev proxy</h1>
				<div className="row">
					<div className="col-md-12">
						<LogBox />
					</div>
				</div>
			</div>
		);
	}
});

export default MainPage;
