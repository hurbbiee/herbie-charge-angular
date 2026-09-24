import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class ChargeService {
  private readonly http = inject(HttpClient);

  charge(idToken: string, amount: number) {
    return this.http.post('http://localhost:8080/api/charge', {
      idToken,
      amount,
    });
  }
}
