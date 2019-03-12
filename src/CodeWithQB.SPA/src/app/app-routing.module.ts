import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomePageComponent } from './home/home-page.component';
import { CoursePageComponent } from './courses/course-page.component';

const routes: Routes = [
  {
    path: "",
    component: HomePageComponent,
    canActivate: [],
  },
  {
    path: "course",
    component: CoursePageComponent,
    canActivate: [],
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
