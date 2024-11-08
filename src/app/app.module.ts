import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";

import { AppComponent } from "./app.component";
import { HelloComponent } from "./hello.component";
import { NgbModule } from "@ng-bootstrap/ng-bootstrap";

import {
  FaIconLibrary,
  FontAwesomeModule
} from "@fortawesome/angular-fontawesome";
import { faCalendar, faClock } from "@fortawesome/free-regular-svg-icons";
import { DateTimePickerComponent } from "./date-time-picker/date-time-picker.component";

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    NgbModule,
    FontAwesomeModule,
    ReactiveFormsModule
  ],
  declarations: [AppComponent, HelloComponent, DateTimePickerComponent],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(library: FaIconLibrary) {
    library.addIcons(faCalendar, faClock);
  }
}
