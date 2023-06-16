import { useState } from "react"

const Button = ({ name, handleClick }) => {
  return <button onClick={handleClick}>{name}</button>
}

const ShowAnecdote = ({ anecdote, votes }) => {
  return (
    <div>
      <div>{anecdote}</div>
      <div> has {votes} votes</div>
    </div>
  )
}

const ShowMostVotedAnecdote = ({ anecdotes, votes }) => {
  const mostVoted = votes.indexOf(Math.max(...votes))

  return (
    <div>
      <ShowAnecdote anecdote={anecdotes[mostVoted]} votes={votes[mostVoted]} />
    </div>
  )
}

const App = () => {
  const anecdotes = [
    "If it hurts, do it more often.",
    "Adding manpower to a late software project makes it later!",
    "The first 90 percent of the code accounts for the first 90 percent of the development time...The remaining 10 percent of the code accounts for the other 90 percent of the development time.",
    "Any fool can write code that a computer can understand. Good programmers write code that humans can understand.",
    "Premature optimization is the root of all evil.",
    "Debugging is twice as hard as writing the code in the first place. Therefore, if you write the code as cleverly as possible, you are, by definition, not smart enough to debug it.",
    "Programming without an extremely heavy use of console.log is same as if a doctor would refuse to use x-rays or blood tests when dianosing patients.",
    "The only way to go fast, is to go well.",
  ]

  const [selected, setSelected] = useState(0)
  const [votes, setVotes] = useState(Array(anecdotes.length).fill(0))

  const getRandomArbitrary = (min, max) => {
    const randNumber = Math.floor(Math.random() * (max - min) + min)
    return randNumber
  }

  const addVote = () => {
    const newVotes = [...votes]
    newVotes[selected] = votes[selected] + 1
    setVotes(newVotes)
  }

  return (
    <div>
      <h1>Anecdote of the day</h1>
      <ShowAnecdote anecdote={anecdotes[selected]} votes={votes[selected]} />
      <Button name="vote" handleClick={() => addVote()} />
      <Button
        name="next anecdote"
        handleClick={() => setSelected(getRandomArbitrary(0, anecdotes.length))}
      />
      <h1>Anecdote with most votes</h1>
      <ShowMostVotedAnecdote anecdotes={anecdotes} votes={votes} />
    </div>
  )
}

export default App






