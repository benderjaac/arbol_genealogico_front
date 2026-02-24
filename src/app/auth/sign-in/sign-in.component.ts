import { Component, inject } from '@angular/core';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';


@Component({
  selector: 'app-sign-in',
  imports: [Toast, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterModule],
  templateUrl: './sign-in.component.html',
  styleUrl: './sign-in.component.scss',
  providers: [MessageService]
})
export class SignInComponent {

  loginForm!: FormGroup;
  
  private _authService = inject(AuthService);
  private _activatedRoute = inject(ActivatedRoute);
  private _router = inject(Router);
  private messageService=inject(MessageService);

  private fb = inject(FormBuilder);

  ngOnInit(){
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      this._authService.signIn(this.loginForm.value).subscribe({
        next: ()=>{          
          const redirectURL = this._activatedRoute.snapshot.queryParamMap.get('redirectURL') || '/signed-in-redirect';
          this._router.navigate([redirectURL]);          
        },
        error: (error)=>{
          this.messageService.add(
            { severity: 'error', summary: 'Error de sesión', detail: error.error.error, life: 3000 }
          );          
        }
      });
    }
  } 
  
}
