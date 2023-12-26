import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent implements OnInit{
  @Input() scenes: any[] = [];
  rulerMarkers: number[] = [];

  ngOnInit(): void {
    this.generateRulerMarkers();
  }
  
  private generateRulerMarkers(): void {
    for (let i = 1; i <= 15; i++) {
      this.rulerMarkers.push(i);
    }
  }
}
