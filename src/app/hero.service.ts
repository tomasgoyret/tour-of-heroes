import { Injectable } from '@angular/core';
import { Hero } from './hero';
import { HEROES } from './mock-heroes';
import { catchError, Observable, of } from 'rxjs';
import { MessageService } from './message.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HeroService {

  private heroesUrl = 'api/heroes';

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
        catchError(this.handleError<Hero[]>('getHeroes', []))
      );
  }

  getHero(id : number) : Observable<Hero> {
    const hero = HEROES.find(h=> h.id === id)!;
    this.messageService.add(`HeroService : fetched hero id=${id}`);
    return of(hero);
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