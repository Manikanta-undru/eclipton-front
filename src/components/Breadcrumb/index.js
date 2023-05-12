import React from 'react';
import A from '../A';
import './styles.scss';

function Breadcrumb(props) {
  // const [type, setType] = useState(props.type != undefined ? props.limit : "primary");
  // const [size, setSize] = useState(props.size != undefined ? props.size : "");
  const last = props.items.length - 1;
  return (
    <ul className="breadcrumb">
      {props.items.map((e, i) => (
        <li key={i}>{i == last ? e.name : <A href={e.link}>{e.name}</A>}</li>
      ))}
    </ul>
  );
}

export default Breadcrumb;
