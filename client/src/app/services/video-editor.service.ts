import { ElementRef, Injectable, ViewChild } from '@angular/core';
import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';

const baseURL = "https://unpkg.com/@ffmpeg/core-mt@0.12.6/dist/esm";

@Injectable({
  providedIn: 'root'
})

export class VideoEditorService {
  @ViewChild('video') videoRef!: ElementRef<HTMLVideoElement>;
  @ViewChild('message') messageRef!: ElementRef<HTMLDivElement>;

  loaded = false;
  ffmpegRef = new FFmpeg();

  constructor() {
    this.load();
  }

  async load(): Promise<void> {debugger;
    const ffmpeg = this.ffmpegRef;
    ffmpeg.on('log', ({ message }) => {
      if (this.messageRef) {
        this.messageRef.nativeElement.innerHTML = message;
        console.log(message);
      }
    });

    await ffmpeg.load({
      coreURL: await this.toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await this.toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    this.loaded = true;
  }

  async mergeVideos(inputFiles: string[]): Promise<void> {debugger;
      const ffmpeg = this.ffmpegRef;
      const outputFileName = 'merged-output.mp4';
        
      for (const file of inputFiles) {
        await ffmpeg.writeFile(file, await fetchFile(file));
        await ffmpeg.exec(['-i', file]);
      }
    
      await ffmpeg.exec([
        '-filter_complex',
        '[0:v][1:v]blend=all_expr=\'A*(if(eq(0,N/2),1,T))+B*(if(eq(0,N/2),T,1))\'',
        'output.mp4',
      ]);
    
      const mergedVideo = await ffmpeg.readFile('output.mp4');
      const videoPlayer = document.getElementById('videoPlayer') as HTMLMediaElement;
    
      videoPlayer.src = URL.createObjectURL(new Blob([mergedVideo], {type: 'video/mp4'}));
      console.log('Videos merged successfully.');
  }

  private async toBlobURL(url: string, type: string): Promise<string> {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(new Blob([blob], { type }));
  }
}











  


// async transcode(): Promise<void> {debugger;
//   const ffmpeg = this.ffmpegRef;
//   await ffmpeg.writeFile(
//     'input.webm',
//     await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s.webm')
//   );
//   await ffmpeg.writeFile(
//     'reversed.webm',
//     await fetchFile('https://raw.githubusercontent.com/ffmpegwasm/testdata/master/Big_Buck_Bunny_180_10s_reversed.webm')
//   );
//   await ffmpeg.exec([
//     '-i',
//     'input.webm',
//     '-i',
//     'reversed.webm',
//     '-filter_complex',
//     '[0:v][1:v]blend=all_expr=\'A*(if(eq(0,N/2),1,T))+B*(if(eq(0,N/2),T,1))\'',
//     'output.mp4',
//   ]);
//   const outputData = await ffmpeg.readFile('output.mp4');
//   if (this.videoRef) {
//     this.videoRef.nativeElement.src = URL.createObjectURL(new Blob([outputData], { type: 'video/mp4' }));
//   }
// }