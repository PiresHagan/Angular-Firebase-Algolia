import { Component, OnInit } from '@angular/core';
import { Article } from 'src/app/shared/interfaces/article.type';

@Component({
  selector: 'app-article-content',
  templateUrl: './article-content.component.html',
  styleUrls: ['./article-content.component.scss']
})
export class ArticleContentComponent implements OnInit {

  listOfOption: Array<{ label: string; value: string }> = [];
  tagValue = ['a10', 'c12', 'tag'];
  article: Article = {};

  editorConfig = {
      toolbar: [
          ['bold', 'italic', 'underline', 'strike'],        
          ['blockquote', 'code-block'],
          [{ 'header': 2 }, { 'header': 3 }],               
          [{ 'list': 'ordered'}, { 'list': 'bullet' }],
          [{ 'size': ['small', false, 'large', 'huge'] }],  
          [{ 'align': [] }],
          ['link', 'image', 'video']                        
      ]
  };

  constructor() { }

  ngOnInit() {
    const children: Array<{ label: string; value: string }> = [];
    for (let i = 10; i < 36; i++) {
      children.push({ label: i.toString(36) + i, value: i.toString(36) + i });
    }
    this.listOfOption = children;
  }

}
