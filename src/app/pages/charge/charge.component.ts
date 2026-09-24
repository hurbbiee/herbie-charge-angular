import { Component, OnInit, inject, signal } from '@angular/core';

import { finalize } from 'rxjs';

import { LiffService } from '../../services/liff.service';
import { ChargeService } from '../../services/charge.service';

@Component({
  selector: 'app-charge',
  standalone: true,
  templateUrl: './charge.component.html',
})
export class ChargeComponent implements OnInit {
  private readonly liffService = inject(LiffService);

  private readonly chargeService = inject(ChargeService);

  readonly amounts = [100, 200, 300, 400, 500, 600];

  // จำนวนเงินที่กำลังเลือก
  selectedAmount = signal<number | null>(null);

  // จำนวนเงินที่ทำรายการสำเร็จล่าสุด
  successAmount = signal<number | null>(null);

  // Mock credit เริ่มต้น
  currentBalance = signal(100);

  isLoading = signal(false);

  errorMessage = signal<string | null>(null);

  successMessage = signal<string | null>(null);

  userName = signal<string | null>(null);

  transactionId = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    try {
      await this.liffService.init();

      if (!this.liffService.isLoggedIn()) {
        this.liffService.login();
        return;
      }

      const profile = await this.liffService.getProfile();

      this.userName.set(profile.displayName);
    } catch (error) {
      console.error('LIFF init error:', error);

      this.errorMessage.set('ไม่สามารถเชื่อมต่อ LINE ได้');
    }
  }

  selectAmount(amount: number): void {
    if (this.isLoading()) {
      return;
    }

    this.selectedAmount.set(amount);

    // เลือกใหม่แล้วซ่อนผลลัพธ์เก่า
    this.successAmount.set(null);
    this.successMessage.set(null);
    this.errorMessage.set(null);
  }

  confirm(): void {
    const amount = this.selectedAmount();

    if (amount === null || this.isLoading()) {
      return;
    }

    const idToken = this.liffService.getIdToken();

    if (!idToken) {
      this.errorMessage.set('ไม่พบข้อมูลการเข้าสู่ระบบ LINE');

      return;
    }

    this.isLoading.set(true);
    this.errorMessage.set(null);
    this.successMessage.set(null);
    this.successAmount.set(null);

    this.chargeService
      .charge(idToken, amount)
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
        }),
      )
      .subscribe({
        next: (response) => {
          const result = response.data;

          this.successAmount.set(result.amount);

          this.currentBalance.set(result.balance);

          this.transactionId.set(result.transactionId);

          this.successMessage.set(response.message);

          this.selectedAmount.set(null);
        },

        error: (error) => {
          console.error('Charge error:', error);

          this.errorMessage.set(error?.error?.message ?? 'เกิดข้อผิดพลาด กรุณาลองใหม่');
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
