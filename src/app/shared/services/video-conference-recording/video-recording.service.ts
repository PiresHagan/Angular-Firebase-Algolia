import { Injectable } from "@angular/core";
import * as RecordRtc from 'recordrtc'
import { Subject } from "rxjs";
@Injectable()
export class VideoRecording{
  private mediaStream:any;
  private _mediaStream = new Subject<any>();
  private recorder:any;
  private blob:any;
  private _blob = new Subject<any>();

  getMediaStream(){
    return this._mediaStream.asObservable();
  }

  getBlob(){
    return this._blob.asObservable();
  }

  startRecording(){
    this.handleRecording();
  }

  async handleRecording(){
    this.mediaStream=await navigator.mediaDevices.getDisplayMedia({
      video:true,
      audio:true
    });
    this._mediaStream.next(this.mediaStream);
    this.recorder=new RecordRtc(this.mediaStream, {type:'video'});
    this.recorder.startRecording();
  }

  stopRecording(){
    if(!this.recorder)
      return;
    this.recorder.stopRecording(()=>{
      this.blob=this.recorder.getBlob();
      this._blob.next(URL.createObjectURL(this.blob));
      this.mediaStream.stop();
      this.recorder.destroy();
    })

  }

  downloadRecording(){
    RecordRtc.invokeSaveAsDialog(this.blob, `${Date.now()}.webm`)
  }

  clearRecording(){
    this.blob=null;
    this.mediaStream=null;
    this.recorder=null;
  }
}
