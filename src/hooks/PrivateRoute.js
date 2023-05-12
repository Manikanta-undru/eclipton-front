import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { getToken } from '../http/token-interceptor';

function PrivateRoute({
  component: Component,
  currentUser,
  openChat,
  openedChats,
  nextTo,
  ...rest
}) {
  return (
    <Route
      {...rest}
      render={(props) =>
        getToken() != null ? (
          <Component
            {...props}
            currentUser={currentUser}
            openChat={openChat}
            openedChats={openedChats}
            nextTo={nextTo}
          />
        ) : (
          <Redirect to={nextTo == null ? '/login' : `/login?next=${nextTo}`} />
        )
      }
    />
  );
}

export default PrivateRoute;
