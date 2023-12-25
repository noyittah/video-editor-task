import { NgModule } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { AppComponent } from './app.component';



@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
  ],
  imports: [
  ],

  bootstrap: [AppComponent],
})
export class AppModule { }
