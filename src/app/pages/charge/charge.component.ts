import {
  Component,
  OnInit,
  inject,
} from '@angular/core';

import {
  LiffService,
} from '../../services/liff.service';

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

  isLiffReady = false;

  userName: string | null = null;

  async ngOnInit(): Promise<void> {
    try {
      await this.liffService.init();

      this.isLiffReady = true;

      if (
        this.liffService.isLoggedIn()
      ) {
        const profile =
          await this.liffService.getProfile();

        this.userName =
          profile.displayName;

        console.log(
          'LINE Profile:',
          profile,
        );
      }
    } catch (error) {
      console.error(
        'LIFF init error:',
        error,
      );
    }
  }

  selectAmount(
    amount: number,
  ): void {
    this.selectedAmount =
      amount;
  }

  confirm(): void {
    if (
      this.selectedAmount === null
    ) {
      return;
    }

    const idToken =
      this.liffService.getIdToken();

    console.log(
      'Selected amount:',
      this.selectedAmount,
    );

    console.log(
      'ID Token:',
      idToken,
    );

    // ขั้นต่อไป:
    // ส่ง idToken + amount
    // ไป Java Spring Boot
  }

  goBack(): void {
    window.history.back();
  }
}