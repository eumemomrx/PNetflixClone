import React, {useEffect, useState} from "react";
import tmdb from "./tmdb";
import './App.css'
import MovieRow from "./components/MovieRow/MovieRow";
import Header from "./components/Header/Header"
import FeaturedMovie from "./components/FeaturedMovie/FeaturedMovie";

function App() {
  const [movieList, setMovieList] = useState([]);
  const [featuredData, setFeaturedData] = useState(null);
  const [blackHeader, setBlackHeader] = useState(false);
  useEffect(()=>{
    const loadAll = async ( ) =>{
      let list = await tmdb.getHomeList();
      setMovieList(list);
      let originals = list.filter(i=>i.slug === 'originals');
      let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
      let chosen = originals[0].items.results[randomChosen];
      let chosenInfo = await tmdb.getMovieInfo(chosen.id,'tv');
      setFeaturedData(chosenInfo)
    }
    loadAll();
  }, []);
  useEffect(()=>{
    const scrollListener = () =>{
      if(window.scrollY > 10){
        setBlackHeader(true);
      }else{
        setBlackHeader(false);
      }
    }
    window.addEventListener('scroll', scrollListener);
    return () =>{
      window.removeEventListener('scroll', scrollListener);
    }
  },[])
  return(
    <div className="page">
      <Header black={blackHeader}/>
      {featuredData &&
        <FeaturedMovie item={featuredData}/>
      }
      <section className="lists">
        {movieList.map((item, key)=>(
          <MovieRow key={key} title={item.title} items={item.items} />
        ))}
      </section>
      <footer>
        Direitos de imagem para Netflix<br/>
        Dados retirados do site <a href="https://themoviedb.org" target="_blank">Themoviedb.org</a>
      </footer>
      {movieList<=0 &&
        <div className="loading">
          <img src="https://rchandru.com/images/portfolio/loading.gif" alt="Carregando" />
        </div>
      }
    </div>
  )
}
export default App;