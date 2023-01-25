import { Component, Input, OnInit } from '@angular/core';
import { Element } from 'src/app/model/element';

@Component({
  selector: 'element-card',
  templateUrl: './element-card.component.html',
  styleUrls: ['./element-card.component.css']
})
export class ElementCardComponent implements OnInit {

  @Input()
  element:Element | undefined;

  // @Input()
  // cardIndex:number | undefined;

  constructor() { }

  ngOnInit(): void {
  }

}
