
import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'jhi-country-dropdown',
  templateUrl: './country-dropdown.component.html',
  styleUrls: ['./country-dropdown.component.scss']
})

export class CountryDropdownComponent implements OnInit{

  
  title = 'json-read-example';
  items:any;
  url: string = '/assets/Countries.json';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http.get(this.url).subscribe(res => {
      this.items = res;
    });
  }
}


// const countries = [];
// for (let i = 0; i < resp.length; ++i) {
//     const country = resp[i];
//     countries.push({ text: country.text, value: country.value });
// }
// this.myData = countries;


