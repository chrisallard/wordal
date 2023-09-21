import { TestBed } from '@angular/core/testing';
import { GuessFeedbackEnum } from '@app/ts/enums';
import { IGuess, IKeyBoard } from '@app/ts/interfaces';
import { GuessService } from '@services/guess/guess.service';
import { Observable, skip, take } from 'rxjs';

describe('GuessService', () => {
  let service: GuessService;
  let guess$: Observable<IKeyBoard>;
  let mockUpdates: IGuess[];
  let mockModel: IKeyBoard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GuessService);
    guess$ = service.guess$;

    mockUpdates = [
      {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Absent,
        value: 'c',
        row: 3,
      },
      {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Absent,
        value: 'l',
        row: 2,
      },
      {
        isCorrect: true,
        isPresent: true,
        state: GuessFeedbackEnum.Correct,
        value: 'e',
        row: 1,
      },
      {
        isCorrect: false,
        isPresent: true,
        state: GuessFeedbackEnum.Present,
        value: 'a',
        row: 2,
      },
      {
        isCorrect: false,
        isPresent: false,
        state: GuessFeedbackEnum.Absent,
        value: 'r',
        row: 1,
      },
    ];

    mockModel = mockUpdates.reduce(
      (prevVal, currVal) => ({
        ...prevVal,
        [currVal.value as string]: currVal,
      }),
      {}
    ) as any;
  });

  describe('updateGuess', () => {
    it('should update the model with changes and push', (done: DoneFn) => {
      guess$.pipe(skip(1)).subscribe((model) => {
        expect(model.a).toEqual(mockModel.a);
        expect(model.e).toEqual(mockModel.e);
        expect(model.r).toEqual(mockModel.r);

        done();
      });

      service.updateGuess(mockUpdates);
    });

    it('should not update a correctly placed letter once set', (done: DoneFn) => {
      // skip the initial model and the first update which marks 'e' as correctly placed
      guess$.pipe(skip(2)).subscribe((model) => {
        // 'e' should still be correct
        expect(model.e).toEqual(mockModel.e);
      });

      // mark 'e' as correct
      service.updateGuess(mockUpdates);
      // attempt to undo that change
      service.updateGuess([
        {
          isCorrect: false,
          isPresent: true,
          state: GuessFeedbackEnum.Present,
          value: 'e',
          row: 1,
        },
      ]);

      done();
    });
  });

  describe('reset', () => {
    it('should reset the game model to a pristine state', (done: DoneFn) => {
      let pristineModel: IKeyBoard;
      let dirtyModel: IKeyBoard;
      let isLastTime = false;
      let i = 0;

      service.reset();

      guess$.pipe(take(3)).subscribe((model) => {
        i = i + 1;

        if (i === 1) {
          pristineModel = { ...model };
          service.updateGuess(mockUpdates);
        }

        if (i === 2) {
          dirtyModel = { ...model };
          service.reset();
        }

        if (i === 3 && !isLastTime) {
          isLastTime = true;
          expect(dirtyModel).not.toEqual(pristineModel);
          expect(model).toEqual(pristineModel);
          done();
        }
      });
    });
  });
});
