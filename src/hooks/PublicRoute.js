import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken, getCurrentUser } from '../http/token-interceptor';

const currentUser = JSON.parse(getCurrentUser());

function PublicRoute({
  component: Component,
  openMobNav,
  restricted,
  ...rest
}) {
  // if (rest.name == 'login') {
  //     const params = new URLSearchParams(rest.location.hash);
  //     let values = [...params.entries()];
  //     if (values && values.length > 0) {
  //         if (values[0][0] == "#access_token") {
  //             localStorage.setItem('jwt', values[0][1]);

  //             var userData=  getCognitoCurrentUser();
  //                 // .then((userData) => {
  //
  //                     let udata = {};
  //                     udata._id = userData.sub;
  //                     udata.name = userData.name;
  //                     udata.email = userData.email;
  //                     localStorage.setItem('currentUser', JSON.stringify(udata));

  //                     return (
  //                         // restricted = false meaning public route
  //                         // restricted = true meaning restricted route
  //                         <Route {...rest} render={props => (getToken() != null && restricted ?
  //                             <Redirect to="/home" /> : <Component {...props} currentUser={currentUser} openMobNav={openMobNav} />)} />
  //                     )
  //                 // })
  //                 // .catch((err) => {
  //                 //     console.log(err);
  //                 // });
  //         } else {
  //             return (
  //                 // restricted = false meaning public route
  //                 // restricted = true meaning restricted route
  //                 <Route {...rest} render={props => (getToken() != null && restricted ?
  //                     <Redirect to="/home" /> : <Component {...props} currentUser={currentUser} openMobNav={openMobNav} />)} />
  //             )
  //         }
  //     } else {
  //         return (
  //             // restricted = false meaning public route
  //             // restricted = true meaning restricted route
  //             <Route {...rest} render={props => (getToken() != null && restricted ?
  //                 <Redirect to="/home" /> : <Component {...props} currentUser={currentUser} openMobNav={openMobNav} />)} />
  //         )
  //     }

  // } else {
  //     return (
  //         // restricted = false meaning public route
  //         // restricted = true meaning restricted route
  //         <Route {...rest} render={props => (getToken() != null && restricted ?
  //             <Redirect to="/home" /> : <Component {...props} currentUser={currentUser} openMobNav={openMobNav} />)} />
  //     )
  // }

  return (
    // restricted = false meaning public route
    // restricted = true meaning restricted route
    <Route
      exact
      path="/"
      {...rest}
      render={(props) =>
        getToken() != null && restricted ? (
          <Redirect to="/home" />
        ) : (
          <Component
            {...props}
            currentUser={currentUser}
            openMobNav={openMobNav}
          />
        )
      }
    />
  );
}

export default PublicRoute;
