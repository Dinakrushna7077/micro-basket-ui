import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {
  values = [
    {
      icon: 'bi-lightning-charge-fill',
      title: 'Fast Delivery',
      desc: 'We get your orders to your doorstep in record time, every time.'
    },
    {
      icon: 'bi-shield-check',
      title: 'Quality Assured',
      desc: 'Every product is handpicked and quality-checked before it reaches you.'
    },
    {
      icon: 'bi-currency-rupee',
      title: 'Best Prices',
      desc: 'Competitive pricing with regular deals and discounts for our customers.'
    },
    {
      icon: 'bi-headset',
      title: '24/7 Support',
      desc: 'Our support team is always ready to help with any questions or issues.'
    }
  ];
}