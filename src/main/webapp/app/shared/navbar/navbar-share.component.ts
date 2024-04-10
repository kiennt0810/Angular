import { Component, Input } from '@angular/core';

/**
 * A component that will take care of item count statistics of a pagination.
 */
@Component({
  selector: 'jhi-navbar-share',
  template: ` <div jhiTranslate="global.navbar-share" [translateValues]="{ nameModule: nameModule, link: link }"></div> `,
})
export class NavbarShareComponent {
  /**
   * @param params  Contains parameters for component:
   *                    page          Current page number
   *                    totalItems    Total number of items
   *                    itemsPerPage  Number of items per page
   */
  @Input() set params(params: { link?: string ; nameModule?: string;}) {
    this.link = params.link;
    this.nameModule = params.nameModule;
  }

  nameModule?: string;
  link?: string;
}
