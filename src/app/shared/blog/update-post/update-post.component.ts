import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css']
})
export class UpdatePostComponent implements OnInit{
  postForm!: FormGroup;
  postId!: number;
  message: string = '';
  retrievedImage: string | undefined;
  selectedFile!: File;
  retrieveResonse: any;
  img: any;
  
  previewUrl!: string | ArrayBuffer | null;

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient
  ) { }

  ngOnInit() {
    // Récupérer l'id du post à partir de l'URL
    this.route.paramMap.subscribe(params => {
      this.postId = +params.get('id')!; // Assurez-vous que l'id est un nombre
      this.loadPostData();
    });

    // Initialisation du formulaire
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      postedBy: ['', Validators.required],
      content: ['', Validators.required],
      category: ['', Validators.required],
      img: ['']
      
    });
  }

  // Charger les données du post à partir du service
  loadPostData() {
    this.postService.getPostById(this.postId).subscribe(post => {
      // Préremplir les champs du formulaire avec les données du post
      this.postForm.patchValue({
        title: post.title,
        postedBy: post.postedBy,
        content: post.content,
        img: post.img,
        category: post.category
      });
      // Charger l'image si nécessaire
      if (post.img) {
        this.retrievedImage = post.img; // Vous pouvez adapter cela à votre logique d'image
      }
    }, error => {
      this.snackBar.open("Failed to load post data!", "Close", { duration: 3000 });
    });
  }

  // Fonction pour mettre à jour le post
  updatePost() {
    if (this.postForm.invalid) {
      this.snackBar.open("Please fill all required fields!", "Close", { duration: 3000 });
      return;
    }
  
    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value || '');
    formData.append('postedBy', this.postForm.get('postedBy')?.value || '');
    formData.append('content', this.postForm.get('content')?.value || '');
    formData.append('category', this.postForm.get('category')?.value || '');
  
    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile);
    }
  
    this.postService.updatePost(this.postId, formData).subscribe({
      next: () => {
        this.snackBar.open("Post updated successfully!", "Close", { duration: 3000 });
      },
      error: (error) => {
        console.error("Error updating post:", error);
        this.snackBar.open("Failed to update post!", "Close", { duration: 3000 });
      }
    });
  }
  

  // Méthode appelée lorsque l'utilisateur sélectionne un fichier
  public onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];

      // Générer une prévisualisation de l'image
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    }
  }
}
