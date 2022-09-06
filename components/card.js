import React from "react";

const imgError = "/img/error-image.png";

const PokeCard = (props) => {
  return (
    <div className={`mb-3 p-2 card ${props.data.types[0]}`}>
      <div className="card-label">
        <label className={`text-uppercase ${props.data.name.length > 19 ? `smaller-size-${props.data.name.length}` : 'normal-size'}`}>{props.data.name}</label>
        <br />
      </div>

      <div className="card-type">
        {props.data.types.map((x, i) => (
          <img
            className="pokemon-type"
            key={i}
            src={`/img/${x}.png`}
          />
        ))}
      </div>

      <div className="card-image-wrapper">
        <img
          className="card-image"
          src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`}
          alt={props.data.name}
          onError={({ currentTarget }) => {
            currentTarget.onerror = null;
            currentTarget.src = imgError;
          }}
        />
      </div>

      <div className="py-3">
        <div className="card-abilities">
          <label>Abilities:</label>
          <br />
          <ul>
            {props.data.abilities.map((x, i) => (
              <li key={i}>{x.ability.name}</li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default PokeCard;
