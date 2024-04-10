import { Route } from '@angular/router';

import { LoginFTComponent } from './loginFT.component';

export const LOGIN_FT_ROUTE: Route = {
  path: '',
  component: LoginFTComponent,
  data: {
    pageTitle: 'login.title',
  },
};
