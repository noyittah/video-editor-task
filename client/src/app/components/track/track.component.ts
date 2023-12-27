import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { TOTAL_DURATION } from '../../constants';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrl: './track.component.css'
})
export class TrackComponent implements OnInit{
  scenes: any[] = [];
  rulerMarkers: number[] = [];
  draggedScene: any;
  totalScenesDuration: number = 0;

  constructor(
    private sceneService: SceneService) { }

  ngOnInit(): void {
    this.generateRulerMarkers();
    this.sceneService.draggedScene$.subscribe((scene) => {
      if (scene) {
        this.totalScenesDuration += scene?.duration;
        if (this.totalScenesDuration <= TOTAL_DURATION) {
          this.draggedScene = scene;
          this.scenes.push(this.draggedScene);
        }
      }
    });
  }
  
  private generateRulerMarkers(): void {
    for (let i = 1; i <= TOTAL_DURATION; i++) {
      this.rulerMarkers.push(i);
    }
  }

  calculateWidth(scene: any): string {
    const percent = (scene?.duration / TOTAL_DURATION) * 100;
    return percent + '%';
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex);
  }
}
