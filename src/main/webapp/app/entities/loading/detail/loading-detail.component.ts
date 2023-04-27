import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILoading } from '../loading.model';

@Component({
  selector: 'jhi-loading-detail',
  templateUrl: './loading-detail.component.html',
})
export class LoadingDetailComponent implements OnInit {
  loading: ILoading | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ loading }) => {
      this.loading = loading;
    });
  }

  previousState(): void {
    window.history.back();
  }
}
