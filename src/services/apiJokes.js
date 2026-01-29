const API_URL =
  "https://v2.jokeapi.dev/joke/Programming,Miscellaneous,Dark,Pun?blacklistFlags=political,explicit&amount=10";

export async function getJoke() {
  const res = await fetch(`${API_URL}`);

  if (!res.ok) throw Error("Failed getting Jokes");

  const { jokes } = await res.json();
  console.log(jokes);

  return jokes;
}
