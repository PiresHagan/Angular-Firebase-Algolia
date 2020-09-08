import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Article } from 'src/app/shared/interfaces/article.type';
import { AuthService } from 'src/app/shared/services/authentication.service';
import { BackofficeArticleService } from '../../shared/services/backoffice-article.service';
@Component({
  selector: 'app-create-post',
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.scss']
})
export class CreatePostComponent implements OnInit {

  current = 0;

  index = 'First-content';
  articles: Article[];
  lastVisible: any = null;
  userDetails;
  loading: boolean = true;

  pre(): void {
    this.current -= 1;
    this.changeContent();
  }

  next(): void {
    this.current += 1;
    this.changeContent();
  }

  done(): void {
    console.log('done');
  }

  changeContent(): void {
    switch (this.current) {
      case 0: {
        this.index = 'First-content';
        break;
      }
      case 1: {
        this.index = 'Second-content';
        break;
      }
      case 2: {
        this.index = 'third-content';
        break;
      }
      default: {
        this.index = 'error';
      }
    }
  }
  constructor(
    public authService: AuthService,
    public articleService: BackofficeArticleService,
  ) { }

  ngOnInit(): void {
    this.authService.getAuthState().subscribe(async (user) => {
      if (!user)
        return;
      this.userDetails = await this.authService.getLoggedInUserDetails();
      if (this.userDetails) {
        this.articleService.getArticlesByUser(this.userDetails.id).subscribe((data) => {
          this.articles = data.articleList;
          this.lastVisible = data.lastVisible;
          this.loading = false;
        });
      }
    })
  }

}
