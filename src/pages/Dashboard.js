import React, { useState, useEffect } from 'react';


function Dashboard() {

    const [count, setCount] = useState(0);
    const [items, setItems] = useState([]);
    const [query, setQuery] = useState("");

    useEffect(() => {
        console.log('mounted');

        const temp = [];
        temp.push({ name: "karel" });
        temp.push({ name: "lojza" });
        setItems(temp);
    }, []);

    const x = <h1>jarda</h1>;

    function handleInput(event) {
        console.log(event.value);
      }

    return (
        <div>
            {items.map(d => (<li key={d.name}>{d.name}</li>))}
            <input type="text" name='kuk' value= "ddd" onChange={handleInput} />
        </div>
    );
}

export default Dashboard;
