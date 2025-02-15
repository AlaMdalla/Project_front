import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],})
export class AddPostComponent {
  postForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: [null, Validators.required],
      content: [null, [Validators.required, Validators.maxLength(5000)]],
      img: [null, Validators.required],
      postedBy: [null, Validators.required],
    });
  }

  createPost() {
    const data = this.postForm.value;

    this.postService.createNewPost(data).subscribe(
      res => {
        this.snackBar.open("Post Created Successfully!", "Close", { duration: 3000 });
        this.router.navigateByUrl("/");
      },
      error => {
        this.snackBar.open("Something went wrong!", "Close", { duration: 3000 });
      }
    );
  }
}
