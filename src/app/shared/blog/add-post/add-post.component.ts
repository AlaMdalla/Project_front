import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
})
export class AddPostComponent {
  postForm!: FormGroup;
  selectedFile!: File;
  previewUrl!: string | ArrayBuffer | null;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      content: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      postedBy: [null, [
        Validators.required,
        Validators.minLength(2),
        Validators.maxLength(50),
        Validators.pattern('^[a-zA-Z ]*$') 
      ]],
      category: [null, [Validators.required, Validators.maxLength(50)]],
    });
  }

  createPost() {
    if (!this.selectedFile) {
      this.snackBar.open("Veuillez sélectionner une image", "Fermer", { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('content', this.postForm.get('content')?.value);
    formData.append('postedBy', this.postForm.get('postedBy')?.value);
    formData.append('category', this.postForm.get('category')?.value);
    formData.append('imageFile', this.selectedFile, this.selectedFile.name);

    this.postService.createNewPost(formData).subscribe({
      next: (res) => {
        this.snackBar.open("Post créé avec succès !", "Fermer", { duration: 3000 });
        this.router.navigateByUrl("/");
      },
      error: (error) => {
        this.snackBar.open("Une erreur est survenue !", "Fermer", { duration: 3000 });
        console.error(error);
      }
    });
  }

  public onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}