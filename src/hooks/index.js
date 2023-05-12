import React from 'react';
import { Route } from 'react-router-dom';
import { getToken } from '../http/token-interceptor';

function RouteGuard({ component: Comp, path, isAuthenticated, ...routeProps }) {
  const tkn = getToken();
  if (tkn == null) {
    window.location.href = '/login';
  } else {
    return <Route path={path} {...routeProps} />;
  }
  // if((routePermission.auth.indexOf(routeProps.name) !== -1 && tkn != null)) {
  //   return (<Route path={path} {...routeProps} />);
  // }
  // else if((routePermission.noAuth.indexOf(routeProps.name) !== -1 && tkn == null)){
  //   return (<Route path={path} {...routeProps} />);
  // }
  // else if((routePermission.noAuth.indexOf(routeProps.name) !== -1 && tkn != null)){
  //   //window.location.href="/";
  // }else{
  //   window.location.href="/login";
  //   //return (<Redirect to='/login' />);
  // }
}

export default RouteGuard;
