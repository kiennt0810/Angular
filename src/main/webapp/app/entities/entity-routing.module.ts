import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */

      {
        path: 'confirm',
        loadChildren: () => import('./confirm/confirm.module').then(m => m.ConfirmModule),
      },
    ]),
  ],
})
export class EntityRoutingModule {}
