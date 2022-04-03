import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { ListComponent } from '../views/pages/cad-users/list/list.component';
import { RegisterComponent } from '../views/pages/cad-users/register/register.component';

const routes: Routes = [
  {
		path: '',
		component: ListComponent,
	},
	{
		path: 'lista',
		component: ListComponent,
	},
	{
		path: 'cadastro',
		component: RegisterComponent,
	},
	{
		path: 'editar/:id',
		component: RegisterComponent
	},
	{path: '', redirectTo: 'lista', pathMatch: 'full'},
	{path: '**', redirectTo: 'lista', pathMatch: 'full'},

];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class RoutingModule { }