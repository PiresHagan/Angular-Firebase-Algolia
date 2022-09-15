import { Component, OnInit, Input } from '@angular/core';
import { CHARITY, COMPANY, FUNDRAISER, MEMBER } from '../../constants/member-constant';
import { Article } from '../../interfaces/article.type';
import { Member } from '../../interfaces/member.type';
import { AuthorService } from '../../services/author.service';
@Component({
  selector: 'app-article-avatar',
  templateUrl: './article-avatar.component.html',
  styleUrls: ['./article-avatar.component.scss']
})
export class ArticleAvatarComponent implements OnInit {
  @Input() article: Article;
  userType: any;
  authorId: string;
  public isGuestPostEnabled = false;

  constructor(
    private authorService: AuthorService) {}

  ngOnInit(): void {
    this.authorId = this.article?.author?.id;
    if(this.article?.type === FUNDRAISER){
      this.userType = FUNDRAISER;
    } else if (this.article?.type === CHARITY){
      this.userType = CHARITY;
    } else if (this.article?.type === COMPANY){
      this.userType = COMPANY;
    } else{
      this.setUserType(this.article.author);
    }
  }

  setUserType(author){
    if (author.type === COMPANY)
    {
      this.userType = COMPANY;
    } 
    else if ( author.type === CHARITY)
    {
      this.userType = CHARITY;
    } 
    else if ( author.type === FUNDRAISER)
    {
      this.userType = FUNDRAISER;
    } 
    else 
    {
      this.authorService.getAuthorTypeById(author.id).subscribe((data: Array<Member>) => {
        this.userType = data[0]?.user_type ? data[0]?.user_type : data[0]?.type;

        if (data[0]?.is_guest_post_enabled) 
        {
          this.isGuestPostEnabled = data[0]?.is_guest_post_enabled;
        }
      });
    }

  }
 
}
