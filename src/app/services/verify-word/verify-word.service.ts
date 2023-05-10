import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { DICTIONARY_API_URL } from '@app/config/app.config';
import { IDictionaryItem } from '@app/ts/interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class VerifyWordService {
  constructor(private _http: HttpClient) {}

  verifyWord(word: string): Observable<IDictionaryItem[]> {
    return this._http.get<IDictionaryItem[]>(`${DICTIONARY_API_URL}${word}`);
  }
}
