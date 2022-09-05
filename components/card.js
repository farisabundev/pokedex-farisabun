import React from "react";

const PokeCard = (props) => {
  return (
    <div className="card mb-3 p-2">
      <div className="card-label text-center">
        <label className="text-uppercase">{props.data.name}</label>
      </div>

      <img
        src={`https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${props.id}.png`}
        alt={props.data.name}
      />

      <div className="py-3">
        <label>Abilities:</label>
        <br />
        <ul>
          {props.data.abilities.map((x, i) => (
            <li key={i}>{x.ability.name}</li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PokeCard;
