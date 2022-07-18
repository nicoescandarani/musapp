import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  templateUrl: './modal.component.html',
  styleUrls: ['./modal.component.scss']
})
export class ModalComponent implements OnInit {

  @Input() message = '';
  @Output() acceptEmmit = new EventEmitter();
  @Output() cancelEmmit = new EventEmitter();

  constructor() { }

  ngOnInit(): void {
  }

  accept(): void {
    this.acceptEmmit.emit();
  }

  cancel(): void {
    this.cancelEmmit.emit();
  }

}
