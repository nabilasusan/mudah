import { CommonModule } from '@angular/common';  // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
import { Component, OnInit, inject } from '@angular/core';  // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
import { HttpClient } from '@angular/common/http';  // Mengimpor HttpClient untuk melakukan HTTP request
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';  // Tambahkan untuk menangani formulir
import * as bootstrap from 'bootstrap';
import { NgxPaginationModule } from 'ngx-pagination'; // Impor modul ngx-pagination

@Component({
  selector: 'app-mahasiswa',  // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-fakultas></app-fakultas>
  standalone: true,  // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
  imports: [CommonModule, ReactiveFormsModule, NgxPaginationModule],  // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
  templateUrl: './mahasiswa.component.html',  // Path ke file template HTML untuk komponen ini
  styleUrl: './mahasiswa.component.css'  // Path ke file CSS untuk komponen ini
})
export class MahasiswaComponent implements OnInit {  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
  mahasiswa: any[] = [];  // Mendeklarasikan properti fakultas yang akan menyimpan data yang diterima dari API
  prodi: any[]= [];
  currentPage = 1;
  itemsPerPage = 5;

  apiMahasiswaUrl = 'http://localhost:3000/api/mahasiswa';  // URL API yang digunakan untuk mendapatkan data fakultas
  apiProdiUrl = 'http://localhost:3000/api/prodi';
  isLoading = true;  // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil

  mahasiswaForm: FormGroup;  // Tambahkan untuk mengelola data formulir
  isSubmitting = false;  // Status untuk mencegah double submit

  private http = inject(HttpClient);  // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)

  private fb = inject(FormBuilder);  // Inject FormBuilder untuk membuat FormGroup

  constructor() {
    // Inisialisasi form dengan kontrol nama dan singkatan
    this.mahasiswaForm = this.fb.group({
      npm: [''],
      nama: [''],
      jenis_kelamin: [''],
      asal_sekolah: [''],
      // foto: [''],
      prodi_id: ['null'],
    });
  }

  ngOnInit(): void {  // Lifecycle hook ngOnInit dipanggil saat komponen diinisialisasi
    this.getMahasiswa();  // Memanggil method getFakultas saat komponen diinisialisasi
    this.getProdi();
  }

  getMahasiswa(): void {  // Method untuk mengambil data fakultas dari API
    // Mengambil data dari API menggunakan HttpClient
    this.http.get<any[]>(this.apiMahasiswaUrl).subscribe({
      next: (data) => {  // Callback untuk menangani data yang diterima dari API
        this.mahasiswa = data;  // Menyimpan data yang diterima ke dalam properti fakultas
        console.log('Data Mahasiswa:', this.mahasiswa);  // Mencetak data fakultas di console untuk debugging
        this.isLoading = false;  // Mengubah status loading menjadi false, yang akan menghentikan tampilan loader
      },
      error: (err) => {  // Callback untuk menangani jika terjadi error saat mengambil data
        console.error('Error fetching mahasiswa data:', err);  // Mencetak error di console untuk debugging
        this.isLoading = false;  // Tetap mengubah status loading menjadi false meskipun terjadi error, untuk menghentikan loader
      },
    });
  }
  getProdi(): void {
    this.http.get<any[]>(this.apiProdiUrl).subscribe({ // Melakukan HTTP GET ke API fakultas.
      next: (data) => { // Callback jika request berhasil.
        this.prodi = data; // Menyimpan data fakultas ke variabel.
      },
      error: (err) => { // Callback jika request gagal.
        console.error('Error fetching prodi data:', err); // Log error ke konsol.
      },
    });
  }
  deleteMahasiswa(_id: string): void {
    if (confirm('Apakah Anda yakin ingin menghapus data ini?')) { // Konfirmasi penghapusan

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}`};

      this.http.delete(`${this.apiMahasiswaUrl}/${_id}`,{headers}).subscribe({
        next: () => {
          console.log(`mahasiswa dengan ID ${_id} berhasil dihapus`);
          this.getMahasiswa(); // Refresh data prodi setelah penghapusan
        },
        error: (err) => {
          console.error('Error menghapus mahasiswa:', err); // Log error jika penghapusan gagal
        }
      });
    }
  }
  editMahasiswaId: string | null = null; // ID prodi yang sedang diubah

  // Method untuk mendapatkan data prodi berdasarkan ID
  getMahasiswaById(_id: string): void {
    this.editMahasiswaId = _id; // Menyimpan ID prodi yang dipilih
    this.http.get(`${this.apiMahasiswaUrl}/${_id}`).subscribe({
      next: (data: any) => {
        // Isi form dengan data yang diterima dari API
        this.mahasiswaForm.patchValue({
          npm: data.npm,
          nama: data.nama,
          jenis_kelamin: data.jenis_kelamin,
          asal_sekolah: data.asal_sekolah,
          prodi_id: data.prodi_id,
        });

        // Buka modal edit
        const modalElement = document.getElementById('editMahasiswaModal') as HTMLElement;
        if (modalElement) {
          const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
          modalInstance.show();
        }
      },
      error: (err) => {
        console.error('Error fetching mahasiswa data by ID:', err);
      },
    });
  }

  // Method untuk mengupdate data prodi
  updateMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}`};

