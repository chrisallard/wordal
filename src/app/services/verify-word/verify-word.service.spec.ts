import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { DICTIONARY_API_URL } from '@app/config/app.config';
import { IDictionaryItem } from '@app/ts/interfaces';
import { VerifyWordService } from './verify-word.service';

describe('VerifyWordService', () => {
  let verifyWordService: VerifyWordService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [VerifyWordService],
    });

    verifyWordService = TestBed.inject(VerifyWordService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(verifyWordService).toBeTruthy();
  });

  describe('verifyWord', () => {
    it('should call the api with the passed word', (done: DoneFn) => {
      const mockWord = 'abate';
      const mockResponse: IDictionaryItem[] = [
        {
          word: 'abate',
          phonetic: '',
          phonetics: [
            {
              text: '',
              audio: '',
            },
          ],
          meanings: [
            {
              partOfSpeech: '',
              definitions: [
                {
                  definition: '',
                  synonyms: [],
                  antonyms: [],
                },
              ],
              synonyms: [],
              antonyms: [],
            },
          ],
          license: {
            name: '',
            url: '',
          },
          sourceUrls: [''],
        },
      ];

      verifyWordService.verifyWord(mockWord).subscribe((res) => {
        expect(res).toEqual(mockResponse);
        done();
      });

      const req = httpMock.expectOne(`${DICTIONARY_API_URL}${mockWord}`);
      expect(req.request.method).toEqual('GET');
      req.flush(mockResponse);

      httpMock.verify();
    });
  });
});
