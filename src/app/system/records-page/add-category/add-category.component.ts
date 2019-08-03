import {Component, EventEmitter, OnDestroy, OnInit, Output} from '@angular/core';
import {NgForm} from '@angular/forms';
import {Subscription} from 'rxjs';

import {CategoriesService} from '../../shared/services/categories.service';
import {Category} from '../../shared/models/category.model';



@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit, OnDestroy {

  subscibtion: Subscription;

  @Output() onCategoryAdd = new EventEmitter<Category>();

  constructor(private categoriesService: CategoriesService) { }

  ngOnInit() {
  }

  onSubmit(form: NgForm) {
    let { name, capacity} = form.value;
    if (capacity < 0) { capacity *= -1; }

    const category = new Category(name, capacity);

    this.subscibtion = this.categoriesService.addCategory(category)
      .subscribe(() => {
        form.reset();
        form.form.patchValue({capacity: 1});
        this.onCategoryAdd.emit(category);
      });
  }

  ngOnDestroy() {
    if (this.subscibtion) { this.subscibtion.unsubscribe(); }
  }

}
