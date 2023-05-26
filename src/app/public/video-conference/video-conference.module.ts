import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { createTranslateLoader, SharedModule } from 'src/app/shared/shared.module';
import { HttpClient } from '@angular/common/http';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { VideoConferenceRoutingModule } from './video-conference-routing.module';
import { LiveSessionsComponent } from './live-sessions/live-sessions.component';
import { NgZorroAntdModule } from 'ng-zorro-antd';
import { LiveSessionComponent } from './live-session/live-session.component';
import { SessionUserComponent } from './live-session/session-user/session-user.component';
import { SessionMessageComponent } from './live-session/session-message/session-message.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SessionWaitedUserComponent } from './live-session/session-waited-user/session-waited-user.component';


@NgModule({
  declarations: [LiveSessionsComponent, LiveSessionComponent, SessionUserComponent, SessionMessageComponent, SessionWaitedUserComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NgZorroAntdModule,
    VideoConferenceRoutingModule,
    TranslateModule.forChild({ useDefaultLang: true, isolate: false, loader: { provide: TranslateLoader, useFactory: (createTranslateLoader), deps: [HttpClient] } }),
  ]
})
export class VideoConferenceModule { }
