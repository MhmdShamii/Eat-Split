import { useState } from "react";
import "./app.css";

export default function App() {
  const [freinds, seFreinds] = useState([]);
  const [selected, setSelected] = useState(null);

  function handleAddFreind(freind) {
    seFreinds([...freinds, freind]);
  }

  function handleSelected(friend) {
    if (friend === selected) setSelected(null);
    else setSelected(friend);
  }

  function handleSplitBill(id, amount) {
    seFreinds(
      freinds.map((friend) =>
        friend.id === id
          ? { ...friend, balance: friend.balance + amount }
          : friend
      )
    );
    setSelected(null);
  }

  return (
    <div className="app">
      <FreindList
        freindList={freinds}
        addFreind={handleAddFreind}
        selected={selected}
        handleSelected={handleSelected}
      />
      <Main key={selected.id} active={selected} onSplit={handleSplitBill} />
    </div>
  );
}

function FreindList({ freindList, addFreind, selected, handleSelected }) {
  return (
    <div className="SecOne">
      {freindList.length > 0 ? (
        <ul>
          {freindList.map((freind) => (
            <Freind
              freind={freind}
              key={freind.id}
              selected={selected}
              handleSelected={handleSelected}
            />
          ))}
        </ul>
      ) : (
        <div className="prompt">Start By Adding freinds</div>
      )}
      <Form addFreind={addFreind} />
    </div>
  );
}
function Freind({ freind, selected, handleSelected }) {
  return (
    <li key={freind.id} className={selected === freind ? "selected" : ""}>
      <img src={freind.image} alt={freind.name} />
      <div>
        <p>{freind.name}</p>
        <p
          className={
            freind.balance < 0 ? "red" : freind.balance > 0 ? "green" : null
          }
        >
          {freind.balance < 0
            ? `You owe ${freind.name} ${-freind.balance}$`
            : freind.balance > 0
            ? `${freind.name} owe you ${freind.balance}$`
            : `you and ${freind.name} are even`}
        </p>
      </div>
      <Button onclick={() => handleSelected(freind)}>
        {selected === freind ? "Close" : "Select"}
      </Button>
    </li>
  );
}

function Button({ children, onclick }) {
  return (
    <button className="button" onClick={onclick}>
      {children}
    </button>
  );
}

function Form({ addFreind }) {
  const [fname, setname] = useState("");
  const [img, setimg] = useState("https://i.pravatar.cc/48");

  const [open, setopen] = useState(false);

  function handleForm() {
    setname("");
    setimg("https://i.pravatar.cc/48");
    setopen(!open);
  }

  function handleAddFreind(e) {
    e.preventDefault();

    if (!img || !fname) return;

    const id = crypto.randomUUID();
    const freind = {
      id: id,
      name: fname,
      image: `${img}?u=${id}`,
      balance: 0,
    };
    addFreind(freind);
    handleForm();
  }

  return (
    <>
      <Button onclick={handleForm}>{!open ? `Add Freind` : `Close`}</Button>
      {open && (
        <form className="form" onSubmit={(e) => handleAddFreind(e)}>
          <div>
            <span>Freind Name</span>
            <input
              type="text"
              value={fname}
              onChange={(e) => setname(e.target.value)}
            ></input>
          </div>
          <div>
            <span>Img URL</span>
            <input
              type="text"
              value={img}
              onChange={(e) => setimg(e.target.value)}
            ></input>
          </div>
          <Button>Add</Button>
        </form>
      )}
    </>
  );
}

function Main({ active, onSplit }) {
  const [bill, setBill] = useState(0);
  const [expense, setExpense] = useState(0);
  const [payer, setPayer] = useState("you");

  const activeExpense = bill - expense > 0 ? bill - expense : 0;

  function handleBillValue(bill) {
    if (Number.isInteger(bill)) {
      if (bill === 0) setExpense(0);
      setBill(bill);
    }
  }
  function handleExpenceValue(expense) {
    if (Number.isInteger(expense) && expense <= bill) {
      setExpense(expense);
    }
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || bill <= 0) return;

    let amount = 0;
    if (payer === "you") {
      amount = activeExpense;
    } else {
      amount = -expense;
    }
    setBill(0);
    setExpense(0);

    onSplit(active.id, amount);
  }

  return active ? (
    <form className="main" onSubmit={handleSubmit}>
      <h1>Split A Bill With {active.name}</h1>
      <div>
        <span>Bill Value</span>
        <input
          type="text"
          placeholder="Bill"
          value={bill}
          onChange={(e) => handleBillValue(Number(e.target.value))}
        />
      </div>
      <div>
        <span>Your Expense</span>
        <input
          type="text"
          placeholder="Bill"
          value={expense}
          onChange={(e) => handleExpenceValue(Number(e.target.value))}
        />
      </div>
      <div>
        <span>{active.name} Expense</span>
        <input
          type="text"
          placeholder="Bill"
          className="dead"
          value={activeExpense}
          readOnly
        />
      </div>
      <div>
        <span>Who will be paying</span>
        <select value={payer} onChange={(e) => setPayer(e.target.value)}>
          <option value={"you"}>you</option>
          <option value={active.name}>{active.name}</option>
        </select>
      </div>
      <Button>Split Bill</Button>
    </form>
  ) : (
    <div className="prompt main">Select A freind</div>
  );
}
