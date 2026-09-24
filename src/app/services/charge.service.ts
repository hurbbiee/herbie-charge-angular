import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../environments/environment';
import { ChargeResponse } from '../models/charge.model';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private readonly http = inject(HttpClient);

  charge(idToken: string, amount: number): Observable<ChargeResponse> {
    return this.http.post<ChargeResponse>(`${environment.apiUrl}/api/charge`, {
      idToken,
      amount,
    });
  }
}
