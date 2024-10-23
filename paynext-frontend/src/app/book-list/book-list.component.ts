import { Component, OnInit } from '@angular/core';
import { BookService } from '../services/payment.service';
import { Book } from '../models/payment.model';

@Component({
  selector: 'app-payment-list',
  templateUrl: './payment-list.component.html',
  styleUrls: ['./payment-list.component.scss']
})
export class BookListComponent implements OnInit {
  payments: Book[] = [];

  constructor(private paymentService: BookService) { }

  ngOnInit(): void {
    this.fetchBooks();
  }

  fetchBooks(): void {
    this.paymentService.getBooks().subscribe(data => {
      this.payments = data;
    });
  }
}
