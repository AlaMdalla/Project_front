import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';
import { UsersService } from 'src/app/Services/users.service';
import { ReactiveFormsModule } from '@angular/forms'; // 👈 important

@Component({
  selector: 'app-update-post',
  templateUrl: './update-post.component.html',
  styleUrls: ['./update-post.component.css'],
  standalone: true,
  imports:[ReactiveFormsModule]
})
export class UpdatePostComponent implements OnInit {
  postForm!: FormGroup;
  postId!: number;
  message: string = '';
  retrievedImage: string | undefined;
  selectedFile!: File;
  retrieveResponse: any;
  img: any;
  previewUrl!: string | ArrayBuffer | null;
  userId?: number; // Add userId for authenticated user

  constructor(
    private route: ActivatedRoute,
    private postService: PostService,
    private fb: FormBuilder,
    private snackBar: MatSnackBar,
    private httpClient: HttpClient,
    private router: Router,
    private usersService: UsersService // Inject UsersService
  ) { }

  async ngOnInit() {
    // Fetch userId from profile
    try {
      const token = localStorage.getItem('token');
      if (token) {
        const profileInfo = await this.usersService.getYourProfile(token);
        this.userId = profileInfo.ourUsers.id;
        console.log('User ID:', this.userId);
      } else {
        throw new Error("No token found");
      }
    } catch (error: any) {
      console.log('Error fetching user profile:', error.message);
      this.snackBar.open("Vous devez être connecté pour modifier un post", "Close", { duration: 3000 });
    }

    // Récupérer l'id du post à partir de l'URL
    this.route.paramMap.subscribe(params => {
      this.postId = +params.get('id')!; // Assurez-vous que l'id est un nombre
      this.loadPostData();
    });

    // Initialisation du formulaire
    this.postForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      category: ['', [Validators.required, Validators.maxLength(50)]],
      img: [''] // Optional, not validated
    });
  }

  // Charger les données du post à partir du service
  loadPostData() {
    if (!this.userId) {
      this.snackBar.open("Connexion requise pour charger le post", "Close", { duration: 3000 });
      return;
    }

    this.postService.getPostById(this.userId, this.postId).subscribe(
      post => {
        // Préremplir les champs du formulaire avec les données du post
        this.postForm.patchValue({
          title: post.title,
          content: post.content,
          category: post.category
        });
        // Charger l'image si nécessaire
        if (post.img) {
          this.retrievedImage = 'data:image/jpeg;base64,' + post.img; // Adjust based on your API response structure
        }
      },
      error => {
        this.snackBar.open("Failed to load post data!", "Close", { duration: 3000 });
      }
    );
  }

  // Fonction pour mettre à jour le post
  updatePost() {
    if (!this.userId) {
      this.snackBar.open("Vous devez être connecté pour modifier un post", "Close", { duration: 3000 });
      return;
    }

    if (this.postForm.invalid) {
      this.snackBar.open("Please fill all required fields!", "Close", { duration: 3000 });
      console.log('Form is invalid', this.postForm.errors);
      return;
    }

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')!.value);
    formData.append('content', this.postForm.get('content')!.value);
    formData.append('category', this.postForm.get('category')!.value);

    if (this.selectedFile) {
      formData.append('imageFile', this.selectedFile, this.selectedFile.name);
    }

    console.log('Submitting update with data:', formData); // Debug log
    this.postService.updatePost(this.userId, this.postId, formData).subscribe({
      next: () => {
        this.snackBar.open("Post updated successfully!", "Close", { duration: 3000 });
        this.router.navigateByUrl('/');
      },
      error: (error) => {
        console.error("Error updating post:", error);
        if (error.status === 403) {
          this.snackBar.open("Vous n'êtes pas autorisé à modifier ce post", "Close", { duration: 3000 });
        } else {
          this.snackBar.open("Failed to update post!", "Close", { duration: 3000 });
        }
      }
    });
  }

  // Méthode appelée lorsque l'utilisateur sélectionne un fichier
  public onFileChanged(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        this.previewUrl = reader.result;
      };
      reader.readAsDataURL(this.selectedFile);
    } else {
      this.selectedFile = null!;
      this.previewUrl = null;
    }
  }

  // Public method to handle cancel action
  onCancel() {
    this.router.navigateByUrl('/');
  }
}