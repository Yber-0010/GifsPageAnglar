import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Gif, SearchReponse } from '../interfaces/gifs.interfaces';

@Injectable({
  providedIn: 'root'
})
export class GifsService {

  public gifList: Gif[] = [];

  private _tagsHistory: string[] = [];
  private apiKey:string ='NsszL18IlEBYqvKI3q1wVgwDCwZpFPDi';
  private serviceUrl:string='https://api.giphy.com/v1/gifs';

  constructor( private http:HttpClient ) {
    this.loadLocalStorage();
  }

  get tagsHistory(){
    return [...this._tagsHistory];
  }

  private organizeHistory(tag:string):void{
    tag = tag.toLowerCase();
    if( this._tagsHistory.includes(tag)){
      this._tagsHistory = this._tagsHistory.filter((oldTag)=> oldTag !== tag )
    }
    this._tagsHistory.unshift(tag);
    this._tagsHistory = this._tagsHistory.splice(0,10);
    this.saveLocalStorage();
  }

  private saveLocalStorage():void{
    localStorage.setItem('history',JSON.stringify(this._tagsHistory))
  }
  private loadLocalStorage():void{
    if ( !localStorage.getItem('history') )return;
    this._tagsHistory = JSON.parse(localStorage.getItem('history')!)
    if ( this._tagsHistory.length === 0 ) return;
    this.searchTag(this._tagsHistory[0]);
  }


  searchTag(tag:string):void{
    if(tag.length === 0 )return;
    this.organizeHistory(tag);
    const params = new HttpParams()
    .set('api_key',this.apiKey)
    .set('limit','10')
    .set('q',tag)
    this.http.get<SearchReponse>(`${this.serviceUrl}/search`,{params:params})
    .subscribe(
      resp => {
        this.gifList = resp.data;
        console.log({gifs: this.gifList});
      }
    )
  }
  // async searchTag(tag:string):Promise<void>{
  //   if(tag.length === 0 )return;
  //   this.organizeHistory(tag);
  //   una forma de llamar al servicio
  //   fetch('https://api.giphy.com/v1/gifs/search?api_key=NsszL18IlEBYqvKI3q1wVgwDCwZpFPDi&q=goku&limit=10')
  //   .then( resp => resp.json())
  //   .then( data => console.log(data))
  //   otra forma de llamar al servicio
  //   const resp = await fetch('https://api.giphy.com/v1/gifs/search?api_key=NsszL18IlEBYqvKI3q1wVgwDCwZpFPDi&q=goku&limit=10');
  //   const data = await resp.json();
  //   console.log(data)
  //}
}
