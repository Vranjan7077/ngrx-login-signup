import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreModule } from './core/core.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from './shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    CoreModule,
    AuthModule,
    SharedModule
  ],
  exports:[
    SharedModule,
    AuthModule,
    CoreModule
  ]
})
export class ComponentsModule { }
