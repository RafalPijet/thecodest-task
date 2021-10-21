import React from 'react';
import { Router, Route, Switch, BrowserRouter } from 'react-router-dom';
import { createBrowserHistory } from 'history';

const MainPage = React.lazy(
  () => import('./components/pages/MainPage/MainPage')
);
const hist = createBrowserHistory();

const App = () => {
  return (
    <Router history={hist}>
      <React.Suspense fallback={<div>Loading...</div>}>
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={MainPage} />
          </Switch>
        </BrowserRouter>
      </React.Suspense>
    </Router>
  );
};

export default App;
