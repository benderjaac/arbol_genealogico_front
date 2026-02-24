
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AuthService } from '../auth.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { AuthApiService } from 'app/core/services-api/auth-api.service';
import { PasswordModule } from 'primeng/password';
import { MessageService } from 'primeng/api';
import { Toast } from 'primeng/toast';

@Component({
  selector: 'app-register',
  imports: [Toast, ReactiveFormsModule, InputTextModule, ButtonModule, PasswordModule, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
  providers: [MessageService]
})
export class RegisterComponent {

  registerForm!: FormGroup;

  private _authService = inject(AuthService);
  private _router = inject(Router);
  private messageService=inject(MessageService);

  private fb = inject(FormBuilder);

  ngOnInit(){
    this.registerForm = this.fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  onSubmit() {
    if (this.registerForm.valid) {
      this._authService.register(this.registerForm.value).subscribe({
        next: ()=>{
          this._router.navigate(['/inicio']);
        },
        error: (error)=>{
          this.messageService.add(
            { severity: 'error', summary: 'Error de registro', detail: error.error.error, life: 3000 }
          ); 
        }
      });
    }
  } 

}
