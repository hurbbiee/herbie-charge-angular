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

  login(): void {
    liff.login();
  }

  getIdToken(): string | null {
    return liff.getIDToken();
  }

  async getProfile() {
    return liff.getProfile();
  }

  isInClient(): boolean {
    return liff.isInClient();
  }

  closeWindow(): void {
    if (liff.isInClient()) {
      liff.closeWindow();
    }
  }
}
