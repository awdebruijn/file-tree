import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FileTree, FileTreeSchema } from '../schemas/schemas';
import { map } from 'rxjs';
import * as z from 'zod';

@Injectable({
  providedIn: 'root',
})
export class ItemsService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/api';

  getAllItems() {
    return this.http.get<FileTree>(`${this.baseUrl}/warehouse/all-items/`).pipe(
      map((data) => {
        const parsedData = FileTreeSchema.parse(data);
        if (parsedData) {
          return parsedData;
        }
        throw new z.ZodError([]);
      }),
    );
  }
}
