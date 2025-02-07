import { Component ,OnInit, OnDestroy, ChangeDetectorRef} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { first, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}


@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.scss'
})


export class ChangePasswordComponent implements OnInit{

  changePasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  returnUrl: string;

  // private fields
  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router, private route: ActivatedRoute,) {
    this.isLoading$ = this.authService.isLoading$;
  }

  ngOnInit(): void {
    this.initForm();

  }

  initForm() {
    this.changePasswordForm = this.fb.group({
      password: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(320), 
        ])
      ],
      otp: ['',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });

  }

  submit() {
      this.authService
      .changePassword(this.changePasswordForm.value)
      .pipe(first())
      .subscribe((result:any) => {
        if (result) {
          this.router.navigate(["auth/login"]);
        } 
      });
  }


}
