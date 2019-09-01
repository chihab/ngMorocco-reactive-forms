import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, AbstractControl } from '@angular/forms';
import { of, Observable } from 'rxjs';
import { tap, delay, switchMap, filter, distinctUntilChanged, debounceTime } from 'rxjs/operators';

const isRequired = (control: FormControl) => {
  return control.value ? null : { isRequired: 'Username is required' }
};

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {

  userName: string;
  formGroup: FormGroup;
  formControl: FormControl;
  users$: Observable<any>;
  loading: boolean;

  constructor(fb: FormBuilder) {
    this.formControl = new FormControl('', [], [(control) => this.isAvailable(control)]);
    this.formGroup = fb.group({
      userName: this.formControl, // or fb.control('', [SYNV_VALIDATORS], [ASYNC_VALIDATORS])
      email: 'hello@gmail.com'
    })
  }

  isAvailable(control: AbstractControl) {
    return of(control.value ? null : { isAvailable: true }).pipe(
      delay(1000)
    );
  };

  searchUser(userName: string) {
    const users = ['user1', 'user2'].filter(u => u.indexOf(userName) !== -1)
    return of(users).pipe(
      delay(1000)
    )
  }

  ngOnInit() {
    this.users$ = this.formControl.valueChanges
      .pipe(
        debounceTime(400),
        distinctUntilChanged(),
        tap(_ => this.loading = true),
        filter(value => value.length > 2),
        switchMap((value) => this.searchUser(value)),
        tap(_ => this.loading = false)
      );
  }

  ngOnDestrory() {
    // async pipe does the unsubscription
  }

}