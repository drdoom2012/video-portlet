import React from 'react';
import ReactDOM from 'react-dom';
import {
  HashRouter as Router,
  Routes,
  Route,
  Link
} from "react-router-dom";
import About from './pages/About';


export default class AppComponent extends React.Component {
  render() {
    return (
      <div>
        <div>
          <div>
            <span className="tag">Portlet Namespace:</span>
            <span className="value">{this.props.portletNamespace}</span>
          </div>
          <div>
            <span className="tag">Context Path:</span>
            <span className="value">{this.props.contextPath}</span>
          </div>
          <div>
            <span className="tag">Portlet Element Id:</span>
            <span className="value">{this.props.portletElementId}</span>
          </div>

          <div>
            <span className="tag">Configuration:</span>
            <span className="value pre">{JSON.stringify(this.props.configuration, null, 2)}</span>
          </div>
        </div>

        <Router>
          <div>
            <ul>
              <li>
                <Link to="/">Home</Link>
              </li>
              <li>
                <Link to="/about">About</Link>
              </li>
              <li>
                <Link to="/dashboard">Dashboard</Link>
              </li>
            </ul>

            <hr />
          </div>

          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>

      </div>
    );
  }
}

function Home() {
  return (
    <div>
      <h2>Home</h2>
    </div>
  );
}

function Dashboard() {
  return (
    <div>
      <h2>Dashboard 2</h2>
    </div>
  );
}


