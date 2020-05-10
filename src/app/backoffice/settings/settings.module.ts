import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { SharedModule } from "../../shared/shared.module";
import { ReactiveFormsModule } from "@angular/forms";

import {
  NzCardModule,
  NzSkeletonModule,
  NzAvatarModule,
  NzPaginationModule,
  NzDividerModule,
  NzButtonModule,
  NzListModule,
  NzTableModule,
  NzRadioModule,
  NzTabsModule,
  NzRateModule,
  NzTagModule,
  NzFormModule,
  NzDatePickerModule,
  NzSelectModule,
  NzSwitchModule,
  NzUploadModule,
  NzToolTipModule,
  NzModalModule,
  NzMessageModule,
  NzInputModule,
  NzSpinModule,
} from "ng-zorro-antd";

import { SettingsRoutingModule } from "./settings-routing.module";
import { ProfileSettingsComponent } from "./profile-settings/profile-settings.component";
import { UserService } from "src/app/shared/services/user.service";

const antdModule = [
  NzCardModule,
  NzSkeletonModule,
  NzAvatarModule,
  NzPaginationModule,
  NzDividerModule,
  NzButtonModule,
  NzListModule,
  NzTableModule,
  NzRadioModule,
  NzRateModule,
  NzTabsModule,
  NzTagModule,
  NzFormModule,
  NzDatePickerModule,
  NzSelectModule,
  NzSwitchModule,
  NzUploadModule,
  NzToolTipModule,
  NzModalModule,
  NzMessageModule,
  NzInputModule,
  NzSpinModule,
];

@NgModule({
  declarations: [ProfileSettingsComponent],
  imports: [
    CommonModule,
    SettingsRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    ...antdModule,
  ],
  providers: [UserService],
})
export class SettingsModule { }
