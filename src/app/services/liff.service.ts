import { Injectable } from '@angular/core';
import liff from '@line/liff';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class LiffService {
  async init(): Promise<void> {
    await liff.init({
      liffId: environment.liffId,
    });
  }

  isLoggedIn(): boolean {
    return liff.isLoggedIn();
  }

  isInClient(): boolean {
    return liff.isInClient();
  }

  login(): void {
    liff.login();
  }

  async getProfile() {
    return liff.getProfile();
  }

  getIdToken(): string | null {
    return liff.getIDToken();
  }

  closeWindow(): void {
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  }
}