import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import { LiffService } from '../../services/liff.service';

@Component({
  selector: 'app-charge',
  standalone: true,
  templateUrl: './charge.component.html',
})
export class ChargeComponent implements OnInit {
  private readonly liffService =
    inject(LiffService);

  readonly amounts = [
    100,
    200,
    300,
    400,
    500,
    600,
  ];

  selectedAmount: number | null = null;

  userName: string | null = null;

  isLiffReady = false;
  isInLine = false;

  async ngOnInit(): Promise<void> {
    try {
      await this.liffService.init();

      this.isLiffReady = true;
      this.isInLine =
        this.liffService.isInClient();

      if (!this.liffService.isLoggedIn()) {
        this.liffService.login();
        return;
      }

      const profile =
        await this.liffService.getProfile();

      this.userName =
        profile.displayName;

      console.log(
        'LIFF ready:',
        this.isLiffReady,
      );

      console.log(
        'Opened inside LINE:',
        this.isInLine,
      );

      console.log(
        'Display name:',
        profile.displayName,
      );
    } catch (error) {
      console.error(
        'LIFF init error:',
        error,
      );
    }
  }

  selectAmount(amount: number): void {
    this.selectedAmount = amount;
  }

  confirm(): void {
    if (this.selectedAmount === null) {
      return;
    }

    const idToken =
      this.liffService.getIdToken();

    if (!idToken) {
      console.error(
        'LINE ID Token not found',
      );
      return;
    }

    console.log(
      'Selected amount:',
      this.selectedAmount,
    );

    // อย่า console.log idToken เต็ม ๆ
    console.log(
      'Has ID Token:',
      Boolean(idToken),
    );

    // ขั้นถัดไป:
    // POST idToken + amount
    // ไป Spring Boot
  }

  goBack(): void {
    window.history.back();
  }
}