import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { SceneService } from '../../services/scene.service';
import { TOTAL_DURATION } from '../../constants';
import { VideoEditorService } from '../../services/video-editor.service';

@Component({
  selector: 'app-track',
  templateUrl: './track.component.html',
  styleUrls: ['./track.component.css']
})
export class TrackComponent implements OnInit {
  scenes: any[] = [];
  rulerMarkers: number[] = [];
  draggedScene: any;
  totalScenesDuration: number = 0;
  shouldPlayMergedVideo: boolean = false;
  zoomIndex: number = 1;

  constructor(
    private sceneService: SceneService,
    private videoEditorService: VideoEditorService,
  ) {}

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

  onClickZoomIn(): void {
    if (this.zoomIndex < 3) {
      this.zoomIndex += 0.1;
    }
  }

  onClickZoomOut(): void {
    if (this.zoomIndex > 0.2) {
      this.zoomIndex -= 0.1;
    }
  }

  drop(event: CdkDragDrop<string[]>): void {
    moveItemInArray(this.scenes, event.previousIndex, event.currentIndex);
  }

  async onClickPlayBtn(): Promise<void> {
    const inputFiles = this.scenes.map((scene) => scene.url).filter((url) => !!url);

    // const tempOutputFileName = 'temp_merged_video.mp4';

    try {
      await this.videoEditorService.mergeVideos(inputFiles);

      // await this.videoEditorService.mergeVideos(inputFiles);
      this.shouldPlayMergedVideo = true;

      // // Save the merged video Blob to local storage
      // const mergedVideoBlob = await this.videoEditorService.getVideoBlob(`assets/videos/${tempOutputFileName}`);
      // localStorage.setItem('mergedVideoBlob', JSON.stringify(mergedVideoBlob));
    } catch (error) {
      console.error('Error concatenating videos:', error);
    }

    if (inputFiles.length === 0) {
      console.error('No valid video files found.');
      return;
    }
  }
}

