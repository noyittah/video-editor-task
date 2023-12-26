import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponentComponent } from './components/header-component/header-component.component';
import { TrackComponent } from './components/track/track.component';
import { EditorComponent } from './components/editor/editor.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponentComponent,
    TrackComponent,
    EditorComponent
  ],
  imports: [
    BrowserModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}