import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  Input,
} from "@angular/core";

@Component({
  selector: "app-share-buttons-dialog",
  templateUrl: "./share-buttons-dialog.component.html",
  styleUrls: ["./share-buttons-dialog.component.css"],
})
export class ShareButtonsDialogComponent implements AfterViewInit {
  @Input() url: string = "";
  sharedUrl: string;
  isVisible = false;

  constructor(private cdref: ChangeDetectorRef) {}

  ngAfterViewInit(): void {
    this.sharedUrl = `${window.location.href}?url=${this.url}`;
    this.cdref.detectChanges();
  }

  showModal(): void {
    this.isVisible = true;
  }

  close(): void {
    this.isVisible = false;
  }
}
