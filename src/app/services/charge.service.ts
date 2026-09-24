import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private readonly http = inject(HttpClient);

  charge(idToken: string, amount: number) {
    return this.http.post(`${environment.apiUrl}/api/charge`, {
      idToken,
      amount,
    });
  }
}
