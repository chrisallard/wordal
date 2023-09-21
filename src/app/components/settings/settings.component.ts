import { Component, OnInit } from '@angular/core';
import { SettingsTypeEnum } from '@app/ts/enums';
import { IStoredSettings } from '@app/ts/interfaces';
import { StorageService } from '@services/storage/storage.service';
import { SimpleModalComponent } from 'ngx-simple-modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent
  extends SimpleModalComponent<null, boolean>
  implements OnInit
{
  settingTypes = SettingsTypeEnum;
  settings!: IStoredSettings;

  constructor(private _storageSvc: StorageService) {
    super();
  }

  ngOnInit(): void {
    const storedData = this._storageSvc.getLocalStorageData();

    if (storedData?.settings) {
      this.settings = storedData.settings;
    }
  }

  toggleSetting(option: SettingsTypeEnum, isEnabled: boolean): void {
    this.settings[option] = isEnabled;

    this._storageSvc.saveSettings({
      [option]: isEnabled,
    });
  }
}
