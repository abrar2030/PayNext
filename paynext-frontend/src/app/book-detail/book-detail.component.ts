import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BookService } from '../services/payment.service';
import { Book } from '../models/payment.model';

@Component({
  selector: 'app-payment-detail',
  templateUrl: './payment-detail.component.html',
  styleUrls: ['./payment-detail.component.scss']
})
export class BookDetailComponent implements OnInit {
  payment!: Book;

  constructor(
    private route: ActivatedRoute,
    private paymentService: BookService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.fetchBookDetail(id);
    }
  }

  fetchBookDetail(id: string): void {
    this.paymentService.getBookById(id).subscribe(data => {
      this.payment = data;
    });
  }
}
