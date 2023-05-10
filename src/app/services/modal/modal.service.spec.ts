import { TestBed } from '@angular/core/testing';
import { AboutComponent } from '@app/components/about/about.component';
import { ModalNameEnum } from '@app/ts/enums';
import { ModalService } from '@services/modal/modal.service';
import { SimpleModalService } from 'ngx-simple-modal';
import { of } from 'rxjs';

describe('ModalService', () => {
  describe('openModal', () => {
    let modalService: ModalService;
    let simpleModalService: jasmine.SpyObj<SimpleModalService>;

    beforeEach(() => {
      const spy = jasmine.createSpyObj('SimpleModalService', [
        'addModal',
        'removeAll',
      ]);

      TestBed.configureTestingModule({
        providers: [
          ModalService,
          { provide: SimpleModalService, useValue: spy },
        ],
      });

      modalService = TestBed.inject(ModalService);
      simpleModalService = TestBed.inject(
        SimpleModalService
      ) as jasmine.SpyObj<SimpleModalService>;

      simpleModalService.addModal.and.returnValue(of(false));
    });

    it('should open the modal and return a reference to it', (done: DoneFn) => {
      modalService.openModal(ModalNameEnum.About).subscribe(() => {
        expect(simpleModalService.addModal).toHaveBeenCalledWith(
          AboutComponent,
          undefined
        );
        done();
      });
    });

    it('should throw an error if passed an incorrect modal type', (done: DoneFn) => {
      //@ts-ignore
      modalService.openModal('badReference').subscribe({
        next: () => {
          expect(simpleModalService.addModal).not.toHaveBeenCalled();
        },
        error: (err: any) => {
          expect(err.message).toBeDefined();
          done();
        },
      });
    });

    it('should provide the modal with passed arguments', (done: DoneFn) => {
      const mockArgs = {
        foo: 'bar',
      };
      modalService.openModal(ModalNameEnum.About, mockArgs).subscribe(() => {
        expect(simpleModalService.addModal).toHaveBeenCalledWith(
          AboutComponent,
          mockArgs
        );
        done();
      });
    });

    it('should close other modals if requested to', (done: DoneFn) => {
      const shouldCloseOthers = true;
      modalService.openModal(ModalNameEnum.About, {}, shouldCloseOthers);

      expect(simpleModalService.removeAll).toHaveBeenCalled();
      done();
    });
  });
});
