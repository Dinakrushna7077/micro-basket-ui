import { Component, computed, input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './page-not-found.html',
  styleUrl: './page-not-found.css'
})

export class PageNotFound {}