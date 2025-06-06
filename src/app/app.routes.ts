import { Routes } from '@angular/router';
import { SubmissionsComponent } from './submissions/submissions.component';
import { UploadFormComponent } from './upload-form/upload-form.component';

export const routes: Routes = [
    {path:'upload',component:UploadFormComponent},
    {path:'',component:UploadFormComponent,pathMatch:'full'},
    {path:'submissions',component:SubmissionsComponent}
];
