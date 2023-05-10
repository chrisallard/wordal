import { TestBed } from '@angular/core/testing';
import { LOCAL_STORAGE_KEY } from '@app/config/app.config';
import { puzzleBank } from '@assets/puzzle-bank';
import { PuzzleService } from '@services/puzzle.service';

describe('PuzzleService', () => {
  let service: PuzzleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PuzzleService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPuzzle', () => {
    it('should return a 5 letter word', (done: DoneFn) => {
      service.getPuzzle().subscribe((word) => {
        expect(word.length).toEqual(5);
        done();
      });
    });

    it('should return a unique puzzle if not all have been solved', (done: DoneFn) => {
      const puzzles = [...puzzleBank];
      const finalPuzzle = puzzles[puzzles.length - 1];

      puzzles.length = puzzles.length - 1;

      localStorage.setItem(
        LOCAL_STORAGE_KEY,
        JSON.stringify({
          completedPuzzles: puzzles,
        })
      );

      service.getPuzzle().subscribe((word) => {
        expect(word).toEqual(finalPuzzle);
        localStorage.removeItem(LOCAL_STORAGE_KEY);
        done();
      });
    });
  });
});
