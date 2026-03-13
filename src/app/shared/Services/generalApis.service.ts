import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class GeneralApisService {
  private baseUrl = 'https://api.freeprojectapi.com/api/ProjectCompetition';

  constructor(private http: HttpClient) {}

  // Dashboard
  getDashboardSummary(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetDashboardSummary`);
  }

  // Competitions
  getAllCompetitions(): Observable<any> {
    return this.http.get(`${this.baseUrl}/GetAllCompetition`);
  }

  getCompetitionById(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/competition/${id}`);
  }

  createCompetition(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/competition`, payload);
  }

  updateCompetition(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update/${id}`, payload);
  }

  deleteCompetition(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete/${id}`);
  }

  // Users
  getAllUsers(): Observable<any> {
    return this.http.get(`${this.baseUrl}/all-users`);
  }

  getUserById(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/user/${id}`);
  }

  registerUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/register`, payload);
  }

  loginUser(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/login`, payload);
  }

  // Projects
  createProject(payload: any): Observable<any> {
    return this.http.post(`${this.baseUrl}/project`, payload);
  }

  getProjectById(id: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/project/${id}`);
  }

  updateProjectSubmission(id: string | number, payload: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/update-submission/${id}`, payload);
  }

  deleteProjectSubmission(id: string | number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/delete-submission/${id}`);
  }

  approveProject(id: string | number, payload?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/approve/${id}`, payload || {});
  }

  rejectProject(id: string | number, payload?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/reject/${id}`, payload || {});
  }

  markProjectWinner(id: string | number, payload?: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/project/winner/${id}`, payload || {});
  }

  getProjectsByCompetition(competitionId: string | number): Observable<any> {
    return this.http.get(`${this.baseUrl}/project/byCompetition/${competitionId}`);
  }
}
