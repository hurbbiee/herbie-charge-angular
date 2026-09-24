import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { finalize } from 'rxjs';

import { LiffService } from '../../services/liff.service';
import { ChargeService } from '../../services/charge.service';

@Component({
  selector: 'app-charge',
  standalone: true,
  templateUrl: './charge.component.html',
})
export class ChargeComponent implements OnInit {
  private readonly liffService =
    inject(LiffService);

  private readonly chargeService =
    inject(ChargeService);

  readonly amounts = [
    100,
    200,
    300,
    400,
    500,
    600,
  ];

  selectedAmount =
    signal<number | null>(null);

  isLoading =
    signal(false);

  errorMessage =
    signal<string | null>(null);

  successMessage =
    signal<string | null>(null);

  userName =
    signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      await this.liffService.init();

      if (!this.liffService.isLoggedIn()) {
        this.liffService.login();
        return;
      }

      const profile =
        await this.liffService.getProfile();

      this.userName.set(
        profile.displayName,
      );
    } catch (error) {
      console.error(
        'LIFF init error:',
        error,
      );

      this.errorMessage.set(
        'ไม่สามารถเชื่อมต่อ LINE ได้',
      );
    }
  }

  selectAmount(
    amount: number,
  ): void {
    if (this.isLoading()) {
      return;
    }

    this.selectedAmount.set(
      amount,
    );

    this.errorMessage.set(null);
    this.successMessage.set(null);
  }

  confirm(): void {
    const amount =
      this.selectedAmount();

    if (
      amount === null ||
      this.isLoading()
    ) {
      return;
    }

    const idToken =
      this.liffService.getIdToken();

    if (!idToken) {
      this.errorMessage.set(
        'ไม่พบข้อมูลการเข้าสู่ระบบ LINE',
      );

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);

    this.chargeService
      .charge(
        idToken,
        amount,
      )
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: () => {
          this.successMessage.set(
            `เติมเครดิต ฿${amount} สำเร็จ`,
          );

          this.selectedAmount.set(null);

          // ตอนนี้ยังไม่ปิด LIFF ทันที
          // เพื่อให้เราเห็น success state ก่อน
        },

        error: (error) => {
          console.error(
            'Charge error:',
            error,
          );

          this.errorMessage.set(
            error?.error?.message ??
              'เกิดข้อผิดพลาด กรุณาลองใหม่',
          );
        },
      });
  }

  goBack(): void {
    if (this.isLoading()) {
      return;
    }

    window.history.back();
  }
}