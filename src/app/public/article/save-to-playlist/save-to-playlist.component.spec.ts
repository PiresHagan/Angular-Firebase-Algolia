import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { SaveToPlaylistComponent } from "./save-to-playlist.component";

describe("SaveToPlaylistComponent", () => {
  let component: SaveToPlaylistComponent;
  let fixture: ComponentFixture<SaveToPlaylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaveToPlaylistComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaveToPlaylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
