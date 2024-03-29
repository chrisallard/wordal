import { Injectable } from '@angular/core';
import { ModalNameEnum } from '@app/ts/enums';
import { AboutComponent } from '@components/about/about.component';
import { ConfirmDialogueComponent } from '@components/confirm-dialogue/confirm-dialogue.component';
import { DefinitionComponent } from '@components/definition/definition.component';
import { DonateComponent } from '@components/donate/donate.component';
import { InstructionsComponent } from '@components/instructions/instructions.component';
import { SettingsComponent } from '@components/settings/settings.component';
import { StatsComponent } from '@components/stats/stats.component';
import { SummaryComponent } from '@components/summary/summary.component';
import { SimpleModalService } from 'ngx-simple-modal';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  constructor(private _modal: SimpleModalService) {}

  openModal(
    modalName: ModalNameEnum,
    args?: object,
    shouldCloseOthers: boolean = true
  ) {
    let component;
    switch (modalName) {
      case ModalNameEnum.About:
        component = AboutComponent;
        break;
      case ModalNameEnum.Confirm:
        component = ConfirmDialogueComponent;
        break;
      case ModalNameEnum.Definition:
        component = DefinitionComponent;
        break;
      case ModalNameEnum.Donation:
        component = DonateComponent;
        break;
      case ModalNameEnum.Settings:
        component = SettingsComponent;
        break;
      case ModalNameEnum.Stats:
        component = StatsComponent;
        break;
      case ModalNameEnum.Instructions:
        component = InstructionsComponent;
        break;
      case ModalNameEnum.Summary:
        component = SummaryComponent;
        break;
    }

    if (shouldCloseOthers) {
      this._modal.removeAll();
    }

    if (component) {
      return this._modal.addModal(component, args);
    }

    return throwError(() => {
      const error: any = new Error(
        `ModalService: Invalid component reference. Check the spelling and try again.`
      );
      return error;
    });
  }
}
