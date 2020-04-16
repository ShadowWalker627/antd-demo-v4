import React, { lazy, Suspense } from 'react';
import { Switch, Route } from 'react-router-dom';

const BaseUpload = lazy(() => import('./components/BaseUpload'));

export default function() {
  return (
    <Suspense fallback="">
      <Switch>
        <Route exact path='/customerUpload' component={BaseUpload} />
      </Switch>
    </Suspense>
  );
}
