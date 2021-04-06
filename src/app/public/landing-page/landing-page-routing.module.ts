import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SignUpComponent } from 'src/app/authentication/sign-up/sign-up.component';

const routes: Routes = [
  {
    path: 'becomeblogger',
    component: SignUpComponent
  },
  {
    path: 'becomevlogger',
    component: SignUpComponent
  },
  {
    path: 'becomepodcaster',
    component: SignUpComponent
  },
  {
    path: 'createMytrendingstoriescompanypage',
    component: SignUpComponent
  },
  {
    path: 'createMytrendingstoriescharitypage',
    component: SignUpComponent
  },
  {
    path: 'createMytrendingstoriesfundraiserpage',
    component: SignUpComponent
  },
  {
    path: 'createMytrendingstoriesecommercepage',
    component: SignUpComponent
  },
  {
    path: 'MytrendingstorieslocalSEOservices',
    component: SignUpComponent
  },
  {
    path: 'Mytrendingstoriesagencyservices',
    component: SignUpComponent
  },
  {
    path: 'joinMytrendingstoriesacademy',
    component: SignUpComponent
  },
  {
    path: 'Mytrendingstoriesagencywebinar',
    component: SignUpComponent
  },
  {
    path: 'Mytrendingstoriesacademywebinar',
    component: SignUpComponent
  },
  {
    path: 'joinMytrendingstoriesBitcoinplatform',
    component: SignUpComponent
  },
  {
    path: 'Mytrendingstoriesvideoservices',
    component: SignUpComponent
  },
  {
    path: 'becomeartist',
    component: SignUpComponent
  },
  {
    path: 'takepartinMytrendingstoriescontest',
    component: SignUpComponent
  },
  {
    path: 'mobileapp',
    component: SignUpComponent
  },
  {
    path: 'devenezblogueur',
    component: SignUpComponent
  },
  {
    path: 'devenezvlogger',
    component: SignUpComponent
  },
  {
    path: 'devenezpodcasteur',
    component: SignUpComponent
  },
  {
    path: "créerunepaged'entrepriseMytrendingstories",
    component: SignUpComponent
  },
  {
    path: "créerunepaged'entrepriseMytrendingstories",
    component: SignUpComponent
  },
  {
    path: 'créerunepagedecollectedefondsMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'créerunepagee-commerceMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'servicesdeSEOlocalMytrendingstories',
    component: SignUpComponent
  },
  {
    path: "servicesd'agenceMytrendingstories",
    component: SignUpComponent
  },
  {
    path: "webinairedel'académieMytrendingstories",
    component: SignUpComponent
  },
  {
    path: 'rejoignezMytrendingstoriesacademy',
    component: SignUpComponent
  },
  {
  path: "webinairedel'agenceMytrendingstories",
    component: SignUpComponent
  },
  {
    path: 'rejoignezlaplateformeBitcoinMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'servicesvidéoMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'devenezartiste',
    component: SignUpComponent
  },
  {
    path: 'participezauconcoursMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'applicationmobile',
    component: SignUpComponent
  },
  {
    path: 'mobileapp',
    component: SignUpComponent
  },
  {
    path: 'conviérteteenBlogger',
    component: SignUpComponent
  },
  {
    path: 'conviérteteenvlogger',
    component: SignUpComponent
  },
  {
    path: 'conviérteteenpodcaster',
    component: SignUpComponent
  },
  {
    path: "crearlapáginadelaempresaMytrendingstories",
    component: SignUpComponent
  },
  {
    path: "crearlapáginadelaempresaMytrendingstories",
    component: SignUpComponent
  },
  {
    path: 'crearlapáginaderecaudacióndefondosdeMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'crearpáginadecomercioelectrónicoMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'serviciosdeSEOlocalesMytrendingstories',
    component: SignUpComponent
  },
  {
    path: "serviciosdelaagenciaMytrendingstories",
    component: SignUpComponent
  },
  {
    path: "únetealaacademiaMytrendingstories",
    component: SignUpComponent
  },
  {
    path: 'seminariowebdelaagenciaMytrendingstories',
    component: SignUpComponent
  },
  {
  path: "seminariowebdeMytrendingstoriesacademy",
    component: SignUpComponent
  },
  {
    path: 'únasealaplataformaBitcoinMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'serviciosdevideodeMytrendingstories',
    component: SignUpComponent
  },
  {
    path: 'conviérteteenartista',
    component: SignUpComponent
  },
  {
    path: 'participaenelconcurso',
    component: SignUpComponent
  },
  {
    path: 'aplicaciónmovil',
    component: SignUpComponent
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LandingPageRoutingModule { }
