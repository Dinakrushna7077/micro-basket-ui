import { Component,inject } from '@angular/core';
import { RouterLink,Router } from '@angular/router';

@Component({
  selector: 'app-server-error',
  imports: [RouterLink],
  templateUrl: './server-error.html',
  styleUrl: './server-error.css',
})
export class ServerError {
  private router = inject(Router);
  reloadPage(): void {
    this.router.navigate(['/']);
  }
}

