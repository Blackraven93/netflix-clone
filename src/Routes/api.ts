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