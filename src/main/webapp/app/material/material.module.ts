import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatRippleModule } from '@angular/material/core';
import { MatIconModule } from '@angular/material/icon';

@NgModule({
  declarations: [],
  imports: [CommonModule, MatExpansionModule, MatListModule, MatSidenavModule, MatRippleModule, MatIconModule],
  exports: [MatExpansionModule, MatListModule, MatSidenavModule, MatRippleModule, MatIconModule],
})
export class MaterialModule {}
