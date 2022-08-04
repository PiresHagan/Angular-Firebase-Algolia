import { Component, Input, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { AuthService } from "src/app/shared/services/authentication.service";
import { PlaylistService } from "../services/playlist.service";

@Component({
  selector: "app-save-to-playlist",
  templateUrl: "./save-to-playlist.component.html",
  styleUrls: ["./save-to-playlist.component.css"],
})
export class SaveToPlaylistComponent implements OnInit {
  @Input() isLoggedIn: boolean;
  @Input() url: string;
  @Input() title: string;
  playListForm: FormGroup;
  playlists: any[] = [];
  playlistVisible: boolean;
  isCreate: boolean;
  isLoaded: boolean;
  isOkLoading: boolean;
  isAddLoading: boolean;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private playlistService: PlaylistService
  ) {}

  ngOnInit(): void {
    this.playListForm = this.fb.group({
      name: [null, [Validators.required]],
    });
  }

  openPlaylist() {
    if (!this.isLoggedIn) {
      this.router.navigateByUrl("/auth/login");
    } else {
      this.getPlaylists();
    }
  }

  getPlaylists() {
    this.playlistVisible = true;
    this.playlistService.getPlaylists().subscribe((playlists) => {
      this.isLoaded = true;
      this.playlists = playlists;
    });
  }

  closePlaylist() {
    this.playlistVisible = false;
  }

  showForm() {
    this.isCreate = true;
    console.warn(this.playlists);
    if (this.playlists.length) {
      this.playlists.forEach((playlist) => {
        playlist.checked = false;
      });
    }
  }

  handleCancel() {
    this.isCreate = false;
  }

  handleCreate() {
    if (this.playListForm.valid) {
      this.addPlaylist();
    } else {
      Object.values(this.playListForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  addPlaylist() {
    this.isOkLoading = true;
    this.playlistService.postPlaylist(this.playListForm.value).subscribe(() => {
      this.playListForm.controls.name.setValue("");
      this.getPlaylists();
      this.isOkLoading = false;
      this.isCreate = false;
    });
  }

  updatePlaylist() {
    if (!this.playlists.some((playlist) => playlist.checked)) {
      this.playlistVisible = false;
      return;
    }
    this.isAddLoading = true;
    this.playlists.forEach((playlist) => {
      if (playlist.checked) {
        playlist.checked = false;
        if (playlist.links) {
          playlist.links.push({
            title: this.title,
            url: `${window.location.href}?url=${this.url}`,
          });
        } else {
          playlist.links = [];
          playlist.links.push({
            title: this.title,
            url: `${window.location.href}?url=${this.url}`,
          });
        }

        this.playlistService.putPlaylist(playlist).subscribe((res) => {
          this.isAddLoading = false;
          this.playlistVisible = false;
        });
      }
    });
  }
}
