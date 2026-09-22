import {
  Component,
  OnInit,
  inject,
  signal,
} from '@angular/core';

import { LiffService } from '../../services/liff.service';

@Component({
  selector: 'app-charge',
  standalone: true,
  templateUrl: './charge.component.html',
})
export class ChargeComponent implements OnInit {
  private readonly liffService = inject(LiffService);

  readonly amounts = [
    100,
    200,
    300,
    400,
    500,
    600,
  ];

  // -------------------------
  // State
  // -------------------------

  readonly selectedAmount = signal<number | null>(null);

  readonly isLiffReady = signal(false);

  readonly isInLine = signal(false);

  readonly isLoggedIn = signal(false);

  readonly userName = signal<string | null>(null);

  readonly isLoading = signal(false);

  readonly errorMessage = signal<string | null>(null);

  // -------------------------
  // Lifecycle
  // -------------------------

  async ngOnInit(): Promise<void> {
    await this.initializeLiff();
  }

  // -------------------------
  // LIFF
  // -------------------------

  private async initializeLiff(): Promise<void> {
    try {
      this.errorMessage.set(null);

      await this.liffService.init();

      // LIFF init สำเร็จ
      this.isLiffReady.set(true);

      // ตรวจว่าเปิดอยู่ใน LINE App หรือ browser ปกติ
      this.isInLine.set(
        this.liffService.isInClient(),
      );

      const loggedIn =
        this.liffService.isLoggedIn();

      this.isLoggedIn.set(loggedIn);

      // ถ้ายังไม่ login
      if (!loggedIn) {
        this.liffService.login();
        return;
      }

      // ดึง LINE Profile
      const profile =
        await this.liffService.getProfile();

      this.userName.set(
        profile.displayName,
      );

      console.log('LIFF initialized');

      console.log(
        'Is in LINE:',
        this.isInLine(),
      );

      console.log(
        'LINE user:',
        profile.displayName,
      );

      // ไม่ log ID Token เต็ม ๆ
      console.log(
        'Has ID Token:',
        Boolean(
          this.liffService.getIdToken(),
        ),
      );
    } catch (error) {
      console.error(
        'LIFF initialize error:',
        error,
      );

      this.errorMessage.set(
        'ไม่สามารถเชื่อมต่อกับ LINE ได้',
      );
    }
  }

  // -------------------------
  // Amount
  // -------------------------

  selectAmount(amount: number): void {
    this.selectedAmount.set(amount);
  }

  // -------------------------
  // Confirm
  // -------------------------

  confirm(): void {
    const amount =
      this.selectedAmount();

    if (amount === null) {
      return;
    }

    if (!this.isLiffReady()) {
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

    this.errorMessage.set(null);

    console.log(
      'Selected amount:',
      amount,
    );

    console.log(
      'Has ID Token:',
      Boolean(idToken),
    );

    /*
     * STEP ถัดไป:
     *
     * Angular จะส่ง:
     *
     * {
     *   idToken,
     *   amount
     * }
     *
     * ไปยัง Java Spring Boot
     *
     * ยังไม่ทำ API ในขั้นนี้
     */
  }

  // -------------------------
  // Back
  // -------------------------

  goBack(): void {
    if (this.liffService.isInClient()) {
      this.liffService.closeWindow();
      return;
    }

    window.history.back();
  }
}