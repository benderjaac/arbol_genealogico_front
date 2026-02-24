
import { Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserService } from 'app/core/services-api/user.service';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'app-users-create',
  imports: [AutoFocusModule, ReactiveFormsModule, InputTextModule, ButtonModule],
  templateUrl: './users-create.component.html',
})
export class UsersCreateComponent {
  @Output() msjEvent = new EventEmitter<{tipo:string, mensaje:string}>();
  @Output() cerrarDialog = new EventEmitter<boolean>();

  @ViewChild('usernameInput') usernameInput!: ElementRef;
  
  registerForm!: FormGroup;

  constructor(
    private _userService: UserService,
    private _fb: FormBuilder,
  ){    
  }

  ngOnInit(){
    
    this.registerForm = this._fb.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      perfilId: [1],
    });
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.usernameInput?.nativeElement?.focus();
    }, 200);
  }

  onSubmit() {
    if (this.registerForm.valid) {
      
      this._userService.createUser(this.registerForm.value).subscribe({
        
        next: (res)=>{
          this.msjEvent.emit({tipo:'success', mensaje:res.message});
          this.cerrarDialog.emit(true);
        },
        error: (error)=>{
          this.msjEvent.emit({tipo:'error', mensaje:error.error?.error || "Error desconocido"});
        }
      });
    }
  } 
  
}
