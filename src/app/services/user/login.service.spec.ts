import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { LoginService } from './login.service';
import { User } from '../../model/user';
import { RefreshToken } from '../../model/refresh-token';
import { environment } from '../../environments/environment';

describe('LoginService', () => {
  let service: LoginService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [LoginService],
    });

    service = TestBed.inject(LoginService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should send a POST request to /auth/login with the correct headers', () => {
    const mockUser: User = { username: 'testuser', password: 'testpass' };
  
    service.auth(mockUser).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/login`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(mockUser);
    req.flush({});
  });

  it('should send a POST request to /auth/token/refresh/ with the correct headers', () => {
    const mockRefreshToken: RefreshToken = { refresh: 'mock-refresh-token' };
  
    service.refresh(mockRefreshToken).subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/token/refresh/`);
    expect(req.request.method).toBe('POST');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.body).toEqual(mockRefreshToken);
    req.flush({});
  });

  it('should send a GET request to /auth/me with Authorization header', () => {
    const mockAccessToken = 'mock-access-token';
    localStorage.setItem('access-token', mockAccessToken);
  
    service.me().subscribe();
  
    const req = httpMock.expectOne(`${environment.apiUrl}/auth/me`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('Content-Type')).toBe('application/json');
    expect(req.request.headers.get('Authorization')).toBe('Bearer ' + mockAccessToken);
    req.flush({});
  });

  it('should return HttpHeaders with Content-Type application/json', () => {
    const headers = service.getHttpHeaders();
    expect(headers.get('Content-Type')).toBe('application/json');
  });

  it('should return HttpHeaders with Authorization and Content-Type', () => {
    const mockAccessToken = 'mock-access-token';
    localStorage.setItem('access-token', mockAccessToken);
  
    const headers = service.getHttpHeadersWithBearer();
    expect(headers.get('Content-Type')).toBe('application/json');
    expect(headers.get('Authorization')).toBe('Bearer ' + mockAccessToken);
  });
});
