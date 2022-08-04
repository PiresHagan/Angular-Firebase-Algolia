import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ShareButtonsDialogComponent } from "./share-buttons-dialog.component";

describe("ShareButtonsDialogComponent", () => {
  let component: ShareButtonsDialogComponent;
  let fixture: ComponentFixture<ShareButtonsDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShareButtonsDialogComponent],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShareButtonsDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it("should create", () => {
    expect(component).toBeTruthy();
  });
});
