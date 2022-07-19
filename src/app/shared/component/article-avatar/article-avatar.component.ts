import { Component, OnInit, Input } from '@angular/core';
import { Article } from '../../interfaces/article.type';
import { AuthorService } from '../../services/author.service';
@Component({
  selector: 'app-article-avatar',
  templateUrl: './article-avatar.component.html',
  styleUrls: ['./article-avatar.component.scss']
})
export class ArticleAvatarComponent implements OnInit {
  @Input() article: Article;
  authorDetail: any;
  userType: any;
  authorId: string;
  public isGuestPostEnabled = false;

  constructor(
    private authorService: AuthorService) {}

  ngOnInit(): void {
    this.authorId = this.article?.author?.id;
    this.getUsertype(this.authorId)
    this.authorService.getAuthorTypeById(this.authorId).subscribe(data => {
      this.authorDetail = data;
      if(this.authorDetail[0]?.is_guest_post_enabled) {
        this.isGuestPostEnabled = this.authorDetail[0]?.is_guest_post_enabled;
      }
    })
  }

  getUsertype(authorId){
    this.authorService.getAuthorTypeById(authorId).subscribe(data => {
      this.authorDetail = data;
      if(this.authorDetail[0]?.user_type) {
        return this.userType = this.authorDetail[0]?.user_type;
      }
    })
  }
 
}
