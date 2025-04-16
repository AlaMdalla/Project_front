
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { PostService } from 'src/app/Services/post.service';
import { UsersService } from 'src/app/Services/users.service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css'],
  standalone: false,
})
export class AddPostComponent {
  postForm!: FormGroup;
  selectedFile!: File;
  previewUrl!: string | ArrayBuffer | null;
  userId?: number;
  isToxicContent: boolean = false;
  toxicityScore?: number;
  toxicityErrorMessage: string = ''; // Store the full error message for display

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private snackBar: MatSnackBar,
    private postService: PostService,
    private usersService: UsersService
  ) {}

  async ngOnInit() {
    this.postForm = this.fb.group({
      title: [null, [Validators.required, Validators.maxLength(100)]],
      content: [null, [Validators.required, Validators.minLength(10), Validators.maxLength(5000)]],
      category: [null, [Validators.required, Validators.maxLength(50)]],
    });

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error("No Token Found");
      }
      const profileInfo = await this.usersService.getYourProfile(token);
      this.userId = profileInfo.ourUsers.id;
      console.log('User ID:', this.userId);
    } catch (error: any) {
      console.log(error.message);
      this.snackBar.open("Erreur lors de la récupération du profil", "Fermer", { duration: 3000 });
    }
  }

  createPost() {
    if (!this.userId) {
      this.snackBar.open("Utilisateur non authentifié", "Fermer", { duration: 3000 });
      return;
    }

    if (!this.selectedFile) {
      this.snackBar.open("Veuillez sélectionner une image", "Fermer", { duration: 3000 });
      return;
    }

    // Reset the toxicity error state before submitting
    this.isToxicContent = false;
    this.toxicityScore = undefined;
    this.toxicityErrorMessage = '';

    const formData = new FormData();
    formData.append('title', this.postForm.get('title')?.value);
    formData.append('content', this.postForm.get('content')?.value);
    formData.append('category', this.postForm.get('category')?.value);
    formData.append('imageFile', this.selectedFile, this.selectedFile.name);

    this.postService.createNewPost(this.userId, formData).subscribe({
      next: (res) => {
        this.snackBar.open("Post créé avec succès !", "Fermer", { duration: 3000 });
        this.router.navigateByUrl("/Posts");
      },
      error: (error) => {
        const errorMessage = error.error?.message || error.message || "Une erreur est survenue !";
        // Check if the error is related to toxicity (either content is toxic or API failure)
        if (error.status === 500 || errorMessage.includes("Le contenu est trop toxique") || errorMessage.includes("Failed to analyze toxicity")) {
          this.isToxicContent = true;
          this.toxicityErrorMessage = errorMessage.includes("Le contenu est trop toxique modifier le contenue")
            
          // Extract the toxicity score if available
          const scoreMatch = errorMessage.match(/score : ([\d.]+)/);
          this.toxicityScore = scoreMatch ? parseFloat(scoreMatch[1]) : undefined;
        } else {
          this.snackBar.open(errorMessage, "Fermer", { duration: 3000 });
        }
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

  onContentChange() {
    // Clear the toxicity error when the user starts typing
    this.isToxicContent = false;
    this.toxicityScore = undefined;
    this.toxicityErrorMessage = '';
  }

  onCancel() {
    this.router.navigateByUrl('/Posts');
  }
}
