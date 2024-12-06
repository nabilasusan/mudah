import { Routes } from '@angular/router';
import { FakultasComponent } from './components/fakultas/fakultas.component';
import { ProdiComponent } from './components/prodi/prodi.component';
import { HomeComponent } from './components/home/home.component';
import { mahasiswaComponent } from './components/mahasiswa/mahasiswa.component';

export const routes: Routes = [
    { path: '', component: HomeComponent },
    { path: 'fakultas', component: FakultasComponent },
    { path: 'prodi', component: ProdiComponent},
    { path: 'mahasiswa', component: mahasiswaComponent},
];
