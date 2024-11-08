import {  Component,  OnInit,  Input,  forwardRef,  ViewChild,  AfterViewInit,  Injector, inject} from "@angular/core";
import {  NgbTimeStruct,  NgbDateStruct,  NgbPopoverConfig,  NgbPopover,  NgbDatepicker, NgbDatepickerConfig} from "@ng-bootstrap/ng-bootstrap";
import {  NG_VALUE_ACCESSOR,  ControlValueAccessor,  NgControl} from "@angular/forms";
import { DatePipe } from "@angular/common";
import { DateTimeModel } from "./date-time.model";
import { noop } from "rxjs";

@Component({
  selector: "app-date-time-picker",
  templateUrl: "./date-time-picker.component.html",
  styleUrls: ["./date-time-picker.component.scss"],
  providers: [
    DatePipe,
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => DateTimePickerComponent),
      multi: true
    }
  ]
})
export class DateTimePickerComponent
  implements ControlValueAccessor, OnInit, AfterViewInit {
  
  @Input()  dateString: string;
  @Input()  inputDatetimeFormat = "M/d/yyyy H:mm:ss";
  @Input()  hourStep = 1;
  @Input()  minuteStep = 15;
  @Input()  secondStep = 30;
  @Input()  seconds = true;
  @Input()  disabled = false;

  private showTimePickerToggle = false;
  private datetime: DateTimeModel = new DateTimeModel();
  private firstTimeAssign = true;
  minDate!: NgbDateStruct;
  maxDate!: NgbDateStruct;

  @ViewChild(NgbPopover, { static: true })

  private popover: NgbPopover;
  private onTouched: () => void = noop;
  private onChange: (_: any) => void = noop;
  private ngControl: NgControl | null = null;


  constructor(private config: NgbPopoverConfig, private inj: Injector) {
    config.autoClose = "outside";
    config.placement = "auto";
  }

  ngOnInit(): void {
    console.log(">ngOnInit");
    this.ngControl = this.inj.get(NgControl);
  }

  ngAfterViewInit(): void {
    console.log(">ngAfterViewInit");
    this.popover.hidden.subscribe($event => {
      this.showTimePickerToggle = false;
    });
  }

  writeValue(newModel: string) {
    console.log(">writeValue");
    if (newModel) {
      this.datetime = Object.assign(
        this.datetime,
        DateTimeModel.fromLocalString(newModel)
      );
      this.dateString = newModel;
      this.setDateStringModel();
    } else {
      this.datetime = new DateTimeModel();
    }
  }

  disableWeekends = (date: NgbDateStruct) => {
    const jsDate = new Date(date.year, date.month - 1, date.day);
    const day = jsDate.getDay();
    return day == 0 || day == 6; // Return true for weekdays, false for weekends
  };


  registerOnChange(fn: any): void {
    console.log(">registerOnChange");
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    console.log(">registerOnTouched");
    this.onTouched = fn;
  }

  toggleDateTimeState($event) {
    console.log(">toggleDateTimeState");
    this.showTimePickerToggle = !this.showTimePickerToggle;
    $event.stopPropagation();
  }

  setDisabledState?(isDisabled: boolean): void {
    console.log(">setDisabledState");
    this.disabled = isDisabled;
  }

  onInputChange($event: any) 
  {
    console.log(">onInputChange");
    const value = $event.target.value;
    const dt = DateTimeModel.fromLocalString(value);

    if (dt) {
      this.datetime = dt;
      this.setDateStringModel();
    } else if (value.trim() === "") {
      this.datetime = new DateTimeModel();
      this.dateString = "";
      this.onChange(this.dateString);
    } else {
      this.onChange(value);
    }
  }

  onDateChange($event: string | NgbDateStruct, dp: NgbDatepicker) {

    console.log(">onDateChange");
    const date = new DateTimeModel($event);

    if (!date) {
      this.dateString = this.dateString;
      return;
    }

    if (!this.datetime) {
      this.datetime = date;
    }

    this.datetime.year = date.year;
    this.datetime.month = date.month;
    this.datetime.day = date.day;

    const adjustedDate = new Date(this.datetime.toString());
    if (this.datetime.timeZoneOffset !== adjustedDate.getTimezoneOffset()) {
      this.datetime.timeZoneOffset = adjustedDate.getTimezoneOffset();
    }

    this.setDateStringModel();
  }

  onTimeChange(event: NgbTimeStruct) {

    console.log(">onTimeChange");
    this.datetime.hour = event.hour;
    this.datetime.minute = event.minute;
    this.datetime.second = event.second;

    this.setDateStringModel();
  }

  setDateStringModel() {

    console.log(">setDateStringModel");
    this.dateString = this.datetime.toString();

    
    if (!this.firstTimeAssign) {
      this.onChange(this.dateString);
    } else {
      // Skip very first assignment to null done by Angular
      if (this.dateString !== null) {
        this.firstTimeAssign = false;
      }
    }
  }

  inputBlur($event) {
    console.log(">inputBlur");
    this.onTouched();
  }
}
