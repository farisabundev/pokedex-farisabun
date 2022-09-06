import { useEffect, useState } from "react";
import axios from "axios";
import Head from "next/head";
import InfiniteScroll from "react-infinite-scroll-component";

import PokeCard from "../components/card";
import PokeEmptyState from "../components/empty";

const pokedexLogo = "/img/pokedex.png";

const Home = () => {
  const [pokemons, setPokemons] = useState([]);
  const [fullPokemons, setFullPokemons] = useState(false);

  const [filteredPokemons, setFilteredPokemons] = useState([]);
  const [pokemonTypes, setPokemonTypes] = useState([]);
  const [filterValue, setFilterValue] = useState("");
  const [offset, setOffset] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchTypes();
    fetchPokemon();
  }, []);

  useEffect(() => {
    if (!filterValue) {
      setFilteredPokemons(pokemons); // reset
    } else {
      setTimeout(() => {
        filterPokemon();
      }, 100);
    }
  }, [filterValue, pokemons]);

  const fetchTypes = async () => {
    const result = await axios.get("https://pokeapi.co/api/v2/type?limit=100");

    setPokemonTypes(result.data.results);
  };

  const fetchPokemon = async (callback) => {
    if (!fullPokemons) {
      if(!pokemons.length) {
        setIsLoading(true);
      }

      try {
        let finalData,
          result = await axios.get("https://pokeapi.co/api/v2/pokemon", {
            params: {
              offset: offset,
              limit: 40,
            },
          });

        if (result.data.results.length) {
          // get all url
          let allUrls = result.data.results.map((x) => axios.get(x.url));
          // promise all
          let allPokemonPromises = await axios.all(allUrls);
          // set new dataset
          let pokemonFinalData = allPokemonPromises
            .map((x) => x.data)
            .map((x) => {
              return {
                ...x,
                types: x.types.map((each) => each.type.name),
              };
            });

          finalData = pokemonFinalData;

          setOffset(offset + 40);
          setPokemons([...pokemons, ...finalData]);
          callback && callback();
        } else {
          setFullPokemons(false);
        }

        setTimeout(() => {
          setIsLoading(false);
        }, 500);
      } catch (error) {
        setIsLoading(false);
        throw error;
      }
    }
  };

  const filterPokemon = () => {
    let found = pokemons.filter((x) => {
      return x.types.includes(filterValue);
    });

    if (found.length < 40) {
      fetchPokemon(() => {
        setFilteredPokemons(found);
      });
    } else {
      setFilteredPokemons(found);
    }
  };

  const handleTypeChange = (e) => {
    setFilterValue(e.target.value);
  };

  return (
    <div>
      <Head>
        <title>Pokedex - FARISABUN</title>
        <meta name="description" content="Pokedex by farisabundev" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="container py-5">
        <div className="d-flex align-items-end mb-3">
          <div>
            <img
              className="logo-pokedex"
              src={pokedexLogo}
              alt="pokedex_logo"
            />
          </div>

          <div className="px-1">
            <label>by FARISABUN</label>
          </div>
        </div>

        <div className="pb-3 d-flex align-items-center ">
          <label className="form-label pe-3">Filter by nature:</label>
          <select
            className="form-select w-50"
            onChange={(e) => handleTypeChange(e)}
          >
            <option value="">Select nature</option>
            {pokemonTypes.map((each, index) => (
              <option value={each.name} key={index}>
                {each.name}
              </option>
            ))}
          </select>
        </div>

        {isLoading ? (
          <>Loading</>
        ) : (
          <>
            {!filteredPokemons.length ? (
              <PokeEmptyState />
            ) : (
              <>
                <InfiniteScroll
                  dataLength={filteredPokemons.length}
                  next={() => fetchPokemon()}
                  hasMore={!fullPokemons}
                  loader={<h4>Loading...</h4>}
                >
                  <div className="row pb-5">
                    {filteredPokemons.map((each, index) => (
                      <div className="col-md-3 col-sm-12" key={index}>
                        <PokeCard id={each.id} data={each} />
                      </div>
                    ))}
                  </div>
                </InfiniteScroll>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
