import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryComponent } from './story/story.component';
import { StoryRoutingModule } from './story-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [StoryComponent],
  imports: [
    CommonModule,
    StoryRoutingModule,
    SharedModule
  ]
})
export class StoryModule { }