      this.http.put(`${this.apiMahasiswaUrl}/${this.editMahasiswaId}`, this.mahasiswaForm.value, {headers}).subscribe({
        next: (response) => {
          console.log('Mahasiswa berhasil diperbarui:', response);
          this.getMahasiswa(); // Refresh data prodi
          this.isSubmitting = false;

          // Tutup modal edit setelah data berhasil diupdate
          const modalElement = document.getElementById('editMahasiswaModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement);
            modalInstance?.hide();
          }
        },
        error: (err) => {
          console.error('Error updating mahasiswa:', err);
          this.isSubmitting = false;
        },
      });
    }
  }

  // Method untuk menambahkan fakultas
  addMahasiswa(): void {
    if (this.mahasiswaForm.valid) {
      this.isSubmitting = true;  // Set status submitting

      const token = localStorage.getItem('authToken');
      const headers = { Authorization: `Bearer ${token}`};

      this.http.post(this.apiMahasiswaUrl, this.mahasiswaForm.value, {headers}).subscribe({
        next: (response) => {
          console.log('Data berhasil ditambahkan:', response);
          this.getMahasiswa();  // Refresh data fakultas
          this.mahasiswaForm.reset();  // Reset formulir
          this.isSubmitting = false;  // Reset status submitting

          // Tutup modal setelah data berhasil ditambahkan
          const modalElement = document.getElementById('tambahMahasiswaModal') as HTMLElement;
          if (modalElement) {
            const modalInstance = bootstrap.Modal.getInstance(modalElement) || new bootstrap.Modal(modalElement);
            modalInstance.hide();

            // Hapus elemen backdrop jika ada
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop) {
              backdrop.remove();
            }

            // Pulihkan scroll pada body
            document.body.classList.remove('modal-open');
            document.body.style.overflow = '';
            document.body.style.paddingRight = '';
          }
        },
        error: (err) => {
          console.error('Error menambahkan mahasiswa:', err);
          this.isSubmitting = false;
        },
      });
    }
  }
}
// import { CommonModule } from '@angular/common';  // Mengimpor CommonModule agar dapat menggunakan fitur-fitur dasar Angular seperti *ngIf dan *ngFor
// import { Component, OnInit, inject } from '@angular/core';  // Mengimpor dekorator Component, lifecycle hook OnInit, dan inject untuk injeksi HttpClient pada komponen standalone
// import { HttpClient } from '@angular/common/http';  // Mengimpor HttpClient untuk melakukan HTTP request

// @Component({
//   selector: 'app-mahasiswa',  // Nama selector untuk komponen ini. Komponen akan digunakan di template dengan tag <app-fakultas></app-fakultas>
//   standalone: true,  // Menyatakan bahwa komponen ini adalah komponen standalone dan tidak membutuhkan module tambahan
//   imports: [CommonModule],  // Mengimpor CommonModule untuk memungkinkan penggunaan direktif Angular standar seperti *ngIf dan *ngFor di template
//   templateUrl: './mahasiswa.component.html',  // Path ke file template HTML untuk komponen ini
//   styleUrl: './mahasiswa.component.css'  // Path ke file CSS untuk komponen ini
// })
// export class MahasiswaComponent implements OnInit {  // Deklarasi komponen dengan mengimplementasikan lifecycle hook OnInit
//   mahasiswa: any[] = [];  // Mendeklarasikan properti fakultas yang akan menyimpan data yang diterima dari API
//   apiUrl = 'http://localhost:3000/api/mahasiswa';  // URL API yang digunakan untuk mendapatkan data fakultas
//   isLoading = true;  // Properti untuk status loading, digunakan untuk menunjukkan loader saat data sedang diambil

//   private http = inject(HttpClient);  // Menggunakan inject untuk mendapatkan instance HttpClient di dalam komponen standalone (untuk Angular versi terbaru yang mendukung pendekatan ini)

//   ngOnInit(): void {  // Lifecycle hook ngOnInit dipanggil saat komponen diinisialisasi
//     // Mengambil data dari API menggunakan HttpClient
//     this.http.get<any[]>(this.apiUrl).subscribe({
//       next: (data) => {  // Callback untuk menangani data yang diterima dari API
//         this.mahasiswa = data;  // Menyimpan data yang diterima ke dalam properti fakultas
//         console.log('Data Mahasiswa:', this.mahasiswa);  // Mencetak data fakultas di console untuk debugging
//         this.isLoading = false;  // Mengubah status loading menjadi false, yang akan menghentikan tampilan loader
//       },
//       error: (err) => {  // Callback untuk menangani jika terjadi error saat mengambil data
//         console.error('Error fetching mahasiswa data:', err);  // Mencetak error di console untuk debugging
//         this.isLoading = false;  // Tetap mengubah status loading menjadi false meskipun terjadi error, untuk menghentikan loader
//       },
//     });
//   }
// }

// import { Component } from '@angular/core';

// @Component({
//   selector: 'app-mahasiswa',
//   imports: [],
//   templateUrl: './mahasiswa.component.html',
//   styleUrl: './mahasiswa.component.css'
// })
// export class MahasiswaComponent {

// }