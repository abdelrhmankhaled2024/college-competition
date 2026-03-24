import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-winners',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './winners.html',
  styleUrls: ['./winners.scss']
})
export class Winners {}
