import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { catchError, tap, map, Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';
  httpOptions = {
    headers : new HttpHeaders({'Content-Type':'application/json'})
  }

  constructor(
    private messageService : MessageService,
    private http: HttpClient
  ) {}

  private log (message: string) {
    this.messageService.add(`HeroService: ${message}`)
  }

  private handleError<T>(operation = 'operation', result?: T){
    return (error: any) : Observable<T> => {
      console.error(error)
      this.log(`${operation} failed : ${error.message}`);
      return of(result as T);
    }
  }

  getHeroes() : Observable<Hero[]> {
    return this.http.get<Hero[]>(this.heroesUrl)
      .pipe(
        tap(_ => this.log("fetched heroes")),
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id : number) : Observable<Hero> {
    const url = `${this.heroesUrl}/${id}`;
    return this.http.get<Hero>(url)
      .pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
  }

  updateHero(hero : Hero) : Observable<any> {
    return this.http.put(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap(_=> this.log(`update hero id = ${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      )
  }

  addHero(hero : Hero) : Observable<Hero> {
    return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions)
      .pipe(
        tap((newHero : Hero) => this.log(`added hero w/ id=${newHero.id}`)),
        catchError(this.handleError<Hero>('addHero'))
      );
  }
}


// HttpClient methods return one value


// All HttpClient methods return an RxJS Observable of something.

// HTTP is a request/response protocol. You make a request, it returns a single response.

// In general, an observable can return multiple values over time. An observable from HttpClient always emits a single value and then completes, never to emit again.

// This particular HttpClient.get() call returns an Observable<Hero[]>; that is, "an observable of hero arrays". In practice, it will only return a single hero array.

// HttpClient.get() returns response data
// HttpClient.get() returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]> , adds TypeScript capabilities, which reduce errors during compile time.

// The server's data API determines the shape of the JSON data. The Tour of Heroes data API returns the hero data as an array.

// Other APIs may bury the data that you want within an object. You might have to dig that data out by processing the Observable result with the RxJS map() operator.

// Although not discussed here, there's an example of map() in the getHeroNo404() method included in the sample source code.