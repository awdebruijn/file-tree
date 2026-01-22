import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FolderTree, FolderTreeSchema } from '../schemas/schemas';
import { map } from 'rxjs';
import * as z from 'zod';

@Injectable({
  providedIn: 'root',
})
export class WareHouseService {
  private http = inject(HttpClient);
  baseUrl = 'http://localhost:3000/api';

  getFolderStructure() {
    return this.http.get<FolderTree>(`${this.baseUrl}/warehouse/all-items/`).pipe(
      map((data) => {
        const parsedData = FolderTreeSchema.safeParse(data);
        if (parsedData.error) {
          console.error(parsedData.error);
          throw new Error('Invalid folder structure data');
        } else {
          return parsedData.data;
        }
      }),
    );
  }
}
