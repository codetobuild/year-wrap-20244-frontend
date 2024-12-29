import { Routes } from '@angular/router';
import { EventsComponent } from './components/events/events.component';
import { TemplatesComponent } from './components/templates/templates.component';
import { SubmissionsComponent } from './components/submissions/submissions.component';
import { NotfoundComponent } from './components/notfound/notfound.component';
import { HomeComponent } from './components/home/home.component';
import { WrapFormComponent } from './components/wrap-form/wrap-form.component';
import { SummaryComponent } from './components/summary/summary.component';
import { ExploreComponent } from './components/explore/explore.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'wrap', component: WrapFormComponent },
  { path: 'explore', component: ExploreComponent },
  { path: 'wrap/summary/:shareCode', component: SummaryComponent },
  { path: 'events', component: EventsComponent },
  { path: 'templates', component: TemplatesComponent },
  { path: 'submissions', component: SubmissionsComponent },
  { path: '**', component: NotfoundComponent },
];
