import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {
    isLogedin:boolean = false;
    userEmail="user@mail.com"
  constructor(private router: Router) {}

  navigateTo(path: string) {
    this.router.navigate([path]);
  }

  toggleNavbar() {
    this.isLogedin = !this.isLogedin;
  }

  logout(){
    this.isLogedin = false;
    this.router.navigate(['login']);
  }
}
