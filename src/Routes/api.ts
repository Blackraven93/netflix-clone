const API_KEY:string = "525728d5996611d5d8a99a90d7fe6026";
const BASE_PATH:string = "https://api.themoviedb.org/3"

interface IMovie {
    id:number;
    backdrop_path: string;
    poster_path: string;
    title: string;
    overview:string;
}


export interface IGetMoviesResult {
    dates: {
        maximum:string;
        minimum: string;
    };
    page: number,
    results: IMovie[];
    total_pages: number;
    total_results: number;
}

export function getMovies() {
    return fetch(`${BASE_PATH}/movie/now_playing?api_key=${API_KEY}`).then((response) => response.json())
};

export function getTopRateMovies() {
    return fetch(`${BASE_PATH}/movie/top_rated?api_key=${API_KEY}`).then((response) => response.json())
}

export function getUpcomingMovies() {
    return fetch(`${BASE_PATH}/movie/upcoming?api_key=${API_KEY}`).then((response) => response.json())
}


interface ITv {
    id: number;
    backdrop_path: string;
    poster_path: string;
    name: string;
    overview: string;
    type:string;
    status:string;
    vote_average: number;
    vote_count:number;
}

export interface IGetTvsResult {
    results: ITv[];
}


export function getLatestTv() {
    return fetch(`${BASE_PATH}/tv/airing_today?api_key=${API_KEY}`).then((response) => response.json())
}

export function getAiringTodayTv() {
    return fetch(`${BASE_PATH}/tv/on_the_air?api_key=${API_KEY}`).then((response) => response.json())
}

export function getPopularTv() {
    return fetch(`${BASE_PATH}/tv/popular?api_key=${API_KEY}`).then((response) => response.json())
}

export function getTopRatedTv() {
    return fetch(`${BASE_PATH}/tv/top_rated?api_key=${API_KEY}`).then((response) => response.json())
}


export function searchMovies(keyword:string|null) {
    return fetch(`${BASE_PATH}/search/movie?query=${keyword}&api_key=${API_KEY}`).then(
        response => response.json()
    );
}

export function searchTvs(keyword:string|null) {
    return fetch(`${BASE_PATH}/search/tv?query=${keyword}&api_key=${API_KEY}`).then(
        response => response.json()
    );
}


